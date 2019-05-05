
-- 
-- Creates a migration history table that keeps track of the state
-- of the database.
-- 
-- DO NOT MODIFY THIS SCRIPT, OR MYSQL MIGRATE MAY FAIL TO WORK
-- 

create table mysql_migrate_history (
	id int unsigned primary key auto_increment,
	action enum ('migrate', 'rollback') not null,
	version varchar(255) not null,
	run_time timestamp not null default now(),
	run_user varchar(255) not null default current_user()
)
Engine=InnoDB;
