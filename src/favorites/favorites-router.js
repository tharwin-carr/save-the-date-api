const path = require('path')
const express = require('express')
const xss = require('xss')
const FavoritesService = require('./favorites-service')

const favoritesRouter = express.Router()
const jsonParser = express.json()

const serializeFavorite = favorite => ({
    id: favorite.id,
    content: xss(favorite.content) //sanitize content
})

favoritesRouter
.route('/')
.get((req, res, next) => {
    const knexInstance = req.app.get('db')
    FavoritesService.getAllFavorites(knexInstance)
    .then(favorites => {
        res.json(favorites.map(serializeFavorite))
    })
    .catch(next)
})
.post(jsonParser, (req, res, next) => {
    const { content } = req.body
    const favorite = { content }

    for (const [key, value] of Object.entries(favorie)) {
        if (value == null) {
            return res.status(400).json({
                error: { message: `Missing '${key} in request body`}
            })
        }
    }

    FavoritesService.insertFavorite(
        req.app.get('db'),
        favorite
    )
    .then(date => {
        res
            .status(201)
            .location(path.posix.join(req.originalUrl, `/${date.id}`))
            .json(serializeFavorite(date))
    })
    .catch(next)
})

favoritesRouter
.route(':favorite_id')
.all((req, res, next) => {
    FavoritesService.getFavoriteById(
        req.app.get('db'),
        req.params.favorite_id
    )
    .then(favorite => {
        if(!favorite) {
            return res.status(404).json({
                error: { message: `Favorite doesn't exist`}
            })
        }
        res.favorite = favorite
        next()
    })
    .catch(next)
})
.get((req, res, next) => {
    res.json(serializeFavorite(res.favorite))
})
.patch(jsonParser, (req, res, next) => {
    const { content } = req.body
    const favoriteToUpdate = { content }

    const numberOfValues = Object.values(favoriteToUpdate).filter(Boolean).length
    if(numberOfValues === 0) {
        return res.status(400).json({
            error: {
                message: `Request body must contain content`
            }
        })
    }
    FavoritesService.updateFavorite(
        req.app.get('db'),
        req.params.id,
        favoriteToUpdate
    )
    .then(numRowsAffected => {
        res.status(204).end()
    })
    .catch(next)
})
.delete((req, res, next) => {
    FavoritesService.deleteFavorite(
        req.app.get('db'),
        req.params.id
    )
    .then((numRowsAffected) => {
        res.status(204).end()
    })
    .catch(next)
})

module.exports = favoritesRouter