package main

import (
	"backend/config"
	"backend/controllers/websocket"
	"backend/routes"
	"fmt"
	"log"
	"net"

	"github.com/labstack/echo/v4"
	echoMiddleware "github.com/labstack/echo/v4/middleware"
)

func main() {
	// if err := godotenv.Load(); err != nil {
	// 	log.Fatal("Error loading env file", err)
	// }

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

	printIPs()

	routes.SetupRoutes(e)

	e.Logger.Fatal(e.Start(":8000"))
}

func printIPs() {
	addrs, err := net.InterfaceAddrs()
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Current IP addresses:")
	for _, addr := range addrs {
		if ipNet, ok := addr.(*net.IPNet); ok && !ipNet.IP.IsLoopback() {
			if ipNet.IP.To4() != nil {
				fmt.Print(ipNet.IP.String())
			}
		}
	}
}
