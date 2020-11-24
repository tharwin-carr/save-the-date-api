const DatesService = {
    getAllDates(knex) {
        return knex.select('*').from('dates')
    },
    insertDate(knex, newDate) {
        return knex
            .insert(newDate)
            .into('dates')
            .returng('*')
            .then(rows => {
                return rows[0]
            })
    },
    getById(knex, id) {
        return knex
            .from('dates')
            .select('*')
            .where('id', id)
            .first()
    },
    deleteDate(knex, id) {
        return knex('dates')
        .where({ id })
        .delete()
    },
    updateDate(knex, id, newDateFields) {
        return knex('dates')
        .where({ id })
        .update(newDateFields)
    }
}

module.exports = DatesService