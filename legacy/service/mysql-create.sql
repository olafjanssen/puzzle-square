DROP SCHEMA square;
CREATE SCHEMA square;
USE square;

CREATE TABLE events (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    userId CHAR(36),
    event VARCHAR(40),
    payload VARCHAR(500),
    clientId CHAR(36) UNIQUE,
    timestamp BIGINT,
    ip VARCHAR(30)
    );