/* Replace with your SQL commands */

ALTER TABLE
  zone
ADD
  COLUMN description VARCHAR(150) NOT NULL,
ADD
  COLUMN type VARCHAR(150) NOT NULL,
ADD
  COLUMN exposition VARCHAR(150) NOT NULL;

ALTER TABLE  `zone` DROP PRIMARY KEY , ADD PRIMARY KEY (  `id` );
