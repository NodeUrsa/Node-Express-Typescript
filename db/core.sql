-- Create all schedule database tables

-- If you haven't already, create the selvera_hydration user and database
-- % psql -U postgres
-- postgres=# create database selvera_hydration;
-- CREATE DATABASE
-- postgres=# create user selvera_hydration password 'selvera_hydration';
-- CREATE ROLE
-- postgres=# grant all privileges on database selvera_hydration to selvera_hydration;
-- GRANT
-- postgres=# \q

begin;

	-- Set timezone
	set timezone='UTC';

	-- Setup schema
	drop table if exists schema_info;
	create table schema_info (
		id bigserial primary key,
		name VARCHAR(32) not null,
		version VARCHAR(32) not null
	);
	insert into schema_info (name, version) values ('selvera_hydration', '1.0.0');

	drop table if exists consumption;

	create table consumption (
		account bigint not null,
		date date not null,
		quantity integer not null default 0
	);
	create index account on consumption(account);
	create index consumption_date on consumption(date);
	comment on column consumption.quantity is 'Stores consumption in milliters';
	
commit;