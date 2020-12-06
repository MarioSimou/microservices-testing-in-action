package internal

import (
	"net/http"

	"github.com/julienschmidt/httprouter"
)


func HandleCORS(next httprouter.Handle) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
		w.Header().Add("Access-Control-Allow-Origin", "*")
		w.Header().Add("Access-Control-Allow-Methods", "GET, OPTIONS, PATCH")		
		next(w,r,p)
	}
}