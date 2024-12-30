CREATE TABLE `exercise_sets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`exercises_routine_id` integer NOT NULL,
	`type` text NOT NULL,
	`reps` integer,
	`weight` integer,
	`rest_seconds` integer,
	`order` integer NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`exercises_routine_id`) REFERENCES `exercises_routines`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `exercises` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `exercises_routines` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`exercises_id` integer NOT NULL,
	`routine_id` integer NOT NULL,
	FOREIGN KEY (`exercises_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`routine_id`) REFERENCES `routines`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `routines` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`color` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
