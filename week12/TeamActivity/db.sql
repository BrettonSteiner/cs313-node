DROP TABLE Team12Users;

CREATE TABLE Team12Users (
	id			SERIAL PRIMARY KEY,
	username	VARCHAR NOT NULL,
	password	VARCHAR NOT NULL
);

INSERT INTO Team12Users (username, password) VALUES('admin','$2b$10$hr9QOk8wg33phi8xCC0zmelQAU5khrOs.yQWMMnj92v1OdI21qU3G');