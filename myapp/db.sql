-- Drop old tables if they are there
DROP TABLE Users;
DROP TABLE Majors;
DROP TABLE Colleges;
DROP TABLE Apartments;
DROP TABLE Complexes;
DROP TABLE Mentors;
DROP TABLE ITeams;

-- Create new tables
CREATE TABLE ITeams (
	id			SERIAL PRIMARY KEY,
	number		INT NOT NULL UNIQUE
);

CREATE TABLE Mentors (
	id			SERIAL PRIMARY KEY,
	name		VARCHAR NOT NULL,
	phone		VARCHAR(20) NOT NULL,
	iTeamId		INT REFERENCES ITeams(id)
);

CREATE TABLE Complexes (
	id			SERIAL PRIMARY KEY,
	name		VARCHAR NOT NULL
);

CREATE TABLE Apartments (
	id			SERIAL PRIMARY KEY,
	number		VARCHAR NOT NULL,
	complexId	INT REFERENCES Complexes(id),
	iTeamId		INT REFERENCES ITeams(id)
);

CREATE TABLE Colleges (
	id			SERIAL PRIMARY KEY,
	name		VARCHAR NOT NULL,
	color		VARCHAR NOT NULL
);

CREATE TABLE Majors (
	id			SERIAL PRIMARY KEY,
	name		VARCHAR NOT NULL,
	collegeId	INT REFERENCES Colleges(id)
);

CREATE TABLE Users (
	id			SERIAL PRIMARY KEY,
	username	VARCHAR NOT NULL,
	password	VARCHAR NOT NULL
);

-- Populate new tables with data
-- -- Create I-Teams  
INSERT INTO ITeams (number) VALUES(1);
INSERT INTO ITeams (number) VALUES(2);
INSERT INTO ITeams (number) VALUES(3);
SELECT * FROM ITeams;
-- -- Create Mentors (2 per I-Team)
INSERT INTO Mentors (name, phone, iTeamId) VALUES('Sarah Denson','(123)555-6789',1);
INSERT INTO Mentors (name, phone, iTeamId) VALUES('Mike Haun','(123)555-6790',1);
INSERT INTO Mentors (name, phone, iTeamId) VALUES('Christy Bingham','(234)555-6791',2);
INSERT INTO Mentors (name, phone, iTeamId) VALUES('Andrew Allen','(234)555-6792',2);
INSERT INTO Mentors (name, phone, iTeamId) VALUES('Emily Duff','(345)555-6793',3);
INSERT INTO Mentors (name, phone, iTeamId) VALUES('Keaton Bennett','(345)555-6794',3);
SELECT * FROM Mentors;
-- -- Create Complexes
INSERT INTO Complexes (name) VALUES('Somerset');
INSERT INTO Complexes (name) VALUES('Nauvoo House');
SELECT * FROM Complexes;
-- -- Create Apartments (Nearby apartments should be in the same I-Team even if they are in different complexes)
INSERT INTO Apartments (number, complexId, iTeamId) VALUES('105',1,1);
INSERT INTO Apartments (number, complexId, iTeamId) VALUES('203',1,1);
INSERT INTO Apartments (number, complexId, iTeamId) VALUES('304',1,1);
INSERT INTO Apartments (number, complexId, iTeamId) VALUES('113',1,1);
INSERT INTO Apartments (number, complexId, iTeamId) VALUES('211',1,1);
INSERT INTO Apartments (number, complexId, iTeamId) VALUES('312',1,1);
INSERT INTO Apartments (number, complexId, iTeamId) VALUES('306',1,2);
INSERT INTO Apartments (number, complexId, iTeamId) VALUES('209',1,2);
INSERT INTO Apartments (number, complexId, iTeamId) VALUES('116',1,2);
INSERT INTO Apartments (number, complexId, iTeamId) VALUES('101',2,2);
INSERT INTO Apartments (number, complexId, iTeamId) VALUES('204',2,2);
INSERT INTO Apartments (number, complexId, iTeamId) VALUES('401',2,2);
INSERT INTO Apartments (number, complexId, iTeamId) VALUES('116',2,3);
INSERT INTO Apartments (number, complexId, iTeamId) VALUES('313',2,3);
INSERT INTO Apartments (number, complexId, iTeamId) VALUES('211',2,3);
INSERT INTO Apartments (number, complexId, iTeamId) VALUES('619',2,3);
INSERT INTO Apartments (number, complexId, iTeamId) VALUES('509',2,3);
INSERT INTO Apartments (number, complexId, iTeamId) VALUES('415',2,3);
SELECT * FROM Apartments;
-- -- Create Colleges 
INSERT INTO Colleges (name, color) VALUES('College of Agriculture and Life Sciences','Green');
INSERT INTO Colleges (name, color) VALUES('College of Business and Communication','Red');
INSERT INTO Colleges (name, color) VALUES('College of Education and Human Development','Purple');
INSERT INTO Colleges (name, color) VALUES('College of Language and Letters','Blue');
INSERT INTO Colleges (name, color) VALUES('College of Performing and Visual Arts','Yellow');
INSERT INTO Colleges (name, color) VALUES('College of Physical Sciences and Engineering','Orange');
INSERT INTO Colleges (name, color) VALUES('General Studies','Grey');
SELECT * FROM Colleges;
-- -- Create Majors
INSERT INTO Majors (name, collegeId) VALUES('Generals',7);
INSERT INTO Majors (name, collegeId) VALUES('Computer Science',6);
INSERT INTO Majors (name, collegeId) VALUES('Software Engineering',6);
INSERT INTO Majors (name, collegeId) VALUES('Graphical Design',5);
INSERT INTO Majors (name, collegeId) VALUES('Theater',5);
INSERT INTO Majors (name, collegeId) VALUES('English',4);
INSERT INTO Majors (name, collegeId) VALUES('Family and Consumer Science',3);
INSERT INTO Majors (name, collegeId) VALUES('Elementary Education',3);
INSERT INTO Majors (name, collegeId) VALUES('Accounting',2);
INSERT INTO Majors (name, collegeId) VALUES('Business',2);
INSERT INTO Majors (name, collegeId) VALUES('Biology',1);
INSERT INTO Majors (name, collegeId) VALUES('Agricultural Science',1);
SELECT * FROM Majors;