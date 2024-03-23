create table users(
    id serial primary key,
    email varchar(100) not null unique,
    passhash varchar not null
);

INSERT INTO users(email, passhash) values ($1, $2);