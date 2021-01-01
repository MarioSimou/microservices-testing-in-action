package functional

import (
	"github.com/testcontainers/testcontainers-go/wait"
	"github.com/docker/go-connections/nat"
	"testing"
	"context"
	"net/http"
	"fmt"
	"log"
	"encoding/json"
	"time"
	"github.com/stretchr/testify/suite"
		"github.com/stretchr/testify/assert"

	"github.com/testcontainers/testcontainers-go"
	"hello-world/internal"
)

type endpointsSuite struct {
	suite.Suite
	ctx context.Context
	api *testcontainers.Container
	localhostPort string
}

func (es *endpointsSuite) SetupTest(){
	var ctx = context.Background()

	var req = testcontainers.ContainerRequest{
			Image: "microservices-in-action/api:prod",
			Name: "microservices-in-action-api-functional",
			ExposedPorts: []string{
				"3000/tcp",
			},
			AutoRemove: true,
			WaitingFor: wait.ForLog("The app listens on port 3000"),
	}

	var greq = testcontainers.GenericContainerRequest{
		ContainerRequest: req,
		Started: true,
	}

	var container testcontainers.Container
	var e error

	if container, e = testcontainers.GenericContainer(ctx, greq); e != nil {
		log.Fatalf("Error: %v\n", e)
	}

	var localhostPort nat.Port
	if localhostPort, e = container.MappedPort(ctx, "3000/tcp"); e != nil {
		log.Fatalf("Error: %v\n", e)
	}

	es.api = &container
	es.ctx = ctx
	es.localhostPort = localhostPort.Port()
}

func (es *endpointsSuite) TestEndpoints(){
	defer (*es.api).Terminate(es.ctx)
	
	var baseURL = fmt.Sprintf("http://localhost:%s", es.localhostPort) 

	var table = []struct{
		url string
		method string
		headers []http.Header
		expectedResponseBody internal.ResponseBody
		e error
	}{
		{
			url: fmt.Sprintf("%s/hello",  baseURL),
			method: http.MethodGet,
			headers: []http.Header{
				http.Header{
					"Content-Type": []string{"application/json"},
				},
			},
			expectedResponseBody: internal.ResponseBody{
				Status: 200,
				Success: true,
				Data: "hello",
			},
		},
		{
			url: fmt.Sprintf("%s/hello/!---",  baseURL),
			method: http.MethodGet,
			headers: []http.Header{
				http.Header{
					"Content-Type": []string{"application/json"},
				},
			},
			expectedResponseBody: internal.ResponseBody{
				Status: 400,
				Success: false,
				Message: "Error: Bad Request",
			},
		},
		{
			url: fmt.Sprintf("%s/hello/john",  baseURL),
			method: http.MethodGet,
			headers: []http.Header{
				http.Header{
					"Content-Type": []string{"application/json"},
				},
			},
			expectedResponseBody: internal.ResponseBody{
				Status: 200,
				Success: true,
				Data: "hello John",
			},
		},
	}

	var t = es.T()
	var assert = assert.New(t)
	var httpClient = http.Client{Timeout: time.Second * 10}

	for _, row := range table {
		var req *http.Request
		var res *http.Response
		var e error
		
		if req, e = http.NewRequest(row.method, row.url, nil); e != nil {
			t.Errorf("Error: %s\n", e.Error())
		}

		if res, e = httpClient.Do(req); e != nil {
			assert.EqualError(e, row.e.Error())
		}

		for _, header := range row.headers {
			for headerKey, _ := range header {
				var resHeaderValue = res.Header.Get(headerKey)
				assert.Equal(resHeaderValue, header.Get(headerKey))
			}
		}

		var resBody internal.ResponseBody
		if e := json.NewDecoder(res.Body).Decode(&resBody); e != nil {
			t.Errorf("Error: Failed decoding '%s'\n", e.Error())
		}
		
		assert.EqualValues(resBody, row.expectedResponseBody)
	}
}

func TestEndpointsSuite(t *testing.T){
	suite.Run(t, new(endpointsSuite))
}