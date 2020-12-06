const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const { makeFavoritesArray } = require('./favorites.fixtures')
const supertest = require('supertest')

describe('favorites endpoints', function() {
    let db

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('clean the table', () => db('savethedate_favorites').truncate())

    afterEach('cleanup', () => db('savethedate_favorites').truncate())

    describe.only(`Get /api/favorites`, () => {
        context(`Given no favorites`, () => {
            it('responds with 200 and an empty list', () => {
                return supertest(app)
                .get('/api/favorites')
                .expect(200, [])
            })
        })
    })
})