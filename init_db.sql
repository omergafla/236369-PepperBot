CREATE TABLE IF NOT EXISTS Users
(
    ID integer NOT NULL,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(50),
    is_admin integer DEFAULT 0,
    created_at date,
    PRIMARY KEY (ID),
    UNIQUE (username)
);

CREATE TABLE IF NOT EXISTS Polls
(
    ID integer NOT NULL,
    question VARCHAR(50) NOT NULL,
    permissions text DEFAULT '*',
    created_by integer,
    created_at date,
    PRIMARY KEY (ID),
    FOREIGN KEY (created_by) REFERENCES Users(ID)
);

CREATE TABLE IF NOT EXISTS Polls_Options
(
    ID integer NOT NULL,
    poll_id integer,
    option text,
    PRIMARY KEY (ID),
    FOREIGN KEY (poll_id) REFERENCES Polls(ID)
);

CREATE TABLE IF NOT EXISTS Users_Answers
(
    ID integer NOT NULL,
    user_id integer,
	poll_id integer,
    option_id integer,
    PRIMARY KEY (ID),
	FOREIGN KEY (user_id) REFERENCES Users(ID),
    FOREIGN KEY (poll_id) REFERENCES Polls(ID),
	FOREIGN KEY (option_id) REFERENCES Polls_Options(ID)
);

