create database bd_app_notes2;

use bd_app_notes2;

create table if not exists categories
(
    id   int auto_increment
        primary key,
    name varchar(50) null,
    constraint name
        unique (name)
);

create table if not exists note
(
    body         varchar(250) not null,
    tag          varchar(50)  null,
    id           int auto_increment
        primary key,
    categorie_id int          null,
    archived     tinyint(1)   null,
    constraint note_ibfk_1
        foreign key (categorie_id) references categories (id)
            on delete set null
);

create table if not exists user
(
    id       int auto_increment
        primary key,
    name     varchar(50) not null,
    password varchar(50) not null
);