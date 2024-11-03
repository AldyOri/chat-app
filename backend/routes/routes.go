package routes

import (
	"backend/controllers"
	"backend/controllers/websocket"
	"backend/middleware"

	"github.com/labstack/echo/v4"
)

func SetupRoutes(e *echo.Echo) {
	apiGroup := e.Group("/api")

	authGroup := apiGroup.Group("/auth")
	authGroup.POST("/login", controllers.Login)
	authGroup.POST("/register", controllers.Register)
	authGroup.GET("/me", controllers.GetMe, middleware.JWTMiddleware())

	roomsGroup := apiGroup.Group("/rooms", middleware.JWTMiddleware())
	roomsGroup.POST("", controllers.CreateRoom)
	roomsGroup.GET("", controllers.GetRooms)
	roomsGroup.GET("/:id", controllers.GetRoomById)
	roomsGroup.POST("/:id/join", controllers.JoinRoom)

	// roomsGroup.GET("/:id/messages", controllers.GetMessages)
	// roomsGroup.POST("/:id/messages", controllers.SendMessages)

	roomsGroup.GET("/:id/ws", websocket.ConnectToRoom)
}
