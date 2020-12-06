CREATE TABLE savethedate_favorites (
    favorite_id INTEGER REFERENCES savethedate_dates(id) ON DELETE CASCADE NOT NULL
);