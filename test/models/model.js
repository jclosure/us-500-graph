//
// Model model tests. These are basically CRUD tests, ordered to let us test
// all cases, plus listing all models and following/unfollowing between models.
//
// It's worth noting that there may already be models in the database, so these
// tests must not assume the initial state is empty.
//
// High-level test plan:
//
// - List initial models.
// - Create a model A.
// - Fetch model A. Should be the same.
// - List models again; should be initial list plus model A.
// - Update model A, e.g. its name.
// - Fetch model A again. It should be updated.
// - Delete model A.
// - Try to fetch model A again; should fail.
// - List models again; should be back to initial list.
//
// - Create two models in parallel, B and C.
// - Fetch both model's "following and others"; both should show no following.
// - Have model B follow model C.
// - Have model B follow model C again; should be idempotent.
// - Fetch model B's "following and others"; should show following model C.
// - Fetch model C's "following and others"; should show not following model B.
// - Have model B unfollow model C.
// - Have model B unfollow model C again; should be idempotent.
// - Fetch both models' "following and others" again; both should follow none.
//
// - Create a model D.
// - Have model B follow model C follow model D.
// - Fetch all models' "following and others"; should be right.
// - Delete model B.
// - Fetch model C's and D's "following and others"; should be right.
// - Delete model D.
// - Fetch model C's "following and others"; should be right.
// - Delete model C.
//
// NOTE: I struggle to translate this kind of test plan into BDD style tests.
// E.g. what am I "describing", and what should "it" do?? Help welcome! =)
//


var expect = require('chai').expect;
var Model = require('../../models/model');


// Shared state:

var INITIAL_MODELS;
var MODEL_A, MODEL_B, MODEL_C, MODEL_D;


// Helpers:

/**
 * Asserts that the given object is a valid model model.
 * If an expected model model is given too (the second argument),
 * asserts that the given object represents the same model with the same data.
 */
function expectModel(obj, model) {
    expect(obj).to.be.an('object');
    expect(obj).to.be.an.instanceOf(Model);

    if (model) {
        ['id', 'name'].forEach(function (prop) {
            expect(obj[prop]).to.equal(model[prop]);
        });
    }
}

/**
 * Asserts that the given array of models contains the given model,
 * exactly and only once.
 */
function expectModelsToContain(models, expModel) {
    var found = false;

    expect(models).to.be.an('array');
    models.forEach(function (actModel) {
        if (actModel.id === expModel.id) {
            expect(found, 'Model already found').to.equal(false);
            expectModel(actModel, expModel);
            found = true;
        }
    });
    expect(found, 'Model not found').to.equal(true);
}

/**
 * Asserts that the given array of models does *not* contain the given model.
 */
function expectModelsToNotContain(models, expModel) {
    expect(models).to.be.an('array');
    models.forEach(function (actModel) {
        expect(actModel.id).to.not.equal(expModel.id);
    });
}

/**
 * Fetches the given model's "following and others", and asserts that it
 * reflects the given list of expected following and expected others.
 * The expected following is expected to be a complete list, while the
 * expected others may be a subset of all models.
 * Calls the given callback (err, following, others) when complete.
 */
function expectModelToFollow(model, expFollowing, expOthers, callback) {
    model.getFollowingAndOthers(function (err, actFollowing, actOthers) {
        if (err) return callback(err);

        expect(actFollowing).to.be.an('array');
        expect(actFollowing).to.have.length(expFollowing.length);
        expFollowing.forEach(function (expFollowingModel) {
            expectModelsToContain(actFollowing, expFollowingModel);
        });
        expOthers.forEach(function (expOtherModel) {
            expectModelsToNotContain(actFollowing, expOtherModel);
        });

        expect(actOthers).to.be.an('array');
        expOthers.forEach(function (expOtherModel) {
            expectModelsToContain(actOthers, expOtherModel);
        });
        expFollowing.forEach(function (expFollowingModel) {
            expectModelsToNotContain(actOthers, expFollowingModel);
        });

        // and neither list should contain the model itself:
        expectModelsToNotContain(actFollowing, model);
        expectModelsToNotContain(actOthers, model);

        return callback(null, actFollowing, actOthers);
    });
}


// Tests:

describe('Model models:', function () {

    // Single model CRUD:

    it('List initial models', function (next) {
        Model.getAll(function (err, models) {
            if (err) return next(err);

            expect(models).to.be.an('array');
            models.forEach(function (model) {
                expectModel(model);
            });

            INITIAL_MODELS = models;
            return next();
        });
    });

    it('Create model A', function (next) {
        var name = 'Test Model A';
        Model.create({name: name}, function (err, model) {
            if (err) return next(err);

            expectModel(model);
            expect(model.id).to.be.a('number');
            expect(model.name).to.be.equal(name);

            MODEL_A = model;
            return next();
        });
    });

    it('Fetch model A', function (next) {
        Model.get(MODEL_A.id, function (err, model) {
            if (err) return next(err);
            expectModel(model, MODEL_A);
            return next();
        });
    });

    it('List models again', function (next) {
        Model.getAll(function (err, models) {
            if (err) return next(err);

            // the order isn't part of the contract, so we just test that the
            // new array is one longer than the initial, and contains model A.
            expect(models).to.be.an('array');
            expect(models).to.have.length(INITIAL_MODELS.length + 1);
            expectModelsToContain(models, MODEL_A);

            return next();
        });
    });

    it('Update model A', function (next) {
        MODEL_A.name += ' (edited)';
        MODEL_A.save(function (err) {
            return next(err);
        });
    });

    it('Fetch model A again', function (next) {
        Model.get(MODEL_A.id, function (err, model) {
            if (err) return next(err);
            expectModel(model, MODEL_A);
            return next();
        });
    });

    it('Delete model A', function (next) {
        MODEL_A.del(function (err) {
            return next(err);
        });
    });

    it('Attempt to fetch model A again', function (next) {
        Model.get(MODEL_A.id, function (err, model) {
            expect(model).to.not.exist;  // i.e. null or undefined
            expect(err).to.be.an('object');
            expect(err).to.be.an.instanceOf(Error);
            return next();
        });
    });

    it('List models again', function (next) {
        Model.getAll(function (err, models) {
            if (err) return next(err);

            // like before, we just test that this array is now back to the
            // initial length, and *doesn't* contain model A.
            expect(models).to.be.an('array');
            expect(models).to.have.length(INITIAL_MODELS.length);
            expectModelsToNotContain(models, MODEL_A);

            return next();
        });
    });

    // Two-model following:

    it('Create models B and C', function (next) {
        var nameB = 'Test Model B';
        var nameC = 'Test Model C';

        function callback(err, model) {
            if (err) return next(err);

            expectModel(model);

            switch (model.name) {
                case nameB:
                    MODEL_B = model;
                    break;
                case nameC:
                    MODEL_C = model;
                    break;
                default:
                    // trigger an assertion error:
                    expect(model.name).to.equal(nameB);
            }

            if (MODEL_B && MODEL_C) {
                return next();
            }
        }

        Model.create({name: nameB}, callback);
        Model.create({name: nameC}, callback);
    });

    it('Fetch model B’s “following and others”', function (next) {
        expectModelToFollow(MODEL_B, [], [MODEL_C], function (err, following, others) {
            if (err) return next(err);

            // our helper tests most things; we just test the length of others:
            expect(others).to.have.length(INITIAL_MODELS.length + 1);

            return next();
        });
    });

    it('Fetch model C’s “following and others”', function (next) {
        expectModelToFollow(MODEL_C, [], [MODEL_B], function (err, following, others) {
            if (err) return next(err);

            // our helper tests most things; we just test the length of others:
            expect(others).to.have.length(INITIAL_MODELS.length + 1);

            return next();
        });
    });

    it('Have model B follow model C', function (next) {
        MODEL_B.follow(MODEL_C, function (err) {
            return next(err);
        });
    });

    it('Have model B follow model C again', function (next) {
        MODEL_B.follow(MODEL_C, function (err) {
            return next(err);
        });
    });

    it('Fetch model B’s “following and others”', function (next) {
        expectModelToFollow(MODEL_B, [MODEL_C], [], next);
    });

    it('Fetch model C’s “following and others”', function (next) {
        expectModelToFollow(MODEL_C, [], [MODEL_B], next);
    });

    it('Have model B unfollow model C', function (next) {
        MODEL_B.unfollow(MODEL_C, function (err) {
            return next(err);
        });
    });

    // NOTE: skipping this actually causes the next two tests to fail!
    it('Have model B unfollow model C again', function (next) {
        MODEL_B.unfollow(MODEL_C, function (err) {
            return next(err);
        });
    });

    it('Fetch model B’s “following and others”', function (next) {
        expectModelToFollow(MODEL_B, [], [MODEL_C], next);
    });

    it('Fetch model C’s “following and others”', function (next) {
        expectModelToFollow(MODEL_C, [], [MODEL_B], next);
    });

    // Multi-model-following deletions:

    it('Create model D', function (next) {
        var name = 'Test Model D';
        Model.create({name: name}, function (err, model) {
            if (err) return next(err);

            expectModel(model);
            expect(model.name).to.be.equal(name);

            MODEL_D = model;
            return next();
        });
    });

    it('Have model B follow model C follow model D', function (next) {
        var remaining = 2;

        function callback(err) {
            if (err) return next(err);
            if (--remaining === 0) {
                next();
            }
        }

        MODEL_B.follow(MODEL_C, callback);
        MODEL_C.follow(MODEL_D, callback);
    });

    it('Fetch all model’s “following and others”', function (next) {
        var remaining = 3;

        function callback(err) {
            if (err) return next(err);
            if (--remaining === 0) {
                next();
            }
        }

        expectModelToFollow(MODEL_B, [MODEL_C], [MODEL_D], callback);
        expectModelToFollow(MODEL_C, [MODEL_D], [MODEL_B], callback);
        expectModelToFollow(MODEL_D, [], [MODEL_B, MODEL_C], callback);
    });

    it('Delete model B', function (next) {
        MODEL_B.del(function (err) {
            return next(err);
        });
    });

    it('Fetch model C’s and D’s “following and others”', function (next) {
        var remaining = 2;

        function callback(err) {
            if (err) return next(err);
            if (--remaining === 0) {
                next();
            }
        }

        expectModelToFollow(MODEL_C, [MODEL_D], [], callback);
        expectModelToFollow(MODEL_D, [], [MODEL_C], callback);
    });

    it('Delete model D', function (next) {
        MODEL_D.del(function (err) {
            return next(err);
        });
    });

    it('Fetch model C’s “following and others”', function (next) {
        expectModelToFollow(MODEL_C, [], [], next);
    });

    it('Delete model C', function (next) {
        MODEL_C.del(function (err) {
            return next(err);
        });
    });

});
