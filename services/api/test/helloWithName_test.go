package test

import (
	"encoding/json"
	"hello-world/internal"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/julienschmidt/httprouter"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
)

type helloWithNameSuite struct {
	suite.Suite
}

func (hs *helloWithNameSuite) TestHelloWithName(){
	var table = []struct{
		expectedResponse internal.ResponseBody
		params httprouter.Params
	}{
		{
			params: httprouter.Params{},
			expectedResponse: internal.ResponseBody{
				Status: 400,
				Success: false,
				Message: "Error: Bad Request",
			},
		},
		{
			params: httprouter.Params{
				httprouter.Param{
					Key:"name",
					Value: "john", 
				},
			},
			expectedResponse: internal.ResponseBody{
				Status: 200,
				Success: true,
				Data: "hello John",
			},
		},
	}

	var t = hs.T()
	var assert = assert.New(t)

	for _, row := range table {
		var w = httptest.NewRecorder()
		var r = httptest.NewRequest(http.MethodGet, "/", nil)

		internal.HelloWithName(w, r, row.params)
		var result = w.Result()
		var resBody internal.ResponseBody

		if e := json.NewDecoder(result.Body).Decode(&resBody); e != nil {
			t.Errorf("Error: Invalid object for decoding\n")
		}

		assert.Equal(result.StatusCode, row.expectedResponse.Status)
		assert.EqualValues(resBody, row.expectedResponse)
	}
}

func TestHelloWithNameSuite(t *testing.T){
	suite.Run(t, new(helloWithNameSuite))
}