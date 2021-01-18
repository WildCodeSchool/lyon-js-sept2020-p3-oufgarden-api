/* Replace with your SQL commands */

ALTER TABLE
  user
ADD
  COLUMN phone VARCHAR(10),
ADD
  COLUMN gender VARCHAR(150) NOT NULL,
ADD
  COLUMN membership_start DATE,
ADD
  COLUMN user_creation DATE NOT NULL,
ADD
  COLUMN birthdate DATE;

ALTER TABLE
  user
ADD
  COLUMN picture_url VARCHAR(150);

describe user;




