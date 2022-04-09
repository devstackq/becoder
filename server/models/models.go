package models

import "time"

type Roles struct {
	ID   int64  `json:"roles_id"`
	Name string `json:"roles_name"`
}

type User struct {
	ID        int64     `json:"user_id"`
	Email     string    `json:"user_email"`
	Username  string    `json:"user_username"`
	Password  string    `json:"user_password"`
	Phone     string    `json:"user_phone"`
	Firstname string    `json:"user_firstname"`
	Lastname  string    `json:"user_lastname"`
	Created   time.Time `json:"user_created"`
}

type IndexUserOffice struct {
	ID int64 `json:"index_user_id"`
}

type HomeObject struct {
	ID       int64  `json:"home_object_id"`
	Username string `json:"home_object_username"`
	Address  string `json:"home_object_address"`
}

type HoveDevices struct {
	ID   int64  `json:"home_devices_id"`
	Name string `json:"home_devices_name"`
}

type HoveDevicesState struct {
	ID    int64  `json:"home_devices_state_id"`
	Name  string `json:"home_devices_state_name"`
	State bool   `json:"home_devices_state_state"`
}
