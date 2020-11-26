const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const { makeDatesArray } = require('./dates.fixtures')
const supertest = require('supertest')

describe('dates endpoints', function() {
    let db

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('clean the table', () => db('savethedate_dates').truncate())

    afterEach('cleanup', () => db('savethedate_dates').truncate())

    describe(`Get /api/dates`, () => {
        context(`Given no dates`, () => {
            it('responds with 200 and an empty list', () => {
                return supertest(app)
                .get('/api/dates')
                .expect(200, [])
            })
        })
        context('Given there are dates in the database', () => {
            const testDates = makeDatesArray()
    
            beforeEach('insert dates', () => {
                return db
                    .into('savethedate_dates')
                    .insert(testDates)
            })
    
            it('GET /api/dates responds with 200 and all of the dates', () => {
                return supertest(app)
                .get('/api/dates')
                .expect(200, testDates)
            })
        })
    })

    describe(`GET /api/dates/:dates_id`, () => {
        context(`Given no dates`, () => {
            it(`responds with 404`, () => {
                const datesId = 123456
                return supertest(app)
                .get(`/api/dates/${datesId}`)
                .expect(404, { error: { message: `Date doesn't exist` } })
            })
        })
        context('Given there are dates in the database', () => {
            const testDates = makeDatesArray()

            beforeEach('insert dates', () => {
                return db
                    .into('savethedate_dates')
                    .insert(testDates)
            })

            it('responds with 200 and the specified article', () => {
                const datesId = 2
                const expectedDate = testDates[datesId - 1]
                return supertest(app)
                .get(`/api/dates/${datesId}`)
                .expect(200, expectedDate)
            })
        })
        context(`Given an XSS attack date`, () => {
            const maliciousDate = {
                id: 911,
                content: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`
            }

            beforeEach('insert malicious date', () => {
                return db
                    .into('savethedate_dates')
                    .insert([ maliciousDate ])
            })

            it('removes XSS attack content', () => {
                return supertest(app)
                .get(`/api/dates/${maliciousDate.id}`)
                .expect(200)
                .expect(res => {
                    expect(res.body.content).to.eql(`Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`)
                })
            })
        })
    })
    describe(`POST /api/dates`, () => {
        it(`creates a date, responding with 201 and the new date`, function() {
            this.retries(3)
            const newDate = {
                'content': 'Test new date...'
            }
            return supertest(app)
                .post('/api/dates')
                .send(newDate)
                .expect(201)
                .expect(res => {
                    expect(res.body.content).to.eql(newDate.content)
                    expect(res.body).to.have.property('id')
                })
                .then(postRes =>
                    supertest(app)
                    .get(`/api/dates/${postRes.body.id}`)
                    .expect(postRes.body)
                )
        }) 
        const requiredFields = ['content']

        requiredFields.forEach(field => {
            const newDate = {
                'content':'test test'
            }
            
            it(`responds with 400 and an error meessage when the '${field}' is missing`, () => {
                delete newDate[field]

                return supertest(app)
                    .post('/api/dates')
                    .send(newDate)
                    .expect(400, {
                        error: { message: `Missing '${field}' in request body`}
                    })
            })
        })
    })

    describe(`PATCH /api/dates/:dates_id`, () => {
        context(`Given no dates`, () => {
          it(`responds with 404`, () => {
            const dateId = 123456
            return supertest(app)
              .delete(`/api/dates/${dateId}`)
              .expect(404, { error: { message: `Date doesn't exist` } })
          })
        })
        context('Given there are dates in the database', () => {
            const testDates = makeDatesArray()

            beforeEach('insert dates', () => {
                return db
                    .into('savethedate_dates')
                    .insert(testDates)
            })

            it('responds with 204 and updates the dates', () => {
                const idToUpdate = 2
                const updateDate = {
                    content: 'test test'
                }
                const expectedDate = {
                    ...testDates[idToUpdate - 1],
                    ...updateDate
                }

                return supertest(app)
                    .patch(`/api/dates/${idToUpdate}`)
                    .send(updateDate)
                    .expect(204)
                    .then(res => 
                        supertest(app)
                            .get(`/api/dates/${idToUpdate}`)
                            .expect(expectedDate)
                    )
            })
        })
    })

    describe(`DELETE /api/dates/:dates_id`, () => {
        context('Given there are dates in the database', () => {
            const testDates = makeDatesArray()

            beforeEach('insert dates', () => {
                return db
                    .into('savethedate_dates')
                    .insert(testDates)
            })

            it('responds with 204 and removes the article', () => {
                const idToRemove = 2
                const expectedDates = testDates.filter(date => date.id !== idToRemove)
                return supertest(app)
                    .delete(`/api/dates/${idToRemove}`)
                    .expect(204)
                    .then(res =>
                        supertest(app)
                        .get(`/api/dates`)
                        .expect(expectedDates)
                    )
            })
        })
    })
})