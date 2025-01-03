PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_exercises_routines` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`exercise_id` integer NOT NULL,
	`routine_id` integer NOT NULL,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`routine_id`) REFERENCES `routines`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_exercises_routines`("id", "exercise_id", "routine_id") SELECT "id", "exercise_id", "routine_id" FROM `exercises_routines`;--> statement-breakpoint
DROP TABLE `exercises_routines`;--> statement-breakpoint
ALTER TABLE `__new_exercises_routines` RENAME TO `exercises_routines`;--> statement-breakpoint
PRAGMA foreign_keys=ON;