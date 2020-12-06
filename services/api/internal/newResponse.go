package internal

type Response struct {
	Status int `json:"status"`
	Success bool `json:"success"`
	Message string `json:"message"`
	Data interface{} `json:"data"`
}

func NewResponse(status int, data interface{}) *Response {
	if e, ok := data.(error); ok {
		return &Response{
			Status: status,
			Success: false,
			Message: e.Error(),
		}
	}

	return &Response{
		Status: status,
		Success: true,
		Data: data,
	}
}
