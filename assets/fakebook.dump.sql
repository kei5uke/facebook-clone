-- MySQL dump 10.13  Distrib 8.0.29, for Linux (aarch64)
--
-- Host: localhost    Database: fakebook
-- ------------------------------------------------------
-- Server version	8.0.29-0ubuntu0.20.04.3

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `FOLLOW_FOLLOWED`
--

DROP TABLE IF EXISTS `FOLLOW_FOLLOWED`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `FOLLOW_FOLLOWED` (
  `follower_id` int NOT NULL,
  `followed_id` int NOT NULL,
  KEY `followed_id` (`followed_id`),
  KEY `follower_id` (`follower_id`),
  CONSTRAINT `FOLLOW_FOLLOWED_ibfk_1` FOREIGN KEY (`followed_id`) REFERENCES `USER` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FOLLOW_FOLLOWED_ibfk_2` FOREIGN KEY (`follower_id`) REFERENCES `USER` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `FOLLOW_FOLLOWED`
--

LOCK TABLES `FOLLOW_FOLLOWED` WRITE;
/*!40000 ALTER TABLE `FOLLOW_FOLLOWED` DISABLE KEYS */;
INSERT INTO `FOLLOW_FOLLOWED` VALUES (1,3),(2,1),(2,3),(3,4),(3,2),(1,2),(1,4),(2,4),(5,6),(6,5),(5,1);
/*!40000 ALTER TABLE `FOLLOW_FOLLOWED` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `POST`
--

DROP TABLE IF EXISTS `POST`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `POST` (
  `post_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `post_date_time` datetime NOT NULL,
  `post_description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`post_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `POST_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `USER` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `POST`
--

LOCK TABLES `POST` WRITE;
/*!40000 ALTER TABLE `POST` DISABLE KEYS */;
INSERT INTO `POST` VALUES (1,1,'2021-10-03 22:59:52','Hello! This is the first post ever poseted on fakebook!'),(2,4,'2022-06-03 23:12:43','Ahoy Booys'),(3,2,'2022-06-07 10:32:08','Damn Justin Bieber looking good yo'),(4,3,'2021-10-03 20:59:52','Yo yo yo. 148-3 to the 3 to the 6 to the 9, representing the ABQ, what up, biatch?!'),(5,2,'2021-10-03 15:32:52','Wake Up Your ASS'),(7,2,'2021-07-05 09:27:40','I got money!'),(8,1,'2021-07-05 09:27:40','ITS MORBIN TIME!'),(9,1,'2022-06-24 10:33:44','POST TESTING'),(10,1,'2022-06-24 12:20:56','POST Testing Part2'),(11,1,'2022-06-25 14:54:28','Post Testing !!!');
/*!40000 ALTER TABLE `POST` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `USER`
--

DROP TABLE IF EXISTS `USER`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `USER` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(30) NOT NULL,
  `password` varchar(30) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `unique_username` (`username`),
  CONSTRAINT `user_check` CHECK ((not((`username` like _utf8mb4'%[^a-zA-Z0-9 ]%')))),
  CONSTRAINT `USER_chk_1` CHECK ((not((`password` like _utf8mb4'%[^a-zA-Z0-9 ]%'))))
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `USER`
--

LOCK TABLES `USER` WRITE;
/*!40000 ALTER TABLE `USER` DISABLE KEYS */;
INSERT INTO `USER` VALUES (1,'keisuke135','mDijin3456'),(2,'chris3456','Ldijei3456'),(3,'Mihdk374','Hiojfao301'),(4,'Hi69Guys','Jiyi174'),(5,'Chicken134','ckhM876'),(6,'Micky354','Mcy5566'),(8,'Minecraft145','HelloWorld'),(13,'MichaleScott','Pummy135'),(14,'FakeMichaelScott','HelloThere');
/*!40000 ALTER TABLE `USER` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-06-25 15:53:53
