-- phpMyAdmin SQL Dump
-- version 4.9.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3308
-- Generation Time: Jan 17, 2024 at 01:11 PM
-- Server version: 8.0.18
-- PHP Version: 7.3.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `notes_db_geeks`
--

-- --------------------------------------------------------

--
-- Table structure for table `userroles`
--

DROP TABLE IF EXISTS `userroles`;
CREATE TABLE IF NOT EXISTS `userroles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `roleType` varchar(255) DEFAULT NULL,
  `color` varchar(50) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `userroles`
--

INSERT INTO `userroles` (`id`, `roleType`, `color`, `createdAt`, `updatedAt`) VALUES
(1, 'High School (Grade 9)', '#3498db', '2023-08-05 12:26:25', '2023-08-05 12:26:25'),
(2, 'High School (Grade 10)', '#2ecc71', '2023-08-05 12:26:25', '2023-08-05 12:26:25'),
(3, 'High School (Grade 11)', '#e74c3c', '2023-08-05 12:26:25', '2023-08-05 12:26:25'),
(4, 'High School (Grade 12)', '#9b59b6', '2023-08-05 12:26:25', '2023-08-05 12:26:25'),
(5, 'Bachelor\'s Degree (History)', '#2c3e50', '2023-08-05 12:26:25', '2023-08-05 12:26:25'),
(6, 'Bachelor\'s Degree (English)', '#27ae60', '2023-08-05 12:26:25', '2023-08-05 12:26:25'),
(7, 'Bachelor\'s Degree (Philosophy)', '#e67e22', '2023-08-05 12:26:25', '2023-08-05 12:26:25'),
(8, 'Bachelor\'s Degree (Music)', '#34495e', '2023-08-05 12:26:25', '2023-08-05 12:26:25'),
(9, 'Bachelor\'s Degree (Fine Arts)', '#f39c12', '2023-08-05 12:26:25', '2023-08-05 12:26:25'),
(10, 'Bachelor\'s Degree (Literature)', '#16a085', '2023-08-05 12:26:25', '2023-08-05 12:26:25'),
(11, 'Bachelor\'s Degree (Psychology)', '#e74c3c', '2023-08-05 12:26:25', '2023-08-05 12:26:25'),
(12, 'Bachelor\'s Degree (Sociology)', '#2980b9', '2023-08-05 12:26:25', '2023-08-05 12:26:25'),
(13, 'Bachelor\'s Degree (Economics)', '#d35400', '2023-08-05 12:26:25', '2023-08-05 12:26:25'),
(14, 'Bachelor\'s Degree (Political Science)', '#8e44ad', '2023-08-05 12:26:25', '2023-08-05 12:26:25'),
(15, 'Bachelor\'s Degree (Anthropology)', '#1abc9c', '2023-08-05 12:26:25', '2023-08-05 12:26:25'),
(16, 'Bachelor\'s Degree (Geography)', '#d35400', '2023-08-05 12:26:25', '2023-08-05 12:26:25'),
(17, 'Bachelor\'s Degree (Biology)', '#3498db', '2023-08-05 12:26:25', '2023-08-05 12:26:25'),
(18, 'Bachelor\'s Degree (Chemistry)', '#27ae60', '2023-08-05 12:26:25', '2023-08-05 12:26:25'),
(19, 'Bachelor\'s Degree (Physics)', '#c0392b', '2023-08-05 12:26:25', '2023-08-05 12:26:25'),
(20, 'Bachelor\'s Degree (Environmental Science)', '#8e44ad', '2023-08-05 12:26:25', '2023-08-05 12:26:25'),
(21, 'Bachelor\'s Degree (Geology)', '#2c3e50', '2023-08-05 12:26:25', '2023-08-05 12:26:25'),
(22, 'Bachelor\'s Degree (Astronomy)', '#f39c12', '2023-08-05 12:26:25', '2023-08-05 12:26:25'),
(23, 'Bachelor\'s Degree (Mathematics and Statistics)', '#e74c3c', '2023-08-05 12:26:25', '2023-08-05 12:26:25'),
(24, 'Bachelor\'s Degree (Computer Science)', '#16a085', '2023-08-05 12:26:25', '2023-08-05 12:26:25'),
(25, 'Bachelor\'s Degree (Electrical Engineering)', '#3498db', '2023-08-05 12:26:25', '2023-08-05 12:26:25'),
(26, 'Bachelor\'s Degree (Mechanical Engineering)', '#e67e22', '2023-08-05 12:26:25', '2023-08-05 12:26:25'),
(27, 'Bachelor\'s Degree (Civil Engineering)', '#3498db', '2023-08-05 12:26:25', '2023-08-05 12:26:25'),
(28, 'Bachelor\'s Degree (Chemical Engineering)', '#27ae60', '2023-08-05 12:26:25', '2023-08-05 12:26:25'),
(29, 'Bachelor\'s Degree (Aerospace Engineering)', '#c0392b', '2023-08-05 12:26:25', '2023-08-05 12:26:25'),
(30, 'Bachelor\'s Degree (Biomedical Engineering)', '#8e44ad', '2023-08-05 12:26:25', '2023-08-05 12:26:25'),
(31, 'Bachelor\'s Degree (Marketing)', '#2c3e50', '2023-08-05 12:26:25', '2023-08-05 12:26:25'),
(32, 'Bachelor\'s Degree (Finance)', '#f39c12', '2023-08-05 12:26:25', '2023-08-05 12:26:25'),
(33, 'Bachelor\'s Degree (Accounting)', '#e74c3c', '2023-08-05 12:26:25', '2023-08-05 12:26:25'),
(34, 'Bachelor\'s Degree (Human Resources)', '#16a085', '2023-08-05 12:26:25', '2023-08-05 12:26:25'),
(35, 'Bachelor\'s Degree (Entrepreneurship)', '#3498db', '2023-08-05 12:26:25', '2023-08-05 12:26:25'),
(36, 'Bachelor\'s Degree (International Business)', '#2ecc71', '2023-08-05 12:26:25', '2023-08-05 12:26:25'),
(37, 'Bachelor\'s Degree (Education)', '#e74c3c', '2023-08-05 12:26:25', '2023-08-05 12:26:25'),
(38, 'Bachelor\'s Degree (Nursing)', '#9b59b6', '2023-08-05 12:26:25', '2023-08-05 12:26:25'),
(39, 'Bachelor\'s Degree (Nutrition)', '#2c3e50', '2023-08-05 12:26:25', '2023-08-05 12:26:25'),
(40, 'Bachelor\'s Degree (Public Health)', '#27ae60', '2023-08-05 12:26:25', '2023-08-05 12:26:25'),
(41, 'Bachelor\'s Degree (Physical Therapy)', '#1abc9c', '2023-08-05 12:26:25', '2023-08-05 12:26:25'),
(42, 'Bachelor\'s Degree (Occupational Therapy)', '#d35400', '2023-08-05 12:26:25', '2023-08-05 12:26:25'),
(43, 'Bachelor\'s Degree (Medical Technology)', '#f39c12', '2023-08-05 12:26:25', '2023-08-05 12:26:25'),
(44, 'Bachelor\'s Degree (Agriculture and Forestry)', '#e74c3c', '2023-08-05 12:26:25', '2023-08-05 12:26:25'),
(45, 'Bachelor\'s Degree (Architecture)', '#2980b9', '2023-08-05 12:26:25', '2023-08-05 12:26:25'),
(46, 'Bachelor\'s Degree (Communication and Media Studies)', '#8e44ad', '2023-08-05 12:26:25', '2023-08-05 12:26:25'),
(47, 'Bachelor\'s Degree (Journalism)', '#34495e', '2023-08-05 12:26:25', '2023-08-05 12:26:25'),
(48, 'Bachelor\'s Degree (Hospitality and Tourism)', '#16a085', '2023-08-05 12:26:25', '2023-08-05 12:26:25'),
(49, 'Bachelor\'s Degree (Fashion Design)', '#d35400', '2023-08-05 12:26:25', '2023-08-05 12:26:25'),
(50, 'Bachelor\'s Degree (Law)', '#3498db', '2023-08-05 12:26:25', '2023-08-05 12:26:25'),
(51, 'Master of Arts (M.A.)', '#27ae60', '2023-08-05 12:26:25', '2023-08-05 12:26:25'),
(52, 'Master of Science (M.S.)', '#c0392b', '2023-08-05 12:26:25', '2023-08-05 12:26:25'),
(53, 'Master of Business Administration (MBA)', '#8e44ad', '2023-08-05 12:26:25', '2023-08-05 12:26:25'),
(54, 'Master of Engineering (M.Eng.)', '#2c3e50', '2023-08-05 12:26:25', '2023-08-05 12:26:25'),
(55, 'Master of Technology (M.Tech.)', '#f39c12', '2023-08-05 12:26:25', '2023-08-05 12:26:25'),
(56, 'Master of Technology (Mathematics and Statistics)', '#e74c3c', '2023-08-05 12:26:25', '2023-08-05 12:26:25'),
(57, 'Master of Technology (Computer Science)', '#16a085', '2023-08-05 12:26:25', '2023-08-05 12:26:25'),
(58, 'Master of Technology (Electrical Engineering)', '#3498db', '2023-08-05 12:26:25', '2023-08-05 12:26:25'),
(59, 'Master of Technology (Mechanical Engineering)', '#2ecc71', '2023-08-05 12:26:25', '2023-08-05 12:26:25'),
(60, 'Master of Technology (Civil Engineering)', '#e74c3c', '2023-08-05 12:26:25', '2023-08-05 12:26:25'),
(61, 'Master of Technology (Chemical Engineering)', '#9b59b6', '2023-08-05 12:26:25', '2023-08-05 12:26:25'),
(62, 'Master of Technology (Aerospace Engineering)', '#2c3e50', '2023-08-05 12:26:25', '2023-08-05 12:26:25'),
(63, 'Master of Technology (Biomedical Engineering)', '#27ae60', '2023-08-05 12:26:25', '2023-08-05 12:26:25'),
(64, 'Master of Computer Science (MCS)', '#1abc9c', '2023-08-05 12:26:25', '2023-08-05 12:26:25'),
(65, 'Others', '#d35400', '2023-08-05 15:37:18', '2023-08-05 15:37:18');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
