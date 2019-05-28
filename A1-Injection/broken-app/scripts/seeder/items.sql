CREATE TABLE IF NOT EXISTS items (
    `id` INT,
    `img` VARCHAR(27) CHARACTER SET utf8,
    `name` VARCHAR(8) CHARACTER SET utf8,
    `price` NUMERIC (4, 2),
    `description` VARCHAR (82) CHARACTER SET utf8,
    `rating` INT
);
INSERT INTO items VALUES (
    1, 'http://placehold.it/700x400', 'Item One', 24.99, 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet numquam aspernatur!', 4
);
