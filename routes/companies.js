// companies.js
// Routes to CRUD companies.

var Company = require('../models/company');

/**
 * GET /companies
 */
exports.list = function (req, res, next) {
    Company.getAll(function (err, companies) {
        if (err) return next(err);
        res.render('companies', {
            companies: companies
        });
    });
};

/**
 * POST /companies
 */
exports.create = function (req, res, next) {
    Company.create({
        name: req.body['name']
    }, function (err, company) {
        if (err) return next(err);
        res.redirect('/companies/' + company.id);
    });
};

/**
 * GET /companies/:id
 */
exports.show = function (req, res, next) {
  Company.get(req.params.id, function (err, company) {
        if (err) return next(err);
        // TODO also fetch and show followers? (not just follow*ing*)
    company.get_employees(function (err, employees, others) {
            if (err) return next(err);
            res.render('company', {
                company: company,
                employees: employees,
                others: others
            });
        });
    });
};

/**
 * POST /companies/:id
 */
exports.edit = function (req, res, next) {
    Company.get(req.params.id, function (err, company) {
        if (err) return next(err);
        company.name = req.body['name'];
        company.save(function (err) {
            if (err) return next(err);
            res.redirect('/companies/' + company.id);
        });
    });
};

/**
 * DELETE /companies/:id
 */
exports.del = function (req, res, next) {
    Company.get(req.params.id, function (err, company) {
        if (err) return next(err);
        company.del(function (err) {
            if (err) return next(err);
            res.redirect('/companies');
        });
    });
};

/**
 * POST /companies/:id/employ
 */
exports.employ = function (req, res, next) {
    Company.get(req.params.id, function (err, company) {
        if (err) return next(err);
        Company.get(req.body.company.id, function (err, other) {
            if (err) return next(err);
            company.employ(other, function (err) {
                if (err) return next(err);
                res.redirect('/companies/' + company.id);
            });
        });
    });
};

/**
 * POST /companies/:id/unemploy
 */
exports.unemploy = function (req, res, next) {
    Company.get(req.params.id, function (err, company) {
        if (err) return next(err);
        Company.get(req.body.company.id, function (err, other) {
            if (err) return next(err);
            company.unfollow(other, function (err) {
                if (err) return next(err);
                res.redirect('/companies/' + company.id);
            });
        });
    });
};
