DROP TABLE Relationships;
DROP TABLE People;

CREATE TABLE People (
    Id  SERIAL PRIMARY KEY,
    Firstname varchar,
    Lastname varchar,
    Birthday Date
);

CREATE TABLE Relationships (
    Id SERIAL PRIMARY KEY,
    Parent int REFERENCES People(id),
    Child int REFERENCES People(id)
);

INSERT INTO People (Firstname, Lastname, Birthday) VALUES ('John', 'Doe', '10-11-89');
INSERT INTO People (Firstname, Lastname, Birthday) VALUES ('Jane', 'Doe', '5-23-89');
INSERT INTO People (Firstname, Lastname, Birthday) VALUES ('Jacob', 'Doe', '7-8-14');
SELECT * FROM People;

INSERT INTO Relationships (Parent, Child) VALUES (1,3);
INSERT INTO Relationships (Parent, Child) VALUES (2,3);
SELECT * FROM Relationships;