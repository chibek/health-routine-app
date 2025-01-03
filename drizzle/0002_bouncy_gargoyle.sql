PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_exercise_sets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`exercises_routine_id` integer NOT NULL,
	`type` text NOT NULL,
	`reps` integer,
	`weight` integer,
	`rest_seconds` integer,
	`order` integer NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`exercises_routine_id`) REFERENCES `exercises_routines`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_exercise_sets`("id", "exercises_routine_id", "type", "reps", "weight", "rest_seconds", "order", "created_at", "updated_at") SELECT "id", "exercises_routine_id", "type", "reps", "weight", "rest_seconds", "order", "created_at", "updated_at" FROM `exercise_sets`;--> statement-breakpoint
DROP TABLE `exercise_sets`;--> statement-breakpoint
ALTER TABLE `__new_exercise_sets` RENAME TO `exercise_sets`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_exercises_routines` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`exercise_id` integer NOT NULL,
	`routine_id` integer NOT NULL,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`routine_id`) REFERENCES `routines`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_exercises_routines`("id", "exercise_id", "routine_id") SELECT "id", "exercise_id", "routine_id" FROM `exercises_routines`;--> statement-breakpoint
DROP TABLE `exercises_routines`;--> statement-breakpoint
ALTER TABLE `__new_exercises_routines` RENAME TO `exercises_routines`;