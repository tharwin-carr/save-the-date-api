const DatesService = {
    getAllDates(knex) {
        return knex.select('*').from('savethedate_dates')
    },
    insertDate(knex, newDate) {
        return knex
            .insert(newDate)
            .into('savethedate_dates')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getById(knex, id) {
        return knex
            .from('savethedate_dates')
            .select('*')
            .where('id', id)
            .first()
    },
    deleteDate(knex, id) {
        return knex('savethedate_dates')
        .where({ id })
        .delete()
    },
    updateDate(knex, id, newDateFields) {
        return knex('savethedate_dates')
        .where({ id })
        .update(newDateFields)
    }
}

module.exports = DatesService