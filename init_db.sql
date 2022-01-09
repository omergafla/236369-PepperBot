CREATE TABLE IF NOT EXISTS Users
(
    ID SERIAL,
    effective_id integer NOT NULL,
    username VARCHAR(50) NOT NULL,
    is_active integer DEFAULT 1,
    created_at date,
    PRIMARY KEY (ID),
    UNIQUE (effective_id)
);

CREATE TABLE IF NOT EXISTS Polls
(
    ID SERIAL,
    question VARCHAR(50) NOT NULL,
    permission integer,
    created_by integer,
    created_at date,
    PRIMARY KEY (ID),
    FOREIGN KEY (created_by) REFERENCES Users(ID)
);

CREATE TABLE IF NOT EXISTS Polls_Options
(
    ID SERIAL,
    poll_id integer,
    option text,
    PRIMARY KEY (ID),
    FOREIGN KEY (poll_id) REFERENCES Polls(ID)
);

CREATE TABLE IF NOT EXISTS Users_Answers
(
    ID SERIAL,
    user_id integer,
	poll_id integer,
    option_id integer,
    PRIMARY KEY (ID),
	FOREIGN KEY (user_id) REFERENCES Users(ID),
    FOREIGN KEY (poll_id) REFERENCES Polls(ID),
	FOREIGN KEY (option_id) REFERENCES Polls_Options(ID)
);

CREATE TABLE IF NOT EXISTS Admins
(
    ID SERIAL,
    username VARCHAR(50),
	password VARCHAR(50),
    PRIMARY KEY (ID),
    UNIQUE (username)
);

CREATE OR REPLACE VIEW questions_and_answers
 AS
 SELECT p.id AS poll_id,
    p.question,
    po.option,
    ua.user_id
   FROM polls p
     LEFT JOIN polls_options po ON p.id = po.poll_id
     JOIN users_answers ua ON ua.poll_id = p.id AND ua.option_id = po.id;
