package websocket

import (
	"backend/utils"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gorilla/websocket"
	"github.com/labstack/echo/v4"
)

var upgrader = websocket.Upgrader{
	WriteBufferSize: 1024,
	ReadBufferSize:  1024,
	CheckOrigin:     websocket.IsWebSocketUpgrade,
}

var hub = NewHub()

func Init() {
	go hub.Run()
}

func ConnectToRoom(c echo.Context) error {
	// userID := utils.GetUserID(c)
	// username := utils.GetUsername(c)

	token := c.QueryParam("token")
	if token == "" {
		return echo.NewHTTPError(http.StatusUnauthorized, "missing token")
	}

	userID, username, err := utils.VerifyToken(token)
	if err != nil {
		return echo.NewHTTPError(http.StatusUnauthorized, "invalid token")
	}

	roomId, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "invalid room id")
	}

	exists, err := utils.IsRoomExists(uint(roomId))
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "error checking room existence")
	}
	if !exists {
		return echo.NewHTTPError(http.StatusNotFound, "room not found")
	}

	conn, err := upgrader.Upgrade(c.Response(), c.Request(), nil)
	if err != nil {
		return err
	}

	client := &Client{
		ID:       userID,
		Username: username,
		RoomID:   uint(roomId),
		Conn:     conn,
		Send:     make(chan []byte),
	}

	hub.Register <- client

	go handleMessages(client)
	go WriteMessages(client)

	return nil
}

func handleMessages(client *Client) {
	defer func() {
		hub.Unregister <- client
		client.Conn.Close()
	}()

	for {
		_, msg, err := client.Conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error: %v", err)
			}
			break
		}

		message := Message{
			SenderID:       client.ID,
			SenderUsername: client.Username,
			Content:        msg,
			RoomID:         client.RoomID,
			Timestamp:      time.Now(),
		}

		hub.Broadcast <- message
	}
}

func WriteMessages(client *Client) {
	defer client.Conn.Close()
	for msg := range client.Send {
		if err := client.Conn.WriteMessage(websocket.TextMessage, msg); err != nil {
			log.Printf("error: %v", err)
			break
		}
	}
}
