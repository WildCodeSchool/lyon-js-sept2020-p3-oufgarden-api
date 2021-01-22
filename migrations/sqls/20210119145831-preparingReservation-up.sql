/* Replace with your SQL commands */

ALTER TABLE
  garden
ADD
  COLUMN max_users INT;

CREATE TABLE `time_slot` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `start_time` TIME NOT NULL,
  `end_time` TIME NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;

CREATE TABLE `reservation` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `date` DATE NOT NULL,
  `user_id` INT NOT NULL,
  `garden_id` INT NOT NULL,
  `time_slot_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_user_reservation` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_garden_reservation` FOREIGN KEY (`garden_id`) REFERENCES `garden` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_time_slot_reservation` FOREIGN KEY (`time_slot_id`) REFERENCES `time_slot` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;

ALTER TABLE
  zoneToActionToUser CHANGE plot_id zone_id INT;