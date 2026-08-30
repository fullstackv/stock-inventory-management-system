-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 10, 2026 at 05:37 PM
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
-- Database: `sims`
--

-- --------------------------------------------------------

--
-- Table structure for table `spares`
--

CREATE TABLE `spares` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `quantity` int(11) DEFAULT 0,
  `unitPrice` decimal(10,2) NOT NULL,
  `totalPrice` decimal(12,2) DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `spares`
--

INSERT INTO `spares` (`id`, `name`, `category`, `quantity`, `unitPrice`, `totalPrice`, `created_at`) VALUES
(1, 'Book', 'School material', 90, 1000.00, 90000.00, '2026-04-10 15:01:45'),
(2, 'Laptop', 'Electronic device', 6, 240000.00, 1440000.00, '2026-04-10 15:20:55'),
(3, 'Neville Andrews', 'Voluptatem enim modi', 817, 443.00, 361931.00, '2026-04-10 15:21:59'),
(4, 'Jin Wise', 'Aliquam obcaecati au', 867, 295.00, 255765.00, '2026-04-10 15:22:20');

-- --------------------------------------------------------

--
-- Table structure for table `stock_in`
--

CREATE TABLE `stock_in` (
  `id` int(11) NOT NULL,
  `spare_id` int(11) NOT NULL,
  `stockInQuantity` int(11) NOT NULL,
  `stockInDate` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `stock_out`
--

CREATE TABLE `stock_out` (
  `id` int(11) NOT NULL,
  `spare_id` int(11) NOT NULL,
  `stockOutQuantity` int(11) NOT NULL,
  `stockOutUnitPrice` decimal(10,2) NOT NULL,
  `stockOutTotalPrice` decimal(12,2) NOT NULL,
  `stockOutDate` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `fullnames` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `fullnames`, `email`, `phone`, `password`) VALUES
(13, 'Frank', 'frank@gmail.com', '0785564435', '$2b$10$c0y27sMhpz6kVbo8Ekh6n.aYpcN8Zgwf5pNSCyB0LNvEMUZKs0oV.');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `spares`
--
ALTER TABLE `spares`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `stock_in`
--
ALTER TABLE `stock_in`
  ADD PRIMARY KEY (`id`),
  ADD KEY `spare_id` (`spare_id`);

--
-- Indexes for table `stock_out`
--
ALTER TABLE `stock_out`
  ADD PRIMARY KEY (`id`),
  ADD KEY `spare_id` (`spare_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `spares`
--
ALTER TABLE `spares`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `stock_in`
--
ALTER TABLE `stock_in`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `stock_out`
--
ALTER TABLE `stock_out`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `stock_in`
--
ALTER TABLE `stock_in`
  ADD CONSTRAINT `stock_in_ibfk_1` FOREIGN KEY (`spare_id`) REFERENCES `spares` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `stock_out`
--
ALTER TABLE `stock_out`
  ADD CONSTRAINT `stock_out_ibfk_1` FOREIGN KEY (`spare_id`) REFERENCES `spares` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- ============================================================
-- ADVANCED FEATURES MIGRATION (Aug 2026)
-- Adds: categories, suppliers, stock adjustments, activity log,
-- user roles, and richer metadata on `spares` (SKU, reorder level,
-- category/supplier links, storage location).
-- Safe to run once against an existing `sims` database created by
-- the dump above. Run the statements in order.
-- ============================================================

START TRANSACTION;

-- --------------------------------------------------------
-- Categories
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Seed categories from any existing free-text `spares.category` values
INSERT IGNORE INTO `categories` (`name`)
  SELECT DISTINCT `category` FROM `spares`
  WHERE `category` IS NOT NULL AND `category` <> '';

-- --------------------------------------------------------
-- Suppliers
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `suppliers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `contact_person` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Extend `spares` with professional inventory metadata
-- --------------------------------------------------------
ALTER TABLE `spares`
  ADD COLUMN IF NOT EXISTS `sku` varchar(50) DEFAULT NULL AFTER `name`,
  ADD COLUMN IF NOT EXISTS `category_id` int(11) DEFAULT NULL AFTER `category`,
  ADD COLUMN IF NOT EXISTS `supplier_id` int(11) DEFAULT NULL AFTER `category_id`,
  ADD COLUMN IF NOT EXISTS `min_stock_level` int(11) NOT NULL DEFAULT 10 AFTER `quantity`,
  ADD COLUMN IF NOT EXISTS `location` varchar(100) DEFAULT NULL AFTER `min_stock_level`,
  ADD COLUMN IF NOT EXISTS `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() AFTER `created_at`;

-- Backfill category_id from the legacy free-text category column
UPDATE `spares` s
  JOIN `categories` c ON s.`category` = c.`name`
  SET s.`category_id` = c.`id`
  WHERE s.`category_id` IS NULL;

-- Backfill a readable SKU for existing rows that don't have one
UPDATE `spares`
  SET `sku` = CONCAT('SP-', LPAD(`id`, 5, '0'))
  WHERE `sku` IS NULL OR `sku` = '';

ALTER TABLE `spares` ADD UNIQUE KEY IF NOT EXISTS `sku_unique` (`sku`);

ALTER TABLE `spares`
  ADD CONSTRAINT `spares_category_fk` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `spares_supplier_fk` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`) ON DELETE SET NULL;

-- --------------------------------------------------------
-- Stock adjustments (damage, correction, stock-take, etc.)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `stock_adjustments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `spare_id` int(11) NOT NULL,
  `adjustment_type` enum('increase','decrease') NOT NULL,
  `quantity` int(11) NOT NULL,
  `reason` varchar(255) NOT NULL,
  `adjusted_by` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `spare_id` (`spare_id`),
  CONSTRAINT `stock_adjustments_ibfk_1` FOREIGN KEY (`spare_id`) REFERENCES `spares` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Activity log (audit trail across the whole system)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `activity_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_email` varchar(100) DEFAULT NULL,
  `action` varchar(100) NOT NULL,
  `details` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- User roles
-- --------------------------------------------------------
ALTER TABLE `users`
  ADD COLUMN IF NOT EXISTS `role` enum('admin','manager','staff') NOT NULL DEFAULT 'admin' AFTER `password`,
  ADD COLUMN IF NOT EXISTS `created_at` timestamp NOT NULL DEFAULT current_timestamp() AFTER `role`;

COMMIT;
