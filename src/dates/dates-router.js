const path = require('path')
const express = require('express')
const xss = require('xss')
const DatesService = require('./dates-service')

const datesRouter = express.Router()
const jsonParser = express.json()

const serializeDate = dates => ({
    id: dates.id,
    content: xss(dates.content) //sanitize content
})

datesRouter
.route('/')
.get((req, res, next) => {
    const knexInstance = req.app.get('db')
    DatesService.getAllDates(knexInstance)
    .then(dates => {
        res.json(dates.map(serializeDate))
    })
    .catch(next)
}) //get all dates
.post(jsonParser, (req, res, next) => {
    const { content } = req.body
    const newDate = { content }

    for (const [key, value] of Object.entries(newDate)) {
        if (value == null) {
            return res.status(400).json({
                error: { message:  `Missing '${key}' in request body` }
            })
        }
    }
    
    //newDate.content = content
    DatesService.insertDate(
        req.app.get('db'),
        newDate
    )
    .then(date => {
        res
            .status(201)
            .location(path.posix.join(req.originalUrl, `/${date.id}`))
            .json(serializeDate(date))
    })
    .catch(next)
}) //post new dates 

datesRouter
.route('/:id')
.all((req, res, next) => {
    DatesService.getById(
        req.app.get('db'),
        req.params.id
    )
    .then(date => {
        if(!date) {
            return res.status(404).json({
                error: { message: `Date doesn't exist` }
            })
        }
        res.date = date
        next()
    })
    .catch(next)
})
.get((req, res, next) => {
    res.json(serializeDate(res.date))
})
.patch(jsonParser, (req, res, next) => {
    const { content } = req.body
    const dateToUpdate = { content }

    const numberOfValues = Object.values(dateToUpdate).filter(Boolean).length
    if(numberOfValues === 0) {
        return res.status(400).json({
            error: {
                message: `Request body must contain 'content'`
            }
        })
    }
    DatesService.updateDate(
        req.app.get('db'),
        req.params.id,
        dateToUpdate
    )
    .then(numRowsAffected => {
        res.status(204).end()
    })
    .catch(next)
})
.delete((req, res, next) => {
    DatesService.deleteDate(
        req.app.get('db'),
        req.params.id
    )
    .then((numRowsAffected) => {
        res.status(204).end()
    })
    .catch(next)
})

module.exports = datesRouter