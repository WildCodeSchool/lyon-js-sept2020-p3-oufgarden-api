/* Replace with your SQL commands */
ALTER TABLE
  comment
ADD
  COLUMN user_id INT NOT NULL;

  ALTER TABLE comment 
ADD CONSTRAINT `fk_comment_user`
  FOREIGN KEY (`user_id`)
  REFERENCES user (`id`)
  ON DELETE CASCADE;

  DROP TABLE commentToUser;