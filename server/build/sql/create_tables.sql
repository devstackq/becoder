--todo : additional : change or add new fields , table ?

--admin, guest, owner
CREATE TABLE smart_home_roles
(
    role_id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

-- authorization
CREATE TABLE smart_home_user
(
    user_id BIGSERIAL PRIMARY KEY,
    email varchar(255) NOT NULL UNIQUE,
    username VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(128) NOT NULL,
    phone DECIMAL NOT NULL,
    first_name VARCHAR(150) NOT NULL,
    last_name VARCHAR(150) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    role_id INTEGER NOT NULL REFERENCES smart_home_roles(role_id) ON DELETE CASCADE ON UPDATE CASCADE
);
--Many -to many user - home 

CREATE TABLE smart_home_index_user_office
(
    user_office_id BIGSERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES smart_home_user(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    object_id INTEGER NOT NULL REFERENCES smart_home_object(object_id) ON DELETE CASCADE ON UPDATE CASCADE
);

--home uniq id, creds
CREATE TABLE smart_home_object
(
    object_id BIGSERIAL PRIMARY KEY,
    username VARCHAR(150) NOT NULL UNIQUE,
    address VARCHAR(128) NOT NULL
);

-- svet, otoplenie, signalka, face recog,etc
CREATE TABLE smart_home_devices
(
    device_id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE,
    object_id INTEGER NOT NULL REFERENCES smart_home_object(object_id) ON DELETE CASCADE ON UPDATE CASCADE
);

--on, off, auto
CREATE TABLE smart_home_devices_state
(
    device_id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE,
    state BOOLEAN,
    device_id INTEGER NOT NULL REFERENCES smart_home_device(device_id) ON DELETE CASCADE ON UPDATE CASCADE
);