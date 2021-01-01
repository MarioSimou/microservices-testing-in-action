package contract

import (
	"encoding/json"
	"fmt"
	"hello-world/internal"
	"net/http"
	"os"
	"path"
	"testing"

	"github.com/julienschmidt/httprouter"
	"github.com/pact-foundation/pact-go/dsl"
	"github.com/pact-foundation/pact-go/types"
	"github.com/stretchr/testify/suite"
)

type helloPactSuite struct {
	suite.Suite
}

func runServer(){
	var port = "3000"
	var address =fmt.Sprintf(":%s", port)
	var router = httprouter.New()
	var helloHandler = func(w http.ResponseWriter, r *http.Request, p httprouter.Params){
		w.Header().Add("Access-Control-Allow-Origin", "*")
		w.Header().Add("Content-Type", "application/json")
		json.NewEncoder(w).Encode(internal.NewResponse(http.StatusOK, "hello"))
	}
	var helloWithNameHandler = func(w http.ResponseWriter, r *http.Request, p httprouter.Params){
		w.Header().Add("Access-Control-Allow-Origin", "*")
		w.Header().Add("Content-Type", "application/json")
		json.NewEncoder(w).Encode(internal.NewResponse(http.StatusOK, "hello John"))
	}

	router.GET("/hello", helloHandler)
	router.GET("/hello/john", helloWithNameHandler)
	
	http.ListenAndServe(address, router)
}

func (hps *helloPactSuite) TestHelloPact(){
	go runServer()

	var brokerURL = os.Getenv("BROKER_URL")
	var brokerUsername = os.Getenv("BROKER_USERNAME")
	var brokerPassword = os.Getenv("BROKER_PASSWORD")
	var cwd, _ = os.Getwd()
	var pact = &dsl.Pact{
		Consumer: "ui",
		Provider: "api",
		LogDir: path.Join(cwd, "..", "logs"),
		PactDir: path.Join(cwd, "pacts"),
		DisableToolValidityCheck: true,
		LogLevel: "INFO",
	}

	var t = hps.T()
	var verifyConsumer = types.VerifyRequest{
		ProviderBaseURL: "http://localhost:3000",
		FailIfNoPactsFound: false,
		BrokerURL: brokerURL,
		BrokerUsername: brokerUsername,
		BrokerPassword: brokerPassword,
		PublishVerificationResults: true,
		ProviderVersion: "1.0.0",		
	}

	if _, e := pact.VerifyProvider(t, verifyConsumer); e != nil {
		t.Fatalf("Error: Expected valid contract between ui-api")
	}
}

func TestHelloPactSuite(t *testing.T){
	suite.Run(t, new(helloPactSuite))
}