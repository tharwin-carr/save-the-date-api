const FavoritesService = {
    getFavorites(knex) {
        return knex
        .select('*')
        .from('savethedate_favorites')
        .join('savethedate_dates', 'savethedate_dates.id', '=', 'savethedate_favorites.favorite_id')
    },
    insertFavorite(knex, favoriteId, ) {
        return knex
            .insert({ favorite_id: favoriteId })
            .into('savethedate_favorites')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getFavoriteById(knex, favoriteId) {
        return knex
            .from('savethedate_favorites')
            .select('*')
            .where('favorite_id', favoriteId)
            .first()
    },
    deleteFavorite(knex, favoriteId) {
        return knex('savethedate_favorites')
        .where('favorite_id', favoriteId)
        .delete()
    },
    updateFavorite(knex, id, newFavoriteFields) {
        return knex('savethedate_favorites')
        .where({id })
        .update(newFavoriteFields)
    },
}

module.exports = FavoritesService