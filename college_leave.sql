-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 08, 2026 at 10:33 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `college_leave`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `email`, `password`) VALUES
(1, 'admin@gmail.com', '1234');

-- --------------------------------------------------------

--
-- Table structure for table `leaves`
--

CREATE TABLE `leaves` (
  `id` int(11) NOT NULL COMMENT 'auto increment',
  `student_email` varchar(100) NOT NULL,
  `from_date` date NOT NULL,
  `to_date` date NOT NULL,
  `reason` text NOT NULL,
  `status` varchar(20) DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `leaves`
--

INSERT INTO `leaves` (`id`, `student_email`, `from_date`, `to_date`, `reason`, `status`) VALUES
(1, '', '2026-02-18', '2026-02-27', 'i am fever', 'Rejected'),
(2, 'chintaladileep968@gmail.com', '2026-02-19', '2026-02-20', '', 'Rejected'),
(3, 'chintaladileep968@gmail.com', '2026-02-12', '2026-02-20', '', 'Rejected'),
(4, 'chintaladileep968@gmail.com', '2026-02-12', '2026-02-20', 'fever', 'Approved'),
(5, 'chintaladileep968@gmail.com', '2026-02-18', '2026-02-26', 'fever', 'Approved'),
(6, 'chintaladileep968@gmail.com', '2026-02-18', '2026-02-20', 'fever', 'Approved'),
(7, 'chintaladileep968@gmail.com', '2026-02-19', '2026-02-20', 'fever', 'Approved'),
(8, 'chintaladileep968@gmail.com', '2026-04-17', '2026-05-22', 'going to manali ', 'Approved'),
(9, 'chintaladileep968@gmail.com', '2026-02-04', '2026-02-27', 'fever', 'Approved'),
(10, 'chintaladileep968@gmail.com', '2026-02-13', '2026-02-28', 'manali', 'Approved'),
(11, 'chintaladileep968@gmail.com', '2026-02-19', '2026-02-21', 'manali', 'Approved'),
(12, 'chintaladileep968@gmail.com', '2026-02-19', '2026-02-20', 'manali', 'Approved'),
(13, 'chintaladileep968@gmail.com', '2026-02-28', '2026-02-27', 'fever', 'Approved'),
(14, 'chintaladileep968@gmail.com', '2026-02-21', '2026-02-28', '', 'Rejected'),
(15, 'chintaladileep968@gmail.com', '2026-02-20', '2026-02-20', '', 'Rejected'),
(16, 'chintaladileep968@gmail.com', '2026-02-21', '2026-02-28', 'college', 'Rejected'),
(17, 'chintaladileep968@gmail.com', '2026-02-20', '2026-02-27', 'fever', 'Approved'),
(18, 'chintaladileep968@gmail.com', '2026-02-27', '2026-02-28', 'sankranthi', 'Approved'),
(19, 'chintaladileep968@gmail.com', '2026-02-25', '2026-02-27', 'i am going to manali', 'Approved'),
(20, 'chintaladileep968@gmail.com', '2025-12-24', '2026-01-08', '', 'Rejected'),
(21, 'chintaladileep968@gmail.com', '2026-02-28', '2026-03-07', 'manali', 'Approved'),
(22, 'chintaladileep968@gmail.com', '2026-02-28', '2026-03-31', 'gooing to manali\r\n', 'Rejected'),
(23, 'chintaladileep968@gmail.com', '2026-02-21', '2026-03-26', 'manali', 'Pending'),
(24, 'chintaladileep968@gmail.com', '2026-02-28', '2026-03-05', '', 'Pending'),
(25, 'chintaladileep968@gmail.com', '2026-02-28', '2026-03-05', 'my name is manoj i permission leave because i am sick', 'Approved'),
(26, '245959', '2026-03-20', '2026-03-20', 'going to manali', 'Approved'),
(27, '245959', '2026-03-20', '2026-03-20', 'going to manali', 'Approved'),
(28, '245959', '2026-03-20', '2026-03-20', 'going to manali', 'Approved'),
(29, '245959', '2026-03-19', '2026-03-27', 'i am to manali', 'Approved'),
(30, '245959', '2026-03-07', '2026-03-19', 'of to seek leave', 'Approved'),
(31, '245959', '2026-03-04', '2026-03-21', '', 'Rejected'),
(32, '245959', '2026-03-14', '2026-03-26', '', 'Rejected'),
(33, '245959', '2026-03-13', '2026-04-04', '', 'Rejected');

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `id` int(11) NOT NULL,
  `admission_no` varchar(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `branch` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`id`, `admission_no`, `name`, `branch`) VALUES
(1, '245949', 'CHINTALA DILEEP KUMAR', 'BSC (AI&ML)'),
(167, '245901', 'AVALA ANAND BABU', NULL),
(168, '245902', 'DASIKA SARATH KUMAR', NULL),
(169, '245903', 'SHAIK NAADIA TASLEEM', NULL),
(170, '245904', 'CHIKATI YUGALA SRI', NULL),
(171, '245905', 'ORSU BRAHMAIAH', NULL),
(172, '245906', 'GUNDALA VENKAT', NULL),
(173, '245907', 'PATAN MASTAN', NULL),
(174, '245908', 'PATNALA VISWA TEJA', NULL),
(175, '245910', 'KUPPILA BALAJIREDDY', NULL),
(176, '245911', 'KAMBAMPATI NELIMA SAI', NULL),
(177, '245912', 'SHAIK ZAKEER BASHA', NULL),
(178, '245913', 'PALLI VIKRAMADITHYA', NULL),
(179, '245914', 'NATHAM MANOJ KUMAR', NULL),
(180, '245915', 'PATTAN AMEERKHAN', NULL),
(181, '245916', 'PYDIPOTHU NIVYA', NULL),
(182, '245917', 'GUTI KRISHNA SWAMY', NULL),
(183, '245918', 'KARRA THARUN', NULL),
(184, '245919', 'KOMMURU PAVANKUMAR', NULL),
(185, '245920', 'KOPPURAVURI NAVYA CHARITHA', NULL),
(186, '245922', 'KONA BHAVANI BHARGAVA', NULL),
(187, '245923', 'RAVINUTHALA NAGA SRIKARI', NULL),
(188, '245924', 'MADDULA NAMITHA', NULL),
(189, '245925', 'YENDURI KUSHWANTH SAI TARUN', NULL),
(190, '245926', 'PANDITHARADHYU LA SRI DURGA VA', NULL),
(191, '245927', 'PULIPATI TULASIPRIYA', NULL),
(192, '245928', 'VIJJI RAJESH', NULL),
(193, '245929', 'GANDEPALLI CHANDRA SAI CHAITH', NULL),
(194, '245931', 'GUDELA SURYA', NULL),
(195, '245933', 'KOTI BHAVANA', NULL),
(196, '245934', 'ONGOLE HAMSIKA LAKSHMI', NULL),
(197, '245935', 'DASARI JAY BABU', NULL),
(198, '245936', 'THANUKU BHASKAR TEJA', NULL),
(199, '245938', 'BASARALAANI KHAN', NULL),
(200, '245939', 'NANDAM YASH', NULL),
(201, '245940', 'MALLADI SEKHAR', NULL),
(202, '245942', 'JUPUDI GABRIEL SAMUEL', NULL),
(203, '245943', 'MURKIPUTTI VAMSI', NULL),
(204, '245944', 'M KALYANI', NULL),
(205, '245945', 'SK ABDUL REHMAN', NULL),
(206, '245946', 'NAGI LAKSHMI BALAJI', NULL),
(207, '245948', 'KANCHUMARTHI NIKHIL KUMAR', NULL),
(208, '245950', 'KATTA APPU', NULL),
(209, '245951', 'DIVA TRISHA', NULL),
(210, '245952', 'NANNAM KHATWANG', NULL),
(211, '245953', 'JAKKAM ANAND KUMAR', NULL),
(212, '245954', 'N KIRAN KUMAR', NULL),
(213, '245955', 'T TEJASWINI', NULL),
(214, '245956', 'SHAIK AZEEMUDDIN', NULL),
(215, '245957', 'MIDHANI MOHIDDIN', NULL),
(216, '245958', 'V VENKATA NAGA ADITHYA', NULL),
(217, '245959', 'K VENKATA SURENDRA', NULL),
(218, '245960', 'L VASAVI SAI CHARAN', NULL),
(219, '245961', 'VIKRAM AKASH', NULL),
(220, '245962', 'YADAGIRI DHANUSH', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `role` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `role`) VALUES
(1, 'admin@gmail.com', '1234', 'admin');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `leaves`
--
ALTER TABLE `leaves`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `admission_no` (`admission_no`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `leaves`
--
ALTER TABLE `leaves`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'auto increment', AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=221;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
