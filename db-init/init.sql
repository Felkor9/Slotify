CREATE TABLE "user"(
id SERIAL PRIMARY KEY,
username TEXT NOT NULL UNIQUE,
email TEXT NOT NULL UNIQUE,
isadmin BOOLEAN DEFAULT false,
password TEXT NOT NULL
);

CREATE TABLE seats(
  id SERIAL PRIMARY KEY,
  seatNumber INTEGER NOT NULL CHECK (seatNumber BETWEEN 1 AND 6)
);

CREATE TABLE timeslots(
id SERIAL PRIMARY KEY,
startTime TIME,
endTime TIME,
seats_id INTEGER REFERENCES seats(id)
);

CREATE TABLE day(
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  timeslots_id INTEGER REFERENCES timeslots(id)
);

CREATE TABLE bookings(
id SERIAL PRIMARY KEY,
user_id INTEGER REFERENCES "user"(id),
day_id INTEGER REFERENCES day(id),
timeslots_id INTEGER REFERENCES timeslots(id),
seats_id INTEGER REFERENCES seats(id),
UNIQUE(user_id, day_id, timeslots_id, seats_id),
UNIQUE(day_id, timeslots_id, seats_id),
UNIQUE (user_id, day_id, timeslots_id)
);

INSERT INTO day(name)
VALUES ('Måndag'),
('Tisdag'),
('Onsdag'),
('Torsdag'),
('Fredag');

INSERT INTO timeslots(startTime, EndTime )
VALUES('09:00', '13:00'),
('13:00', '17:00' ),
('17:00', '21:00' );

INSERT INTO seats (seatNumber)
SELECT generate_series(1, 6);
