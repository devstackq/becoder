package main

import (
	"html/template"
	"log"
	"net/http"
)

func Index(w http.ResponseWriter, r *http.Request) {

	// r.Header.Add("Accept-Charset", "UTF-8")
	// w.Header().Set("Access-Control-Allow-Origin", "*")
	tmpl := template.Must(template.ParseFiles("../client/index.html"))
	tmpl.Execute(w, nil)

}
func main() {
	mux := http.NewServeMux()
	//file server
	mux.Handle("/statics/", http.StripPrefix("/statics/", http.FileServer(http.Dir("../client/statics/"))))
	log.Println("Run server..")
	mux.HandleFunc("/", Index)
	log.Println(http.ListenAndServe(":8888", mux))
}
