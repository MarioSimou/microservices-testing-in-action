package test

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"hello-world/internal"

	"github.com/julienschmidt/httprouter"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
)

type helloSuite struct {
	suite.Suite
}

func (hs *helloSuite) TestHello(){
	var table = []struct{
		expectedResponse internal.ResponseBody
	}{
		{
			expectedResponse: internal.ResponseBody{
				Status: 200,
				Success: true,
				Data: "hello",
			},
		},
	}

	var t = hs.T()
	var assert = assert.New(t)

	for _, row := range table {
		var w = httptest.NewRecorder()
		var r = httptest.NewRequest(http.MethodGet, "/", nil)
		var p = httprouter.Params{}

		internal.Hello(w, r, p)
		var result = w.Result()
		var resBody internal.ResponseBody

		if e := json.NewDecoder(result.Body).Decode(&resBody); e != nil {
			t.Errorf("Error: Invalid object for decoding\n")
		}

		assert.Equal(result.StatusCode, row.expectedResponse.Status)
		assert.EqualValues(resBody, row.expectedResponse)
	}
}

func TestHelloSuite(t *testing.T){
	suite.Run(t, new(helloSuite))
}