DROP TABLE IF EXISTS users_entity;

DROP TABLE IF EXISTS image_entity;

DROP TABLE IF EXISTS comment_entity;

DROP TABLE IF EXISTS like_entity;

DROP TABLE IF EXISTS user_image;

CREATE TABLE
	user_entity (
		id UUID NOT NULL DEFAULT gen_random_uuid () PRIMARY KEY,
		email text UNIQUE,
		username text,
		pass text,
		pass_reset_token text,
		email_verification_token text,
		email_verified boolean,
		email_notifications boolean
	);

CREATE TABLE
	image_entity (
		id UUID NOT NULL DEFAULT gen_random_uuid () PRIMARY KEY,
		url text,
		author UUID,
		created_at timestamp
	);

CREATE TABLE
	comment_entity (
		id UUID NOT NULL DEFAULT gen_random_uuid () PRIMARY KEY,
		author UUID,
		image_id UUID,
		comment text,
		created_at timestamp,
		FOREIGN KEY (author) REFERENCES user_entity (id) ON DELETE CASCADE,
		FOREIGN KEY (image_id) REFERENCES image_entity (id) ON DELETE CASCADE
	);

CREATE TABLE
	like_entity (
		id UUID NOT NULL DEFAULT gen_random_uuid () PRIMARY KEY,
		author UUID,
		image_id UUID,
		FOREIGN KEY (author) REFERENCES user_entity (id) ON DELETE CASCADE,
		FOREIGN KEY (image_id) REFERENCES image_entity (id) ON DELETE CASCADE
	);

CREATE TABLE
	user_image (
		id SERIAL PRIMARY KEY,
		user_id UUID,
		image_id UUID,
		FOREIGN KEY (user_id) REFERENCES user_entity (id),
		FOREIGN KEY (image_id) REFERENCES image_entity (id) ON DELETE CASCADE
	);
