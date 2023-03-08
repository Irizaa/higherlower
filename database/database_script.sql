CREATE TABLE items (
    id SERIAL,
    name VARCHAR(200),
    price numeric(10,2),
    image VARCHAR(150),
    PRIMARY KEY (id)
);
    COPY items(name, price, image)
    FROM 'D:\insertcsvpath.csv'
    DELIMITER ','