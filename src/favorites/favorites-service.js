const FavoritesService = {
    getFavorites(db) {
        return db
            .from('savethedate_favorites')
            .select('date_id')
            .where('savethedate_dates, ')

    },
    insertFavorite(knex, newFavorite) {
        return knex
            .insert(newFavorite)
            .into('savethedate_favorites')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getFavoriteById(knex, id) {
        return knex
            .from('savethedate_dates')
            .select('*')
            .where('id', id)
            .first()
    },
    deleteFavorite(knex, id) {
        return knex('savethedate_favorites')
        .where({ id })
        .delete()
    },
    updateFavorite(knex, id, newFavoriteFields) {
        return knex('savethedate_favorites')
        .where({id })
        .update(newFavoriteFields)
    }
}

module.exports = FavoritesService