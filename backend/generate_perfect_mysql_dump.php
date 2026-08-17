<?php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

$tables = DB::select("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");

$output = <<<SQL
-- RevvMotiv 100% Exact MySQL Dump
-- Generated directly from Laravel Schema

SET FOREIGN_KEY_CHECKS=0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

SQL;

foreach ($tables as $t) {
    $tableName = $t->name;
    $columns = DB::select("PRAGMA table_info(`{$tableName}`)");
    
    $output .= "\nDROP TABLE IF EXISTS `{$tableName}`;\n";
    $output .= "CREATE TABLE `{$tableName}` (\n";
    $colDefs = [];
    $pk = [];
    
    foreach ($columns as $col) {
        $name = $col->name;
        $type = strtoupper($col->type);
        $notNull = $col->notnull ? "NOT NULL" : "DEFAULT NULL";
        $dflt = $col->dflt_value !== null ? "DEFAULT " . $col->dflt_value : "";
        
        // Map SQLite types to MySQL types
        if ($name === 'id' && $col->pk) {
            $myType = "bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT";
            $colDefs[] = "  `{$name}` {$myType}";
            $pk[] = $name;
            continue;
        }
        
        if (str_contains($type, 'INT')) {
            $myType = "int(11)";
        } elseif (str_contains($type, 'VARCHAR') || str_contains($type, 'TEXT')) {
            if ($name === 'email' || $name === 'slug' || $name === 'key' || $name === 'code') {
                $myType = "varchar(191)";
            } elseif (str_contains($type, 'VARCHAR')) {
                $myType = "varchar(255)";
            } else {
                $myType = "longtext";
            }
        } elseif (str_contains($type, 'NUMERIC') || str_contains($type, 'DECIMAL')) {
            $myType = "decimal(10,2)";
        } elseif (str_contains($type, 'DATETIME') || str_contains($type, 'TIMESTAMP')) {
            $myType = "timestamp NULL DEFAULT NULL";
        } elseif (str_contains($type, 'BOOLEAN') || str_contains($type, 'TINYINT')) {
            $myType = "tinyint(1)";
        } else {
            $myType = "text";
        }
        
        $def = "  `{$name}` {$myType}";
        if (!str_contains($myType, 'timestamp') && !str_contains($myType, 'AUTO_INCREMENT')) {
            $def .= " {$notNull}";
            if ($dflt && !str_contains($dflt, 'NULL')) {
                $def .= " {$dflt}";
            }
        }
        $colDefs[] = $def;
        if ($col->pk && !in_array($name, $pk)) {
            $pk[] = $name;
        }
    }
    
    if (!empty($pk)) {
        $colDefs[] = "  PRIMARY KEY (`" . implode('`, `', $pk) . "`)";
    }
    
    $output .= implode(",\n", $colDefs);
    $output .= "\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n";
    
    // Insert rows
    $rows = DB::table($tableName)->get();
    if ($rows->isNotEmpty()) {
        $output .= "\n-- Data for `{$tableName}`\n";
        foreach ($rows as $row) {
            $rowArray = (array) $row;
            $cols = array_keys($rowArray);
            $escapedCols = array_map(fn($c) => "`$c`", $cols);
            $escapedVals = array_map(function($v) {
                if ($v === null) return "NULL";
                if (is_numeric($v) && !is_string($v)) return $v;
                return "'" . addslashes((string)$v) . "'";
            }, array_values($rowArray));
            
            $output .= "INSERT INTO `{$tableName}` (" . implode(', ', $escapedCols) . ") VALUES (" . implode(', ', $escapedVals) . ");\n";
        }
    }
}

$output .= "\nSET FOREIGN_KEY_CHECKS=1;\nCOMMIT;\n";

file_put_contents(__DIR__ . '/database/revvmotiv_full_database.sql', $output);
file_put_contents(dirname(__DIR__) . '/revvmotiv_full_database.sql', $output);
echo "Perfect MySQL dump generated!\n";
