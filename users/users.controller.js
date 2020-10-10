const express = require('express');
const router = express.Router();
const userService = require('./user.service');

router.post('/authenticate', authenticate);
router.post('/register', register);
router.get('/', getAll);
router.get('/current', getCurrent);
router.get('/:id', getById);
router.post('/:id/post', addPost);
router.put('/:id/post', updatePost);
router.delete('/:id/post/:postId', deletePost);
router.delete('/:id', _delete);


module.exports = router;

function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch(err => next(err));
}

function register(req, res, next) {
    userService.create(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
    userService.getById(req.user.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getById(req, res, next) {
    userService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function addPost(req, res, next) {
    userService.addPost(req.params.id, req.body)
        .then((user) => res.json(user))
        .catch(err => next(err));
}

function updatePost(req, res, next) {
    userService.updatePost(req.params.id, req.body)
        .then((user) => res.json(user))
        .catch(err => next(err));
}

function deletePost(req, res, next) {
    userService.delete(req.params.id, req.params.postId)
        .then((user) => res.json(user))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}