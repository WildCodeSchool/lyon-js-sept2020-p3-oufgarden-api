/* Replace with your SQL commands */
ALTER TABLE
  user
ADD
  CONSTRAINT UC_email UNIQUE (email);
ALTER TABLE
  user CHANGE encrypted_password password VARCHAR(150);