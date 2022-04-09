package server

import (
	"log"

	"github.com/devstackq/becoder/server/sql"
	"github.com/gin-gonic/gin"
)

type Server struct {
	Store  sql.Store
	Router *gin.Engine
}

func NewServer() *Server {
	return &Server{Router: gin.Default()}
}

func (s *Server) Routes() {
	group := s.Router.Group("/user")
	{
		group.GET("/")
	}
	if err := s.Router.Run(":8888"); err != nil {
		log.Fatal(err)
	}
}
