-- -----------------------------------------------------
-- Table `ouf_garden`.`Garden`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Garden` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(150) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;
-- -----------------------------------------------------
-- Table `mydb`.`address`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `address` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `street` VARCHAR(150) NULL,
  `city` VARCHAR(150) NULL,
  `zip_code` VARCHAR(150) NULL,
  `Garden_id` INT NOT NULL,
  PRIMARY KEY (`id`, `Garden_id`),
  INDEX `fk_address_Garden_idx` (`Garden_id` ASC) VISIBLE,
  CONSTRAINT `fk_address_Garden` FOREIGN KEY (`Garden_id`) REFERENCES `ouf_garden`.`Garden` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;
-- -----------------------------------------------------
-- Table `ouf_garden`.`Action`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Action` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(150) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;
-- -----------------------------------------------------
-- Table `ouf_garden`.`Article`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Article` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(150) NOT NULL,
  `picture` VARCHAR(150) NOT NULL,
  `content` TEXT NOT NULL,
  `date` DATETIME NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;
-- -----------------------------------------------------
-- Table `ouf_garden`.`Tag`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Tag` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(150) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;
-- -----------------------------------------------------
-- Table `ouf_garden`.`Comment`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Comment` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `date` DATE NOT NULL,
  `message` TEXT NOT NULL,
  `article_id` INT NOT NULL,
  `parent_comment_id` INT NOT NULL,
  PRIMARY KEY (`id`, `article_id`, `parent_comment_id`),
  INDEX `fk_commentaires_articles1_idx` (`article_id` ASC) VISIBLE,
  INDEX `fk_Comment_Comment1_idx` (`parent_comment_id` ASC) VISIBLE,
  CONSTRAINT `fk_commentaires_articles1` FOREIGN KEY (`article_id`) REFERENCES `ouf_garden`.`Article` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_Comment_Comment1` FOREIGN KEY (`parent_comment_id`) REFERENCES `ouf_garden`.`Comment` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;
-- -----------------------------------------------------
-- Table `ouf_garden`.`Plot`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Plot` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(150) NOT NULL,
  `garden_id` INT NOT NULL,
  PRIMARY KEY (`id`, `garden_id`),
  INDEX `fk_parcelles_Jardin1_idx` (`garden_id` ASC) VISIBLE,
  CONSTRAINT `fk_parcelles_Jardin1` FOREIGN KEY (`garden_id`) REFERENCES `ouf_garden`.`Garden` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;
-- -----------------------------------------------------
-- Table `ouf_garden`.`User`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `User` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `firstname` VARCHAR(150) NOT NULL,
  `lastname` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `encrypted_password` VARCHAR(150) NOT NULL,
  `is_admin` TINYINT NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;
-- -----------------------------------------------------
-- Table `ouf_garden`.`_Favorite`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `_Favorite` (
  `user_id` INT NOT NULL,
  `article_id` INT NOT NULL,
  PRIMARY KEY (`user_id`, `article_id`),
  INDEX `fk_utilisateur_has_articles_articles1_idx` (`article_id` ASC) VISIBLE,
  INDEX `fk_utilisateur_has_articles_utilisateur_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `fk_utilisateur_has_articles_utilisateur` FOREIGN KEY (`user_id`) REFERENCES `ouf_garden`.`User` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_utilisateur_has_articles_articles1` FOREIGN KEY (`article_id`) REFERENCES `ouf_garden`.`Article` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;
-- -----------------------------------------------------
-- Table `ouf_garden`.`_UserToGarden`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `_UserToGarden` (
  `user_id` INT NOT NULL,
  `garden_id` INT NOT NULL,
  PRIMARY KEY (`user_id`, `garden_id`),
  INDEX `fk_utilisateur_has_Jardin_Jardin1_idx` (`garden_id` ASC) VISIBLE,
  INDEX `fk_utilisateur_has_Jardin_utilisateur1_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `fk_utilisateur_has_Jardin_utilisateur1` FOREIGN KEY (`user_id`) REFERENCES `ouf_garden`.`User` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_utilisateur_has_Jardin_Jardin1` FOREIGN KEY (`garden_id`) REFERENCES `ouf_garden`.`Garden` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;
-- -----------------------------------------------------
-- Table `ouf_garden`.`_TagToArticle`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `_TagToArticle` (
  `article_id` INT NOT NULL,
  `tag_id` INT NOT NULL,
  PRIMARY KEY (`article_id`, `tag_id`),
  INDEX `fk_articles_has_categories_articles_categories_articles1_idx` (`tag_id` ASC) VISIBLE,
  INDEX `fk_articles_has_categories_articles_articles1_idx` (`article_id` ASC) VISIBLE,
  CONSTRAINT `fk_articles_has_categories_articles_articles1` FOREIGN KEY (`article_id`) REFERENCES `ouf_garden`.`Article` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_articles_has_categories_articles_categories_articles1` FOREIGN KEY (`tag_id`) REFERENCES `ouf_garden`.`Tag` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;
-- -----------------------------------------------------
-- Table `ouf_garden`.`_CommentToUser`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `_CommentToUser` (
  `comment_id` INT NOT NULL,
  `comment_article_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  PRIMARY KEY (`comment_id`, `comment_article_id`, `user_id`),
  INDEX `fk_commentaires_has_utilisateur_utilisateur1_idx` (`user_id` ASC) VISIBLE,
  INDEX `fk_commentaires_has_utilisateur_commentaires1_idx` (`comment_id` ASC, `comment_article_id` ASC) VISIBLE,
  CONSTRAINT `fk_commentaires_has_utilisateur_commentaires1` FOREIGN KEY (`comment_id`, `comment_article_id`) REFERENCES `ouf_garden`.`Comment` (`id`, `article_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_commentaires_has_utilisateur_utilisateur1` FOREIGN KEY (`user_id`) REFERENCES `ouf_garden`.`User` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;
-- -----------------------------------------------------
-- Table `ouf_garden`.`_PlotToActionToUser`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `_PlotToActionToUser` (
  `action_id` INT NOT NULL,
  `plot_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `date` DATE NOT NULL,
  PRIMARY KEY (`action_id`, `plot_id`, `user_id`, `date`),
  INDEX `fk_actions_has_parcelles_parcelles1_idx` (`plot_id` ASC) VISIBLE,
  INDEX `fk_actions_has_parcelles_actions1_idx` (`action_id` ASC) VISIBLE,
  INDEX `fk__PlotToActionToUser_User1_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `fk_actions_has_parcelles_actions1` FOREIGN KEY (`action_id`) REFERENCES `ouf_garden`.`Action` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_actions_has_parcelles_parcelles1` FOREIGN KEY (`plot_id`) REFERENCES `ouf_garden`.`Plot` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk__PlotToActionToUser_User1` FOREIGN KEY (`user_id`) REFERENCES `ouf_garden`.`User` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;
-- -----------------------------------------------------
-- Table `ouf_garden`.`creneaux`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `creneaux` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `date` DATE NOT NULL,
  `nom` VARCHAR(45) NOT NULL,
  `heure_debut` TIME NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;
-- -----------------------------------------------------
-- Table `ouf_garden`.`address`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `address` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `street` VARCHAR(150) NULL,
  `city` VARCHAR(150) NULL,
  `zip_code` VARCHAR(150) NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;