package test

import (
	"fmt"
	"hello-world/internal"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
)

type newResponseSuite struct {
	suite.Suite
}

func (hs *newResponseSuite) TestNewResponse(){
	var table = []struct{
		status int
		data interface{}
		expectedResponse *internal.ResponseBody
	}{
		{
			status: 200,
			data: "hello",
			expectedResponse: &internal.ResponseBody{
				Status: 200,
				Success: true,
				Data: "hello",
			},
		},
		{
			status: 400,
			data: fmt.Errorf("Error: Bad Request"),
			expectedResponse: &internal.ResponseBody{
				Status: 400,
				Success: false,
				Message: "Error: Bad Request",
			},
		},
	}

	var t = hs.T()
	var assert = assert.New(t)

	for _, row := range table {
		assert.Equal(internal.NewResponse(row.status, row.data), row.expectedResponse)
	}
}

func TestNewResponseSuite(t *testing.T){
	suite.Run(t, new(newResponseSuite))
}