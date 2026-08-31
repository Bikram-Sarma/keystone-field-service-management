CREATE TABLE technicians (
    id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150),
    phone VARCHAR(30),
    specialization VARCHAR(100),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    PRIMARY KEY (id)
);