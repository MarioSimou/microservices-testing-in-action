package internal

import (
	"encoding/json"
	"regexp"
	"fmt"
	"net/http"
	"strings"

	"github.com/julienschmidt/httprouter"
)

func HelloWithName(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	w.Header().Add("Content-Type", "application/json")

	var name = p.ByName("name")
	var regex = regexp.MustCompile("^\\w+$")

	if !regex.MatchString(name) {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(NewResponse(http.StatusBadRequest, fmt.Errorf("Error: Bad Request")))
		return
	}

	json.NewEncoder(w).Encode(NewResponse(http.StatusOK, fmt.Sprintf("hello %s", strings.Title(name))))
}