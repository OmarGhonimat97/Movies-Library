DROP TABLE IF EXISTS movies;

CREATE TABLE IF NOT EXISTS movies (
    id SERIAL PRIMARY KEY,
    title varchar(255),
    rate varchar(255),
    poster varchar(255),
    comment varchar (255)
);