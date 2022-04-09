package main

import (
	"html/template"
	"net/http"

	"github.com/devstackq/becoder/server/server"
	"github.com/devstackq/becoder/server/sql"
)

func Index(w http.ResponseWriter, r *http.Request) {
	// r.Header.Add("Accept-Charset", "UTF-8")
	// w.Header().Set("Access-Control-Allow-Origin", "*")
	tmpl := template.Must(template.ParseFiles("../client/index.html"))
	tmpl.Execute(w, nil)
}

func main() {
	store := sql.Store{}

	server := server.NewServer(store)
	server.Routes()
	// mux := http.NewServeMux()
	// // file server
	// mux.Handle("/statics/", http.StripPrefix("/statics/", http.FileServer(http.Dir("../client/statics/"))))
	// log.Println("Run server..")
	// mux.HandleFunc("/", Index)
	// log.Println(http.ListenAndServe(":8888", mux))
}
