package internal

type ResponseBody struct {
	Status int `json:"status"`
	Success bool `json:"success"`
	Message string `json:"message"`
	Data interface{} `json:"data"`
}

func NewResponse(status int, data interface{}) *ResponseBody {
	if e, ok := data.(error); ok {
		return &ResponseBody{
			Status: status,
			Success: false,
			Message: e.Error(),
		}
	}

	return &ResponseBody{
		Status: status,
		Success: true,
		Data: data,
	}
}
