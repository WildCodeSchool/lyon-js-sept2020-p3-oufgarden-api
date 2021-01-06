ALTER TABLE plot RENAME TO zone;
ALTER TABLE plotToActionToUser RENAME TO zoneToActionToUser ;

CREATE TABLE `plantFamily` (  
    id int NOT NULL primary key AUTO_INCREMENT,
    main_category VARCHAR(150) NOT NULL,
    sub_category VARCHAR(150) NOT NULL
) ENGINE = InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;

CREATE TABLE `zoneToPlantFamily` (  
    zone_id int NOT NULL,
    plantFamily_id int NOT NULL,
CONSTRAINT `zone_to_plantFamily_fk_zone` FOREIGN KEY (`zone_id`) REFERENCES `zone` (`id`) ON DELETE CASCADE,
  CONSTRAINT `zone_to_plantFamily_fk_plantFamily` FOREIGN KEY (`plantFamily_id`) REFERENCES `plantFamily` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;

describe garden;

ALTER TABLE garden CHANGE pic_profil picture varchar(150);
ALTER TABLE garden CHANGE pic_plan map varchar(150);
ALTER TABLE garden CHANGE address address_id int;
ALTER TABLE garden CHANGE zone_number zone_quantity int;

ALTER TABLE garden
ADD FOREIGN KEY (address_id) REFERENCES address(id); 