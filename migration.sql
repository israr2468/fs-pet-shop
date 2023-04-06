DROP TABLE IF EXISTS pets;

CREATE TABLE pets (
    id serial PRIMARY KEY,
    name varchar(25),
    kind varchar(25),
    age integer
)