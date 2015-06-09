// people.js
// Routes to CRUD people.

var Person = require('../models/person');

/**
 * GET /people
 */
exports.list = function (req, res, next) {
    Person.getAll(function (err, people) {
        if (err) return next(err);
        res.render('people', {
            people: people
        });
    });
};

/**
 * POST /people
 */
exports.create = function (req, res, next) {
    Person.create({
        name: req.body['name']
    }, function (err, person) {
        if (err) return next(err);
        res.redirect('/people/' + person.id);
    });
};

/**
 * GET /people/:id
 */
exports.show = function (req, res, next) {
    Person.get(req.params.id, function (err, person) {
        if (err) return next(err);
        // TODO also fetch and show followers? (not just follow*ing*)
        person.getFollowingAndOthers(function (err, following, others) {
            if (err) return next(err);
            res.render('person', {
                person: person,
                following: following,
                others: others
            });
        });
    });
};

/**
 * POST /people/:id
 */
exports.edit = function (req, res, next) {
    Person.get(req.params.id, function (err, person) {
        if (err) return next(err);
        person.name = req.body['name'];
        person.save(function (err) {
            if (err) return next(err);
            res.redirect('/people/' + person.id);
        });
    });
};

/**
 * DELETE /people/:id
 */
exports.del = function (req, res, next) {
    Person.get(req.params.id, function (err, person) {
        if (err) return next(err);
        person.del(function (err) {
            if (err) return next(err);
            res.redirect('/people');
        });
    });
};

/**
 * POST /people/:id/follow
 */
exports.follow = function (req, res, next) {
    Person.get(req.params.id, function (err, person) {
        if (err) return next(err);
        Person.get(req.body.person.id, function (err, other) {
            if (err) return next(err);
            person.follow(other, function (err) {
                if (err) return next(err);
                res.redirect('/people/' + person.id);
            });
        });
    });
};

/**
 * POST /people/:id/unfollow
 */
exports.unfollow = function (req, res, next) {
    Person.get(req.params.id, function (err, person) {
        if (err) return next(err);
        Person.get(req.body.person.id, function (err, other) {
            if (err) return next(err);
            person.unfollow(other, function (err) {
                if (err) return next(err);
                res.redirect('/people/' + person.id);
            });
        });
    });
};
