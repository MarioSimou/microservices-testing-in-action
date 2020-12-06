package main

import (
	"fmt"
	"hello-world/internal"
	"log"
	"net/http"
	"os"

	"github.com/julienschmidt/httprouter"
)

func main(){
	var port = os.Getenv("PORT")
	
	if port == "" {
		port = "3000"
	}

	var address = fmt.Sprintf(":%s", port)
	var router = httprouter.New()
	
	router.GET("/hello", internal.HandleCORS(internal.Hello))
	router.GET("/hello/:name", internal.HandleCORS(internal.HelloWithName))

	fmt.Printf("The app listens on port %s\n", port)
	log.Fatal(http.ListenAndServe(address, router))
}