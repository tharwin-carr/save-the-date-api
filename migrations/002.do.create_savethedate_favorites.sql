CREATE TABLE savethedate_favorites {
    date_id INTEGER REFERENCES savethedate_dates(id) ON DELETE CASCADE NOT NULL
);