-- phpMyAdmin SQL Dump
-- version 5.2.0-1.el7.remi
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Oct 21, 2022 at 12:15 AM
-- Server version: 10.6.9-MariaDB-log
-- PHP Version: 7.4.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cs340_burgerd`
--

-- --------------------------------------------------------

DROP TABLE IF EXISTS `Games`;
DROP TABLE IF EXISTS `Forms`;
DROP TABLE IF EXISTS `Teams`;
DROP TABLE IF EXISTS `Volunteers`;
DROP TABLE IF EXISTS `Players`;
DROP TABLE IF EXISTS `SeasonsDivisions`;
DROP TABLE IF EXISTS `Seasons`;
DROP TABLE IF EXISTS `Divisions`;
DROP TABLE IF EXISTS `Orders`;
DROP TABLE IF EXISTS `Adults`;


--
-- Table structure for table `Divisions`
--

CREATE TABLE IF NOT EXISTS `Divisions` (
  `divisionID` int(11) NOT NULL auto_increment,
  `description` varchar(75) NOT NULL unique,
  `minAge` int(11) NOT NULL,
  `maxAge` int(11) NOT NULL,
  `gender` varchar(2) NOT NULL,
  `minPlayers` int(11) DEFAULT NULL,
  `maxPlayers` int(11) DEFAULT NULL,
  `ballSize` varchar(75) DEFAULT NULL,
  `netSize` varchar(75) DEFAULT NULL,
  PRIMARY KEY (`divisionID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;


--
-- Table structure for table `Seasons`
--

CREATE TABLE IF NOT EXISTS `Seasons` (
  `seasonID` int(11) NOT NULL auto_increment,
  `startDate` date NOT NULL,
  `endDate` date NOT NULL,
  `seasonFee` decimal(6,2) NOT NULL,
  `description` varchar(45) NOT NULL unique,
  PRIMARY KEY (`seasonID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;


--
-- Table structure for table `SeasonsDivisions`
--

CREATE TABLE IF NOT EXISTS `SeasonsDivisions` (
  `seasonDivisionID` int(11) NOT NULL auto_increment,
  `description` varchar(45) DEFAULT NULL,
  `seasonID` int(11),
  `divisionID` int(11),
  PRIMARY KEY (`seasonDivisionID`),
  CONSTRAINT `seasonID` FOREIGN KEY (`seasonID`) REFERENCES `Seasons` (`seasonID`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `divisionID` FOREIGN KEY (`divisionID`) REFERENCES `Divisions` (`divisionID`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;


--
-- Table structure for table `Adults`
--

CREATE TABLE IF NOT EXISTS `Adults` (
  `adultID` int(11) NOT NULL auto_increment UNIQUE,
  `firstName` varchar(75) NOT NULL,
  `lastName` varchar(75) NOT NULL,
  `phone` varchar(16) NOT NULL,
  `email` varchar(100) NOT NULL,
  `isGuardian` tinyint(1) NOT NULL DEFAULT 1,
  `connectedAdultID` int(11) DEFAULT NULL,
  CONSTRAINT fullName UNIQUE (firstName, lastName),
  PRIMARY KEY (`adultID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;


--
-- Table structure for table `Teams`
--
CREATE TABLE IF NOT EXISTS `Teams` (
  `teamID` int(11) NOT NULL auto_increment,
  `name` varchar(75) NOT NULL unique,
  `mascot` varchar(75) DEFAULT NULL,
  `teamDivisionID` int(11),
  PRIMARY KEY (`teamID`),
  CONSTRAINT `teamDivisionID` FOREIGN KEY (`teamDivisionID`) REFERENCES `Divisions` (`divisionID`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;


--
-- Table structure for table `Volunteers`
--
CREATE TABLE IF NOT EXISTS `Volunteers` (
  `volunteerID` int(11) NOT NULL auto_increment,
  `role` varchar(75) NOT NULL,
  `details` varchar(75) DEFAULT NULL,
  `adultID` int(11) NOT NULL,
  `teamID` int(11),
  PRIMARY KEY (`volunteerID`),
  CONSTRAINT `adultID` FOREIGN KEY (`adultID`) REFERENCES `Adults` (`adultID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `teamID` FOREIGN KEY (`teamID`) REFERENCES `Teams` (`teamID`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;


--
-- Alter Table Teams to include one volunteerID for the head coach (who must be a volunteer and is required for every team)
--
ALTER TABLE Teams
ADD `headCoachID` int(11),
ADD CONSTRAINT `headCoachID` FOREIGN KEY (`headCoachID`) REFERENCES `Volunteers`(`volunteerID`) ON DELETE SET NULL ON UPDATE CASCADE
;


--
-- Table structure for table `Players`
--

CREATE TABLE IF NOT EXISTS`Players` (
  `playerID` int(11) NOT NULL auto_increment,
  `firstName` varchar(75) NOT NULL,
  `lastName` varchar(75) NOT NULL,
  `Gender` varchar(1) NOT NULL,
  `DOB` date NOT NULL,
  `primaryAdultID` int(11) NOT NULL,
  `playerTeamID` int(11) DEFAULT NULL,
  CONSTRAINT fullName UNIQUE (firstName, lastName),
  PRIMARY KEY (`playerID`),
  CONSTRAINT `primaryAdultID` FOREIGN KEY (`primaryAdultID`) REFERENCES `Adults` (`adultID`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `playerTeamID` FOREIGN KEY (`playerTeamID`) REFERENCES `Teams` (`teamID`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;


--
-- Table structure for table `Orders`
--
CREATE TABLE IF NOT EXISTS `Orders` (
  `orderID` int(11) NOT NULL auto_increment,
  `orderDate` datetime NOT NULL,
  `orderTotal` decimal(6,2) NOT NULL,
  `orderDetails` varchar(145) DEFAULT NULL,
  `registeringAdultID` int(11),
  PRIMARY KEY (`orderID`),
  CONSTRAINT `registeringAdultID` FOREIGN KEY (`registeringAdultID`) REFERENCES `Adults` (`adultID`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;


--
-- Table structure for table `Forms`
--
CREATE TABLE IF NOT EXISTS `Forms` (
  `formID` int(11) NOT NULL auto_increment,
  `formDetails` varchar(145) DEFAULT NULL,
  `orderID` int(11),
  `seasonDivisionID` int(11),
  `registeredPlayerID` int(11) DEFAULT NULL,
  `registeredAdultID` int(11) DEFAULT NULL,
  PRIMARY KEY (`formID`),
  CONSTRAINT `orderID` FOREIGN KEY (`orderID`) REFERENCES `Orders` (`orderID`) ON DELETE CASCADE ON UPDATE SET NULL,
  CONSTRAINT `seasonDivisionID` FOREIGN KEY (`seasonDivisionID`) REFERENCES `SeasonsDivisions` (`seasonDivisionID`) ON DELETE SET NULL ON UPDATE SET NULL,
  CONSTRAINT `registeredPlayerID` FOREIGN KEY (`registeredPlayerID`) REFERENCES `Players` (`playerID`) ON DELETE SET NULL ON UPDATE SET NULL,
  CONSTRAINT `registeredAdultID` FOREIGN KEY (`registeredAdultID`) REFERENCES `Adults` (`adultID`) ON DELETE SET NULL ON UPDATE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;


--
-- Table structure for table `Games`
--
CREATE TABLE IF NOT EXISTS `Games` (
  `gameID` int(11) NOT NULL auto_increment,
  `dateTime` datetime NOT NULL,
  `homeScore` int(11) DEFAULT NULL,
  `awayScore` int(11) DEFAULT NULL,
  `fieldNumber` int(11) DEFAULT NULL,
  `homeTeamID` int(11),
  `awayTeamID` int(11),
  `refereeID` int(11) DEFAULT NULL,
  PRIMARY KEY (`gameID`),
  CONSTRAINT `refereeID` FOREIGN KEY (`refereeID`) REFERENCES `Volunteers` (`volunteerID`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `homeTeamID` FOREIGN KEY (`homeTeamID`) REFERENCES `Teams` (`teamID`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `awayTeamID` FOREIGN KEY (`awayTeamID`) REFERENCES `Teams` (`teamID`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;



-- ------------------------------------------------------------------------------------------------------------------
--
-- Dumping data for table `Adults`
--

INSERT INTO `Adults` (`firstName`, `lastName`, `phone`, `email`, `isGuardian`, `connectedAdultID`) 
VALUES
('Moshe', 'Bond', '596-0323', 'BondMoshe@sample.co', 1, NULL),
('Kallie', 'Stanley', '550-8432', 'StanleyKallie@sample.co', 1, NULL),
('Darien', 'Camacho', '517-9505', 'CamachoDarien@sample.co', 1, NULL),
('Krysten', 'Donnelly', '507-2767', 'DonnellyKrysten@sample.co', 1, NULL),
('Brody', 'Scroggins', '547-1137', 'ScrogginsBrody@sample.co', 1, NULL),
('Raymundo', 'Bond', '528-6043', 'BondRaymundo@sample.co', 1, NULL),
('Mckenna', 'Hays', '595-0003', 'HaysMckenna@sample.co', 1, NULL),
('Kelly', 'Oh', '560-6648', 'OhKelly@sample.co', 1, NULL),
('Porter', 'Palumbo', '565-8419', 'PalumboPorter@sample.co', 1, NULL),
('Rayven', 'Whiting', '564-0574', 'WhitingRayven@sample.co', 1, NULL),
('John', 'Camacho', '582-4932', 'JohnS@sample.co', 0, 3),
('Miguel', 'Donnelly', '589-1234', 'mighays@sample.co', 1, 4);

-- --------------------------------------------------------
--
-- Dumping data for table `Divisions`
--

INSERT INTO `Divisions` (`description`, `minAge`, `maxAge`, `gender`, `minPlayers`, `maxPlayers`, `ballSize`, `netSize`) VALUES
('8u Boys', 6, 8, 'M', 5, 7, '3', '4x6'),
('8u Girls', 6, 8, 'F', 5, 7, '3', '4x6'),
('10u Boys', 8, 10, 'M', 7, 10, '4', '6x10'),
('10u Girls', 8, 10, 'F', 7, 10, '4', '6x10');

-- --------------------------------------------------------

--
-- Dumping data for table `Seasons`
--

INSERT INTO `Seasons` (`startDate`, `endDate`, `seasonFee`, `description`) VALUES
('2023-03-15', '2023-05-31', '60.00', 'Spring 2023'),
('2023-06-01', '2023-07-31', '90.00', 'Summer Tournament 2023'),
('2023-06-01', '2023-07-15', '45.00', 'Summer Playground 2023')
;

-- --------------------------------------------------------


--
-- Dumping data for table `SeasonsDivisions`
--

INSERT INTO `SeasonsDivisions` (`description`, `seasonID`, `divisionID`) VALUES
('8uB2023', 1, 1),
('8uG2023', 1, 2),
('10uB2023', 1, 3),
('10uG2023', 1, 4);

-- --------------------------------------------------------

--
-- Dumping data for table `Volunteers`
--

INSERT INTO `Volunteers` (`role`, `details`, `adultID`) VALUES
('Board Volunteer', 'CVPA', 2),
('Board Volunteer', 'Commissioner', 3),
('Coach', NULL, 5),
('Coach', NULL, 6),
('Coach', NULL, 1),
('Coach', NULL, 2),
('Referee', NULL, 4),
('Referee', NULL, 9),
('Referee', NULL, 11),
('Board Volunteer', NULL, 12);

--
-- Dumping data for table `Teams`
--

INSERT INTO `Teams` (`name`, `headCoachID`, `mascot`, `teamDivisionID`) VALUES
('Board of Directors', 1, 'pencils', NULL),
('Octopus Sharks', 2, 'Sharky Octopus', 1),
('Galloping Penguins', 3, 'Penguin', 1),
('Sparkly Mongoose', 4, 'Mongoose', 2),
('Spaghetti Meatballs', 5, 'Spaghetti', 4);

-- --------------------------------------------------------


--
-- Dumping data for table `Players`
--

INSERT INTO `Players` (`firstName`, `lastName`, `Gender`, `DOB`, `primaryAdultID`, `playerTeamID`) VALUES
('Leslie', 'McCord', 'M', '2014-12-28', 1, 2),
('Jamarcus', 'Turpin', 'F', '2015-04-11', 2, 4),
('Colin', 'Fay', 'M', '2014-03-16', 2, 2),
('Marisol', 'Howe', 'F', '2014-11-24', 1, 3),
('Rocio', 'Laws', 'M', '2014-07-11', 3, 3),
('Cecilia', 'Naranjo', 'F', '2015-09-02', 4, 4),
('Treyvon', 'Milligan', 'M', '2014-04-25', 4, 2),
('Beatrice', 'Forrester', 'F', '2016-11-14', 5, 3),
('Lindsey', 'Gross', 'F', '2014-08-22', 5, 3),
('Ernest', 'Mcnabb', 'F', '2014-09-05', 6, 3),
('Trace', 'Lawler', 'M', '2015-07-22', 6, 2),
('Dalton', 'Gauthier', 'F', '2016-11-02', 6, 3),
('Tania', 'Back', 'M', '2016-09-18', 8, 3),
('Sydney', 'Derosa', 'M', '2015-12-25', 9, 2),
('Emmanuel', 'Corrigan', 'M', '2015-08-10', 10, 2),
('Autumn', 'Olvera', 'M', '2014-12-19', 7, 2),
('Tina', 'Meehan', 'M', '2014-12-05', 7, 2);

-- ----------------------------------------------------
--
-- Dumping data for table `Orders`
--

INSERT INTO `Orders` (`orderDate`, `orderTotal`, `orderDetails`, `registeringAdultID`) VALUES
('2022-10-19 00:00:00', '120.00', NULL, 1),
('2022-10-19 00:00:00', '120.00', NULL, 2),
('2022-10-19 00:00:00', '60.00', NULL, 3),
('2022-10-19 00:00:00', '120.00', NULL, 4),
('2022-10-19 00:00:00', '120.00', NULL, 5),
('2022-10-19 00:00:00', '180.00', NULL, 6),
('2022-10-19 00:00:00', '120.00', NULL, 7),
('2022-10-19 00:00:00', '60.00', NULL, 8),
('2022-10-19 00:00:00', '60.00', NULL, 9),
('2022-10-19 00:00:00', '60.00', NULL, 10);


-- --------------------------------------------------------

--
-- Dumping data for table `Forms`
--

INSERT INTO `Forms` (`orderID`, `seasonDivisionID`, `formDetails`, `registeredPlayerID`, `registeredAdultID`) VALUES
(1, 1, NULL, 1, NULL),
(1, 2, NULL, 2, NULL),
(2, 1, NULL, 3, NULL),
(2, 2, NULL, 4, NULL),
(3, 2, NULL, NULL,11),
(3, 1, NULL, 5, NULL),
(4, 1, NULL, NULL, 12),
(4, 2, NULL, 6, NULL),
(4, 1, NULL, 7, NULL),
(5, 2, NULL, 8, NULL),
(5, 2, NULL, 9, NULL),
(6, 2, NULL, 10, NULL),
(6, 1, NULL, 11, NULL),
(6, 2, NULL, 12, NULL),
(7, 1, NULL, 13, NULL),
(7, 1, NULL, 14, NULL),
(8, 1, NULL, 15, NULL),
(9, 1, NULL, 16, NULL),
(10, 1, NULL, 17, NULL);

--
-- Dumping data for table `Games`
--

INSERT INTO `Games` (`dateTime`, `homeScore`, `awayScore`, `fieldNumber`, `homeTeamID`, `awayTeamID`, `refereeID`) VALUES
('2023-03-15 04:00:00', NULL, NULL, 402, 3, 2, 7),
('2023-03-22 04:30:00', NULL, NULL, 404, 2, 3, 8);


/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
