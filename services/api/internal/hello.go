package internal

import (
	"encoding/json"
	"net/http"

	"github.com/julienschmidt/httprouter"
)

func Hello(w http.ResponseWriter, r *http.Request, _ httprouter.Params){
	w.Header().Add("Content-Type", "application/json")
	json.NewEncoder(w).Encode(NewResponse(http.StatusOK, "hello"))
}