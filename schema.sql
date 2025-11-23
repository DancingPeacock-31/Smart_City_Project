--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `admin_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`admin_id`),
  UNIQUE KEY `username` (`username`)
);

--
-- Table structure for table `citizen`
--

CREATE TABLE `citizen` (
  `citizen_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`citizen_id`),
  UNIQUE KEY `email` (`email`)
);

--
-- Table structure for table `service`
--

CREATE TABLE `service` (
  `service_id` int NOT NULL AUTO_INCREMENT,
  `service_name` varchar(255) NOT NULL,
  PRIMARY KEY (`service_id`),
  UNIQUE KEY `service_name` (`service_name`)
);

--
-- Table structure for table `complaint`
--

CREATE TABLE `complaint` (
  `complaint_id` int NOT NULL AUTO_INCREMENT,
  `citizen_id` int DEFAULT NULL,
  `service_id` int DEFAULT NULL,
  `description` text,
  `location` varchar(255) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'Pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`complaint_id`),
  KEY `citizen_id` (`citizen_id`),
  KEY `service_id` (`service_id`),
  CONSTRAINT `complaint_ibfk_1` FOREIGN KEY (`citizen_id`) REFERENCES `citizen` (`citizen_id`),
  CONSTRAINT `complaint_ibfk_2` FOREIGN KEY (`service_id`) REFERENCES `service` (`service_id`)
);
