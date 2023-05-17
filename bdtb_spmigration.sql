-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 16, 2023 at 10:20 PM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bdtb_spmigration`
--

-- --------------------------------------------------------

--
-- Table structure for table `assigned_pages`
--

CREATE TABLE `assigned_pages` (
  `id` int(11) NOT NULL,
  `title` char(255) NOT NULL,
  `ID_request` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `assigned_users`
--

CREATE TABLE `assigned_users` (
  `ID_user` int(11) NOT NULL,
  `ID_request` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migration_history`
--

CREATE TABLE `migration_history` (
  `ID` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `source_url` varchar(255) NOT NULL,
  `destination_url` varchar(255) NOT NULL,
  `migration_date` datetime NOT NULL,
  `status` enum('Completed','Error') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migration_request`
--

CREATE TABLE `migration_request` (
  `ID` int(11) NOT NULL,
  `request_name` varchar(255) NOT NULL,
  `destination_url` varchar(255) NOT NULL,
  `source_url` varchar(255) NOT NULL,
  `status` enum('New','Approved') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `ID` int(11) NOT NULL,
  `UserName` varchar(32) NOT NULL,
  `Password` varchar(32) NOT NULL,
  `Email` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `assigned_pages`
--
ALTER TABLE `assigned_pages`
  ADD KEY `ID_request` (`ID_request`);

--
-- Indexes for table `assigned_users`
--
ALTER TABLE `assigned_users`
  ADD KEY `ID_user` (`ID_user`),
  ADD KEY `ID_request` (`ID_request`);

--
-- Indexes for table `migration_history`
--
ALTER TABLE `migration_history`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `ID` (`ID`),
  ADD KEY `ID_2` (`ID`);

--
-- Indexes for table `migration_request`
--
ALTER TABLE `migration_request`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `ID` (`ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `migration_history`
--
ALTER TABLE `migration_history`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migration_request`
--
ALTER TABLE `migration_request`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `assigned_pages`
--
ALTER TABLE `assigned_pages`
  ADD CONSTRAINT `assigned_pages_ibfk_1` FOREIGN KEY (`ID_request`) REFERENCES `migration_request` (`ID`);

--
-- Constraints for table `assigned_users`
--
ALTER TABLE `assigned_users`
  ADD CONSTRAINT `assigned_users_ibfk_1` FOREIGN KEY (`ID_user`) REFERENCES `user` (`ID`),
  ADD CONSTRAINT `assigned_users_ibfk_2` FOREIGN KEY (`ID_request`) REFERENCES `migration_request` (`ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
