package websocket

import (
	"backend/utils"
	"log"
	"net/http"
	"strconv"

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
	userID := utils.GetUserID(c)
	username := utils.GetUsername(c)

	roomId, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "invalid room id")
	}

	conn, err := upgrader.Upgrade(c.Response(), c.Request(), nil)
	if err != nil {
		return err
	}

	client := &Client{
		ID:       userID,
		Username: username,
		Room:     uint(roomId),
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
