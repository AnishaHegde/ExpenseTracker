CREATE DATABASE `expensetrackerdb`;

CREATE TABLE `users` (
  `email` varchar(30) NOT NULL,
  `password` varchar(15) NOT NULL,
  `type` varchar(15) NOT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `expensetrackerdb`.`users`
(`email`,
`password`,
`type`)
VALUES
(<{email: }>,
<{password: }>,
<{type: }>);

  
INSERT INTO `expensetrackerdb`.`users`
(`email`,
`password`,
`type`)
VALUES
('admin@gmail.com','test','admin');
  
	
CREATE TABLE `expenses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userEmail` varchar(45) NOT NULL,
  `amount` decimal(10,0) NOT NULL,
  `date` varchar(45) NOT NULL,
  `description` varchar(45) NOT NULL,
  PRIMARY KEY (`id`,`userEmail`),
  KEY `email_idx` (`userEmail`),
  CONSTRAINT `email` FOREIGN KEY (`userEmail`) REFERENCES `users` (`email`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

INSERT INTO `expensetrackerdb`.`expenses`
(`id`,
`userEmail`,
`amount`,
`date`,
`description`)
VALUES
(<{id: }>,
<{userEmail: }>,
<{amount: }>,
<{date: }>,
<{description: }>);

	
  