/* Replace with your SQL commands */

ALTER TABLE zone 
DROP FOREIGN KEY `fk_plot_garden`;
ALTER TABLE zone 
ADD CONSTRAINT `fk_zone_garden`
  FOREIGN KEY (`garden_id`)
  REFERENCES garden (`id`)
  ON DELETE CASCADE;

CREATE TABLE `articleToGarden` (  
    article_id int NOT NULL,
    garden_id int NOT NULL,
CONSTRAINT `article_to_garden_fk_article` FOREIGN KEY (`article_id`) REFERENCES `article` (`id`) ON DELETE CASCADE,
  CONSTRAINT `article_to_garden_fk_garden` FOREIGN KEY (`garden_id`) REFERENCES `garden` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;
