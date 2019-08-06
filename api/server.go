package main

import (
	"net/http"

	"github.com/labstack/echo"
	"gopkg.in/go-playground/validator.v9"
)

type (
	User struct {
		Name  string `json:"name" form:"name" query:"name" validate:"required"`
		Email string `json:"email" form:"email" query:"email" validate:"required,email"`
	}

	CustomValidator struct {
		validator *validator.Validate
	}
)

func (cv *CustomValidator) Validate(i interface{}) error {
	return cv.validator.Struct(i)
}

func main() {
	e := echo.New()
	e.Validator = &CustomValidator{validator: validator.New()}
	e.POST("/user", func(c echo.Context) (err error) {
		u := new(User)
		if err = c.Bind(u); err != nil {
			return
		}
		if err = c.Validate(u); err != nil {
			return
		}
		return c.JSON(http.StatusOK, u)
	})
	e.HideBanner = true
	e.Logger.Fatal(e.Start(":1323"))
}
