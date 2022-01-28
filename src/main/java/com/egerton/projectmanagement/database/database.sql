CREATE DATABASE `project_management_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `project_management_db`;

CREATE TABLE `users` (
  `_id` bigint NOT NULL,
  `created_at` datetime NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` varchar(255) NOT NULL,
  `update_at` datetime NOT NULL,
  PRIMARY KEY (`_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `students` (
  `_id` bigint NOT NULL,
  `reg_no` varchar(255) NOT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`_id`),
  UNIQUE KEY `UK_l7eq939di88flmgk6b4pxe5w4` (`reg_no`),
  KEY `FKdt1cjx5ve5bdabmuuf3ibrwaq` (`user_id`),
  CONSTRAINT `FKdt1cjx5ve5bdabmuuf3ibrwaq` FOREIGN KEY (`user_id`) REFERENCES `users` (`_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `staff` (
  `_id` bigint NOT NULL,
  `staff_id` varchar(255) NOT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`_id`),
  UNIQUE KEY `UK_mk0g966eihj1xyrbh0bpe4und` (`staff_id`),
  KEY `FKdlvw23ak3u9v9bomm8g12rtc0` (`user_id`),
  CONSTRAINT `FKdlvw23ak3u9v9bomm8g12rtc0` FOREIGN KEY (`user_id`) REFERENCES `users` (`_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `projects` (
  `_id` bigint NOT NULL,
  `category` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `description` varchar(255) NOT NULL,
  `end_date` datetime,
  `evaluator_id` bigint NOT NULL,
  `languages` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `start_date` datetime,
  `status` varchar(255) NOT NULL,
  `student_id` bigint NOT NULL,
  `update_at` datetime NOT NULL,
  `projects__id` bigint DEFAULT NULL,
  `supervisor_id` bigint DEFAULT NULL,
  PRIMARY KEY (`_id`),
  KEY `FKl1xvk23ld0d0ylvsv6jgrkdlx` (`student_id`),
  KEY `FKemqtidyf1j5q8hk6to5ex3ee4` (`projects__id`),
  KEY `FKrnt6wa7c84d7a4ce1rqjm84pk` (`evaluator_id`),
  KEY `FKldd5iv9g5s3hp322orh2fr3g3` (`supervisor_id`),
  CONSTRAINT `FKemqtidyf1j5q8hk6to5ex3ee4` FOREIGN KEY (`projects__id`) REFERENCES `students` (`_id`),
  CONSTRAINT `FKl1xvk23ld0d0ylvsv6jgrkdlx` FOREIGN KEY (`student_id`) REFERENCES `students` (`_id`),
  CONSTRAINT `FKldd5iv9g5s3hp322orh2fr3g3` FOREIGN KEY (`supervisor_id`) REFERENCES `staff` (`_id`),
  CONSTRAINT `FKrnt6wa7c84d7a4ce1rqjm84pk` FOREIGN KEY (`evaluator_id`) REFERENCES `staff` (`_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `milestones` (
  `_id` bigint NOT NULL,
  `created_at` datetime NOT NULL,
  `end_date` datetime,
  `name` varchar(255) NOT NULL,
  `project_id` bigint NOT NULL,
  `start_date` datetime,
  `status` varchar(255) NOT NULL,
  `update_at` datetime NOT NULL,
  PRIMARY KEY (`_id`),
  KEY `FK2a7fp7wfu0qc1pq3wiifbksge` (`project_id`),
  CONSTRAINT `FK2a7fp7wfu0qc1pq3wiifbksge` FOREIGN KEY (`project_id`) REFERENCES `projects` (`_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `tasks` (
  `_id` bigint NOT NULL,
  `created_at` datetime NOT NULL,
  `description` varchar(255) NOT NULL,
  `end_date` datetime,
  `name` varchar(255) NOT NULL,
  `start_date` datetime,
  `status` varchar(255) NOT NULL,
  `update_at` datetime NOT NULL,
  `milestone_id` bigint DEFAULT NULL,
  PRIMARY KEY (`_id`),
  KEY `FKm11xypimt5ea052crm4k411ie` (`milestone_id`),
  CONSTRAINT `FKm11xypimt5ea052crm4k411ie` FOREIGN KEY (`milestone_id`) REFERENCES `milestones` (`_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `project_files` (
  `_id` bigint NOT NULL,
  `created_at` datetime NOT NULL,
  `description` varchar(255) NOT NULL,
  `file_type` varchar (255) NOT NULL,
  `file_url` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `project_id` bigint NOT NULL,
  `status` varchar(255) NOT NULL,
  `update_at` datetime NOT NULL,
  PRIMARY KEY (`_id`),
  KEY `FK9o12nrd97y1b5let06xrtu6jo` (`project_id`),
  CONSTRAINT `FK9o12nrd97y1b5let06xrtu6jo` FOREIGN KEY (`project_id`) REFERENCES `projects` (`_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `comments` (
  `_id` bigint NOT NULL,
  `created_at` datetime NOT NULL,
  `message` varchar(255) NOT NULL,
  `project_id` bigint NOT NULL,
  `staff_id` bigint NOT NULL,
  `student_id` bigint NOT NULL,
  `update_at` datetime NOT NULL,
  `staff__id` bigint DEFAULT NULL,
  PRIMARY KEY (`_id`),
  KEY `FKgkoamotsfr3mc0pwa1qrrmwhi` (`project_id`),
  KEY `FKc8u30vmh5182orpufashx9961` (`staff__id`),
  KEY `FKfrq0v1c9mqaws5dxw6amjatlm` (`student_id`),
  KEY `FKjita8udgv7hugcawpn436ttf2` (`staff_id`),
  CONSTRAINT `FKc8u30vmh5182orpufashx9961` FOREIGN KEY (`staff__id`) REFERENCES `staff` (`_id`),
  CONSTRAINT `FKfrq0v1c9mqaws5dxw6amjatlm` FOREIGN KEY (`student_id`) REFERENCES `students` (`_id`),
  CONSTRAINT `FKgkoamotsfr3mc0pwa1qrrmwhi` FOREIGN KEY (`project_id`) REFERENCES `projects` (`_id`),
  CONSTRAINT `FKjita8udgv7hugcawpn436ttf2` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `notifications` (
  `_id` bigint NOT NULL,
  `created_at` datetime NOT NULL,
  `message` varchar(255) NOT NULL,
  `staff_id` bigint NOT NULL,
  `title` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `update_at` datetime NOT NULL,
  PRIMARY KEY (`_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `students_projects` (
  `student__id` bigint NOT NULL,
  `projects__id` bigint NOT NULL,
  UNIQUE KEY `UK_fvnjvkrq13el2rx34f59ei1aa` (`projects__id`),
  KEY `FKmu9r3lw7rn89gb1u0fboqqgge` (`student__id`),
  CONSTRAINT `FKmdhga34pvcwnfvnrp62p3j7c0` FOREIGN KEY (`projects__id`) REFERENCES `projects` (`_id`),
  CONSTRAINT `FKmu9r3lw7rn89gb1u0fboqqgge` FOREIGN KEY (`student__id`) REFERENCES `students` (`_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `login` (
  `_id` bigint NOT NULL,
  `email` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  PRIMARY KEY (`_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- users
INSERT INTO `project_management_db`.`users`
(`_id`, `first_name`, `last_name`,  `email`, `password`, `role`, `created_at`,`update_at`)
VALUES (1, 'Student', 'Siranjofu', 'siranjofuw@gmail.com', '$2a$10$D/zD/aJ05bpQQCMZsoZrbuovVhcJDvrpQ1LpTyPnwzsZJlp23/frG', 'STUDENT','2020-10-06 18:33:38','2020-10-06 18:33:38'),
       (2, 'Edith', 'Abesi', 'edithabesi@gmail.com', '$2a$10$D/zD/aJ05bpQQCMZsoZrbuovVhcJDvrpQ1LpTyPnwzsZJlp23/frG', 'STUDENT','2020-10-06 18:33:38','2020-10-06 18:33:38'),
       (3, 'Evaluator', 'Siranjofu', 'jerrysirah8@gmail.com', '$2a$10$D/zD/aJ05bpQQCMZsoZrbuovVhcJDvrpQ1LpTyPnwzsZJlp23/frG', 'EVALUATOR','2020-10-06 18:33:38','2020-10-06 18:33:38'),
       (4, 'Sammy', 'Ongeywo', 'ngeywosammy2017@gmail.com', '$2a$10$D/zD/aJ05bpQQCMZsoZrbuovVhcJDvrpQ1LpTyPnwzsZJlp23/frG', 'STUDENT','2020-10-06 18:33:38','2020-10-06 18:33:38'),
       (5, 'Jeunice', 'Mwakish', 'mwakishajeunice2017@gmail.com', '$2a$10$D/zD/aJ05bpQQCMZsoZrbuovVhcJDvrpQ1LpTyPnwzsZJlp23/frG', 'STUDENT','2020-10-06 18:33:38','2020-10-06 18:33:38'),
       (6, 'Francis', 'Oduor', 'oduorfrancis@gmail.com', '$2a$10$D/zD/aJ05bpQQCMZsoZrbuovVhcJDvrpQ1LpTyPnwzsZJlp23/frG', 'STUDENT','2020-10-06 18:33:38','2020-10-06 18:33:38'),
       (7, 'Dr', 'Bosire', 'erisob@gmail.com', '$2a$10$D/zD/aJ05bpQQCMZsoZrbuovVhcJDvrpQ1LpTyPnwzsZJlp23/frG', 'SUPERVISOR','2020-10-06 18:33:38','2020-10-06 18:33:38'),
       (8, 'Phoebe', 'Fedtha', 'phoebe.ongalo@egerton.ac.ke', '$2a$10$D/zD/aJ05bpQQCMZsoZrbuovVhcJDvrpQ1LpTyPnwzsZJlp23/frG', 'SUPERVISOR','2021-10-06 18:33:38','2021-10-06 18:33:38'),
       (9, 'Peter', 'Kemei', 'peter.kemei@gmail.com', '$2a$10$D/zD/aJ05bpQQCMZsoZrbuovVhcJDvrpQ1LpTyPnwzsZJlp23/frG', 'SUPERVISOR','2021-10-06 18:33:38','2021-10-06 18:33:38'),
       (10, 'Erick', 'Baraza', 'erickbaraza98@gmail.com', '$2a$10$D/zD/aJ05bpQQCMZsoZrbuovVhcJDvrpQ1LpTyPnwzsZJlp23/frG', 'STUDENT','2020-10-06 18:33:38','2020-10-06 18:33:38'),
       (11, 'Jason', 'Githeko', 'githeko@egerton.ac.ke', '$2a$10$D/zD/aJ05bpQQCMZsoZrbuovVhcJDvrpQ1LpTyPnwzsZJlp23/frG', 'SUPERVISOR','2021-10-06 18:33:38','2021-10-06 18:33:38'),
       (12, 'Christoper', 'Olloo', 'ogudechris08@gmail.com', '$2a$10$D/zD/aJ05bpQQCMZsoZrbuovVhcJDvrpQ1LpTyPnwzsZJlp23/frG', 'STUDENT','2020-10-06 18:33:38','2020-10-06 18:33:38'),
       (13, 'Joseph', 'Mungai', 'mungai@egerton.ac.ke', '$2a$10$D/zD/aJ05bpQQCMZsoZrbuovVhcJDvrpQ1LpTyPnwzsZJlp23/frG', 'SUPERVISOR','2021-10-06 18:33:38','2021-10-06 18:33:38'),
       (14, 'Eugene', 'Omondi', 'eugineogembo@gmail.com', '$2a$10$D/zD/aJ05bpQQCMZsoZrbuovVhcJDvrpQ1LpTyPnwzsZJlp23/frG', 'STUDENT','2021-10-06 18:33:38','2021-10-06 18:33:38'),
       (15, 'Wilfred', 'Gikaru', 'gikaru@egerton.ac.ke', '$2a$10$D/zD/aJ05bpQQCMZsoZrbuovVhcJDvrpQ1LpTyPnwzsZJlp23/frG', 'EVALUATOR','2021-10-06 18:33:38','2021-10-06 18:33:38'),
       (16, 'Supervisor', 'Siranjofu', 'apams.egerton@gmail.com', '$2a$10$D/zD/aJ05bpQQCMZsoZrbuovVhcJDvrpQ1LpTyPnwzsZJlp23/frG', 'SUPERVISOR','2020-10-06 18:33:38','2020-10-06 18:33:38');

-- students
INSERT INTO `project_management_db`.`students`
(`_id`,`reg_no`,`user_id`)
VALUES (1,'S13/09418/17',1),
		(2,'S13/09419/17',2),
        (3,'S13/09421/17',4),
        (4,'S13/09422/17',5),
        (5,'S13/09423/17',6),
        (6,'S13/09424/17',10),
        (7,'S13/09425/17',12),
        (8,'S13/09426/17',14);

-- staff
INSERT INTO `project_management_db`.`staff`
(`_id`,`staff_id`,`user_id`)
VALUES (1,'STAFF_CS_1',3),
		(2,'STAFF_CS_2',7),
        (3,'STAFF_CS_3',8),
        (4,'STAFF_CS_4',9),
        (5,'STAFF_CS_5',11),
        (6,'STAFF_CS_6',13),
        (7,'STAFF_CS_7',15),
        (8,'STAFF_CS_8',16);

-- projects
INSERT INTO `project_management_db`.`projects`
(`_id`,`name`,`description`,`category`,`languages`,`start_date`,`end_date`,`status`,`evaluator_id`,`student_id`,`supervisor_id`,`created_at`,`update_at`)
VALUES ( 1, 'Student Management System', 'Developing a Desktop Student Management System using Java and MySQL', 'DESKTOP','Java, MySQL','2020-10-06 18:33:38','2020-12-20 18:33:38','FINISHED', 1, 1, 8,'2020-10-06 18:33:38','2020-12-20 18:33:38'),
( 2, 'Farm Management System', 'Developing a Desktop Farm Management System using ElectronJs and MongoDB','DESKTOP','ElectronJs, MongoDB','2020-10-06 18:33:38','2020-12-20 18:33:38','FINISHED',1, 2, 8,'2020-10-10 18:33:38','2020-12-06 18:33:38'),
( 3, 'Hospital Management System', 'Developing a Desktop Hospital Management System using Java and MySQL','DESKTOP','Java, MySQL','2020-10-06 18:33:38','2020-12-20 18:33:38','FINISHED', 1, 3, 8,'2020-10-10 18:33:38','2020-12-06 18:33:38'),
( 4, 'Stock Management System', 'Developing a Web-Based Stcok Management System using PHP, Bootstrap and MySQL','WEB_BASED','PHP, HTML, CSS, Bootstrap, MySQL','2020-10-06 18:33:38','2020-12-20 18:33:38','FINISHED', 1, 4, 8,'2020-10-10 18:33:38','2020-12-06 18:33:38'),
( 5, 'Football Management System',  'Developing a Desktop Football Management System using ElectronJs and MongoDB','DESKTOP','ElectronJs, MongoDB','2020-10-06 18:33:38','2020-12-20 18:33:38','FINISHED', 1, 5, 8,'2020-10-10 18:33:38','2020-12-06 18:33:38'),
( 6, 'Pharmacy Management System', 'Developing a Desktop Pharmacy Management System using Java and MySQL','DESKTOP','Java, MySQL','2020-10-06 18:33:38','2020-12-20 18:33:38','FINISHED', 1, 6, 8,'2020-10-10 18:33:38','2020-12-06 18:33:38'),
( 7, 'Supermarket Management System','Developing a Desktop Supermarket Management System using C# and MySQL','DESKTOP','C#, MySQL','2020-10-06 18:33:38','2020-12-20 18:33:38','FINISHED', 1, 7, 8,'2020-10-10 18:33:38','2020-12-06 18:33:38'),
( 8, 'Social Chatting App','Developing an Android Social Chatting App using Kotlin, Material UI and Firebase DB','ANDROID','Kotlin, Firebase DB, Material UI','2020-10-06 18:33:38','2020-12-20 18:33:38','FINISHED', 1, 8, 8,'2020-10-10 18:33:38','2020-12-06 18:33:38'),
( 9, 'Exam Management System', 'Developing a Web-Based Exam Management System using NodeJs, ExpressJs, Handlebars, Bootstrap and MongoDB', 'WEB_BASED','NodeJs,ExpressJs, Handlebars, MongoDB, HTML, CSS, Bootstrap','2020-10-06 18:33:38','2020-12-20 18:33:38','FINISHED', 1, 8, 8,'2020-10-10 18:33:38','2021-12-06 18:33:38'),
( 10, 'Project Management System','Developing a Web-Based Project Management System using Java, Spring Boot, React Js and MySQL','WEB_BASED','Java, Spring Boot, ReactJs, Bootstrap, MySQL','2021-10-06 18:33:38','2021-12-20 18:33:38','IN_PROGRESS', 7, 1, 8,'2021-10-10 18:33:38','2021-12-06 18:33:38'),
( 11, 'Employee Management System','Developing a Web-Based Emmployee Management System using PHP, Bootstrap and MySQL','WEB_BASED','PHP, Bootstrap, MySQL',null, null,'WAITING_APPROVAL', 7, 2,8,'2021-10-10 18:33:38','2021-12-06 18:33:38'),
( 12, 'Hotel Management System','Developing a Web-Based Hotel Management System using Python, Django and MySQL','WEB_BASED','Python, DJango, MySQL',null, null,'WAITING_APPROVAL', 7, 3,8,'2021-10-10 18:33:38','2021-12-06 18:33:38'),
( 13, 'Version Control System','Developing a Desktop Version Control System using C, C++ and JavaScript','DESKTOP','C, C++, JavaScript'null, null,'WAITING_APPROVAL', 7, 4,8,'2021-10-10 18:33:38','2021-12-06 18:33:38'),
( 14, 'Face Authentication System','Developing a Web-Based Football Management System using NodeJs, Python, Django and MongoDB','WEB_BASED','NodeJs,Python, DJango, MongoDB',null, null, 'WAITING_APPROVAL', 7, 5,8,'2021-10-10 18:33:38','2021-12-06 18:33:38'),
( 15, 'Attendance Management System','Developing a Desktop Attendance Management System using Java and MySQL','DESKTOP','Java, MySQL',null, null,'WAITING_APPROVAL', 7, 6,8,'2021-10-10 18:33:38','2021-12-06 18:33:38');

-- student projects
INSERT INTO `project_management_db`.`students_projects`
(`student__id`,`projects__id`)
VALUES (1, 1),
	   (1, 10),
		(2, 2),
        (2, 11),
        (3, 3),
        (3, 12),
        (4, 4),
        (4, 13),
        (5, 5),
        (5, 14),
        (6, 6),
        (6, 15),
        (7, 7),
        (8, 8),
        (8, 9);
        
-- MILESTONES
INSERT INTO `project_management_db`.`milestones`
(`_id`,`name`,`start_date`,`end_date`,`project_id`,`status`,`created_at`,`update_at`)
VALUES (1,'Software Requirements Specifications', '2020-10-06 18:33:38', '2020-10-13 18:33:38', 1, 'FINISHED', '2020-10-06 18:33:38', '2020-10-13 18:33:38'),
		(2,'Software Design', '2020-10-15 18:33:38', '2020-10-22 18:33:38', 1, 'FINISHED', '2020-10-13 18:33:38', '2020-10-22 18:33:38'),
		(3,'Software Implementation', '2020-10-23 18:33:38', '2020-11-24 18:33:38', 1, 'FINISHED', '2020-10-13 18:33:38','2020-11-24 18:33:38'),
        (4,'Software Testing', '2020-11-25 18:33:38', '2020-12-15 18:33:38', 1, 'FINISHED', '2020-10-13 18:33:38', '2020-12-10 18:33:38'),
        (5,'Deployment and Presentation', '2020-12-10 18:33:38', '2020-12-20 18:33:38', 1, 'FINISHED', '2020-12-10 18:33:38', '2020-12-20 18:33:38');
        
-- Tasks
INSERT INTO `project_management_db`.`tasks`
(`_id`,`name`,`description`,`start_date`,`end_date`,`status`,`milestone_id`,`created_at`,`update_at`)
VALUES ( 1, 'Data Collection','Collect and Analyse Requirement', '2020-10-06 18:33:38', '2020-10-10 18:33:38', 'FINISHED', 1, '2020-10-06 18:33:38', '2020-10-10 18:33:38'),
		( 2, 'SRS', 'Submit SRS document', '2020-10-10 18:33:38', '2020-10-13 18:33:38', 'FINISHED', 1,  '2020-10-10 18:33:38', '2020-10-13 18:33:38'),
        ( 3, 'Design -- Protyping', 'Create Sofware Mockup UI prototype', '2020-10-15 18:33:38', '2020-10-19 18:33:38', 'FINISHED', 2, '2020-10-15 18:33:38', '2020-10-19 18:33:38'),
        ( 4, 'DB Design', 'Design MySQL Database', '2020-10-19 18:33:38', '2020-10-22 18:33:38', 'FINISHED', 2,  '2020-10-19 18:33:38', '2020-10-22 18:33:38'),
        ( 5, 'Create UI', 'Implement the User Interface', '2020-10-23 18:33:38', '2020-10-28 18:33:38', 'FINISHED', 3,  '2020-10-23 18:33:38', '2020-10-28 18:33:38'),
        ( 6, 'Java Classes', 'Create Java Classes', '2020-10-28 18:33:38', '2020-11-20 18:33:38', 'FINISHED', 3,  '2020-10-28 18:33:38', '2020-11-20 18:33:38'),
        ( 7, 'Create DB',  'Create MySQL Database and Populate Data', '2020-11-20 18:33:38', '2020-11-21 18:33:38', 'FINISHED', 3, '2020-11-20 18:33:38', '2020-11-21 18:33:38'),
        ( 8, 'Component Intergration', 'Integrate UI, Java Classes and Database', '2020-11-21 18:33:38', '2020-11-23 18:33:38', 'FINISHED', 3, '2020-11-21 18:33:38', '2020-11-24 18:33:38'),
        ( 9,  'Testing', 'Test UI Interactions and Functionality ', '2020-11-25 18:33:38', '2020-12-15 18:33:38', 'FINISHED', 4, '2020-11-25 18:33:38', '2020-12-10 18:33:38'),
        ( 10, 'Deployment','Packaging the system, and presentation ', '2020-12-10 18:33:38', '2020-12-20 18:33:38', 'FINISHED', 5, '2020-12-20 18:33:38','2020-12-20 18:33:38');

-- coments
INSERT INTO `project_management_db`.`comments`
(`_id`,`message`, `project_id`, `user_id`,`created_at`, `update_at`)
VALUES ( 1, 'Wonderfull description of the poject',1,3, '2020-10-06 18:33:38','2020-10-16 18:33:38'),
		( 2, 'You have not uploaded your Project Proposal File',1,3, '2020-10-08 18:33:38','2020-12-20 18:33:38'),
		( 3, 'Wonderfull description of the poject',1,3, '2020-10-06 18:33:38','2020-12-20 18:33:38'),
		( 4, 'Wonderfull description of the poject',1,3, '2020-10-06 18:33:38','2020-12-20 18:33:38'),
		( 5, 'Wonderfull description of the poject',1,3, '2020-10-06 18:33:38','2020-12-20 18:33:38');
        
-- SETTINGS
INSERT INTO settings(_id, setting, end_date, start_date, year)
VALUES(1,'PROJECT','2020-12-21 00:00:00', '2020-10-01 00:00:00', 2020),
(2,'PROPOSAL','2020-10-08 00:00:00', '2020-10-01 00:00:00', 2020),
(3,'SRS','2020-10-17 00:00:00', '2020-10-10 00:00:00', 2020),
(4,'SDD','2020-11-10 00:00:00', '2020-10-20 00:00:00', 2020),
(5,'TEST_PLAN','2020-11-20 00:00:00', '2020-11-10 00:00:00', 2020),
(6,'USER_MANUAL','2020-12-17 00:00:00', '2020-11-25 00:00:00', 2020),
(7,'PROJECT','2021-12-21 00:00:00', '2021-10-01 00:00:00', 2021),
(8,'PROPOSAL','2021-10-08 00:00:00', '2021-10-01 00:00:00', 2021),
(9,'SRS','2021-10-17 00:00:00', '2021-10-10 00:00:00', 2021),
(10,'SDD','2021-11-10 00:00:00', '2021-10-20 00:00:00', 2021),
(11,'TEST_PLAN','2021-11-20 00:00:00', '2021-11-10 00:00:00', 2021),
(12,'USER_MANUAL','2021-12-17 00:00:00', '2021-11-25 00:00:00', 2021);