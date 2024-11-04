package main

import (
	"backend/config"
	"backend/controllers/websocket"
	"backend/routes"
	"log"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	echoMiddleware "github.com/labstack/echo/v4/middleware"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading env file", err)
	}

	e := echo.New()
	e.Use(echoMiddleware.LoggerWithConfig(echoMiddleware.LoggerConfig{
		Format: "${time_rfc3339} | ${method} | ${uri} | ${status} | ${latency_human} \n",
	}))

	e.Use(echoMiddleware.CORSWithConfig(echoMiddleware.CORSConfig{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{echo.GET, echo.POST, echo.PUT, echo.DELETE},
	}))

	config.Connect()
	config.Migrate()

	websocket.Init()

	routes.SetupRoutes(e)

	e.Logger.Fatal(e.Start(":8000"))
}
