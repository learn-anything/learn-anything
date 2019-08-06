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

var users []*User

func main() {
	e := echo.New()
	e.Validator = &CustomValidator{validator: validator.New()}
	e.GET("/users", getUsers)
	e.POST("/user", func(c echo.Context) (err error) {
		u := new(User)
		if err = c.Bind(u); err != nil {
			return
		}
		if err = c.Validate(u); err != nil {
			return
		}
		users = append(users, u)
		return c.JSON(http.StatusCreated, u)
	})
	e.HideBanner = true
	e.Logger.Fatal(e.Start(":1323"))
}

// e.GET("/users", getUsers)
func getUsers(c echo.Context) error {
	return c.JSON(http.StatusOK, users)
}
