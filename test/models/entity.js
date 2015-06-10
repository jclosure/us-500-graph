// entity.js
// Entity entity tests. These are basically CRUD tests, ordered to let us test
// all cases, plus listing all entities and following/unfollowing between entities.
//
// It's worth noting that there may already be entities in the database, so these
// tests must not assume the initial state is empty.
//
// High-level test plan:
//
// - List initial entities.
// - Create a entity A.
// - Fetch entity A. Should be the same.
// - List entities again; should be initial list plus entity A.
// - Update entity A, e.g. its name.
// - Fetch entity A again. It should be updated.
// - Delete entity A.
// - Try to fetch entity A again; should fail.
// - List entities again; should be back to initial list.
//
// - Create two entities in parallel, B and C.
// - Fetch both entity's "following and others"; both should show no following.
// - Have entity B follow entity C.
// - Have entity B follow entity C again; should be idempotent.
// - Fetch entity B's "following and others"; should show following entity C.
// - Fetch entity C's "following and others"; should show not following entity B.
// - Have entity B unfollow entity C.
// - Have entity B unfollow entity C again; should be idempotent.
// - Fetch both entities' "following and others" again; both should follow none.
//
// - Create a entity D.
// - Have entity B follow entity C follow entity D.
// - Fetch all entities' "following and others"; should be right.
// - Delete entity B.
// - Fetch entity C's and D's "following and others"; should be right.
// - Delete entity D.
// - Fetch entity C's "following and others"; should be right.
// - Delete entity C.
//
// NOTE: I struggle to translate this kind of test plan into BDD style tests.
// E.g. what am I "describing", and what should "it" do?? Help welcome! =)
//

var chai = require('chai');
var expect = chai.expect;



var Entity = require('../../models/entity');


// Shared state:

var INITIAL_ENTITIES;
var ENTITY_A, ENTITY_B, ENTITY_C, ENTITY_D;


// Helpers:

/**
 * Asserts that the given object is a valid entity entity.
 * If an expected entity entity is given too (the second argument),
 * asserts that the given object represents the same entity with the same data.
 */
function expectEntity(obj, entity) {
    expect(obj).to.be.an('object');
    expect(obj).to.be.an.instanceOf(Entity);

    if (entity) {
        ['id', 'name'].forEach(function (prop) {
            expect(obj[prop]).to.equal(entity[prop]);
        });
    }
}

/**
 * Asserts that the given array of entities contains the given entity,
 * exactly and only once.
 */
function expectEntitiesToContain(entities, expEntity) {
    var found = false;

    expect(entities).to.be.an('array');
    entities.forEach(function (actEntity) {
        if (actEntity.id === expEntity.id) {
            expect(found, 'Entity already found').to.equal(false);
            expectEntity(actEntity, expEntity);
            found = true;
        }
    });
    expect(found, 'Entity not found').to.equal(true);
}

/**
 * Asserts that the given array of entities does *not* contain the given entity.
 */
function expectEntitiesToNotContain(entities, expEntity) {
    expect(entities).to.be.an('array');
    entities.forEach(function (actEntity) {
        expect(actEntity.id).to.not.equal(expEntity.id);
    });
}

/**
 * Fetches the given entity's "following and others", and asserts that it
 * reflects the given list of expected following and expected others.
 * The expected following is expected to be a complete list, while the
 * expected others may be a subset of all entities.
 * Calls the given callback (err, following, others) when complete.
 */
function expectEntityToFollow(entity, expFollowing, expOthers, callback) {
    entity.getFollowingAndOthers(function (err, actFollowing, actOthers) {
        if (err) return callback(err);

        expect(actFollowing).to.be.an('array');
        expect(actFollowing).to.have.length(expFollowing.length);
        expFollowing.forEach(function (expFollowingEntity) {
            expectEntitiesToContain(actFollowing, expFollowingEntity);
        });
        expOthers.forEach(function (expOtherEntity) {
            expectEntitiesToNotContain(actFollowing, expOtherEntity);
        });

        expect(actOthers).to.be.an('array');
        expOthers.forEach(function (expOtherEntity) {
            expectEntitiesToContain(actOthers, expOtherEntity);
        });
        expFollowing.forEach(function (expFollowingEntity) {
            expectEntitiesToNotContain(actOthers, expFollowingEntity);
        });

        // and neither list should contain the entity itself:
        expectEntitiesToNotContain(actFollowing, entity);
        expectEntitiesToNotContain(actOthers, entity);

        return callback(null, actFollowing, actOthers);
    });
}


// Tests:

describe('Entity entities:', function () {

  it('Entity definition should not be null', function (next) {
    expect(Entity).to.not.equal(null);
    //expect(true).to.equal(true);
    return next();
  });

  
    // Single entity CRUD:

    it('List initial entities', function (next) {
      
      Entity.getAll(function (err, entities) {
            if (err) return next(err);
            expect(entities).to.be.an('array');
            entities.forEach(function (entity) {
                expectEntity(entity);
            });

            INITIAL_ENTITIES = entities;
            return next();
        });
    });

    it('Create entity A', function (next) {
        var name = 'Test Entity A';
        Entity.create({name: name}, function (err, entity) {

           if (err) return next(err);

            expectEntity(entity);
            expect(entity.id).to.be.a('number');
            expect(entity.name).to.be.equal(name);

            ENTITY_A = entity;
            return next();
        });
    });

    it('Fetch entity A', function (next) {
        Entity.get(ENTITY_A.id, function (err, entity) {
            if (err) return next(err);
            expectEntity(entity, ENTITY_A);
            return next();
        });
    });

    it('List entities again', function (next) {
        Entity.getAll(function (err, entities) {
            if (err) return next(err);

            // the order isn't part of the contract, so we just test that the
            // new array is one longer than the initial, and contains entity A.
            expect(entities).to.be.an('array');
            expect(entities).to.have.length(INITIAL_ENTITIES.length + 1);
            expectEntitiesToContain(entities, ENTITY_A);

            return next();
        });
    });

    it('Update entity A', function (next) {
        ENTITY_A.name += ' (edited)';
        ENTITY_A.save(function (err) {
            return next(err);
        });
    });

    it('Fetch entity A again', function (next) {
        Entity.get(ENTITY_A.id, function (err, entity) {
            if (err) return next(err);
            expectEntity(entity, ENTITY_A);
            return next();
        });
    });

    it('Delete entity A', function (next) {
        ENTITY_A.del(function (err) {
            return next(err);
        });
    });

    it('Attempt to fetch entity A again', function (next) {
        Entity.get(ENTITY_A.id, function (err, entity) {
            expect(entity).to.not.exist;  // i.e. null or undefined
            expect(err).to.be.an('object');
            expect(err).to.be.an.instanceOf(Error);
            return next();
        });
    });

    it('List entities again', function (next) {
        Entity.getAll(function (err, entities) {
            if (err) return next(err);

            // like before, we just test that this array is now back to the
            // initial length, and *doesn't* contain entity A.
            expect(entities).to.be.an('array');
            expect(entities).to.have.length(INITIAL_ENTITIES.length);
            expectEntitiesToNotContain(entities, ENTITY_A);

            return next();
        });
    });

    // Two-entity following:

    it('Create entities B and C', function (next) {
        var nameB = 'Test Entity B';
        var nameC = 'Test Entity C';

        function callback(err, entity) {
            if (err) return next(err);

            expectEntity(entity);

            switch (entity.name) {
                case nameB:
                    ENTITY_B = entity;
                    break;
                case nameC:
                    ENTITY_C = entity;
                    break;
                default:
                    // trigger an assertion error:
                    expect(entity.name).to.equal(nameB);
            }

            if (ENTITY_B && ENTITY_C) {
                return next();
            }
        }

        Entity.create({name: nameB}, callback);
        Entity.create({name: nameC}, callback);
    });

    it('Fetch entity B’s “following and others”', function (next) {
        expectEntityToFollow(ENTITY_B, [], [ENTITY_C], function (err, following, others) {
            if (err) return next(err);

            // our helper tests most things; we just test the length of others:
            expect(others).to.have.length(INITIAL_ENTITIES.length + 1);

            return next();
        });
    });

    it('Fetch entity C’s “following and others”', function (next) {
        expectEntityToFollow(ENTITY_C, [], [ENTITY_B], function (err, following, others) {
            if (err) return next(err);

            // our helper tests most things; we just test the length of others:
            expect(others).to.have.length(INITIAL_ENTITIES.length + 1);

            return next();
        });
    });

    it('Have entity B follow entity C', function (next) {
        ENTITY_B.follow(ENTITY_C, function (err) {
            return next(err);
        });
    });

    it('Have entity B follow entity C again', function (next) {
        ENTITY_B.follow(ENTITY_C, function (err) {
            return next(err);
        });
    });

    it('Fetch entity B’s “following and others”', function (next) {
        expectEntityToFollow(ENTITY_B, [ENTITY_C], [], next);
    });

    it('Fetch entity C’s “following and others”', function (next) {
        expectEntityToFollow(ENTITY_C, [], [ENTITY_B], next);
    });

    it('Have entity B unfollow entity C', function (next) {
        ENTITY_B.unfollow(ENTITY_C, function (err) {
            return next(err);
        });
    });

    // NOTE: skipping this actually causes the next two tests to fail!
    it('Have entity B unfollow entity C again', function (next) {
        ENTITY_B.unfollow(ENTITY_C, function (err) {
            return next(err);
        });
    });

    it('Fetch entity B’s “following and others”', function (next) {
        expectEntityToFollow(ENTITY_B, [], [ENTITY_C], next);
    });

    it('Fetch entity C’s “following and others”', function (next) {
        expectEntityToFollow(ENTITY_C, [], [ENTITY_B], next);
    });

    // Multi-entity-following deletions:

    it('Create entity D', function (next) {
        var name = 'Test Entity D';
        Entity.create({name: name}, function (err, entity) {
            if (err) return next(err);

            expectEntity(entity);
            expect(entity.name).to.be.equal(name);

            ENTITY_D = entity;
            return next();
        });
    });

    it('Have entity B follow entity C follow entity D', function (next) {
        var remaining = 2;

        function callback(err) {
            if (err) return next(err);
            if (--remaining === 0) {
                next();
            }
        }

        ENTITY_B.follow(ENTITY_C, callback);
        ENTITY_C.follow(ENTITY_D, callback);
    });

    it('Fetch all entity’s “following and others”', function (next) {
        var remaining = 3;

        function callback(err) {
            if (err) return next(err);
            if (--remaining === 0) {
                next();
            }
        }

        expectEntityToFollow(ENTITY_B, [ENTITY_C], [ENTITY_D], callback);
        expectEntityToFollow(ENTITY_C, [ENTITY_D], [ENTITY_B], callback);
        expectEntityToFollow(ENTITY_D, [], [ENTITY_B, ENTITY_C], callback);
    });

    it('Delete entity B', function (next) {
        ENTITY_B.del(function (err) {
            return next(err);
        });
    });

    it('Fetch entity C’s and D’s “following and others”', function (next) {
        var remaining = 2;

        function callback(err) {
            if (err) return next(err);
            if (--remaining === 0) {
                next();
            }
        }

        expectEntityToFollow(ENTITY_C, [ENTITY_D], [], callback);
        expectEntityToFollow(ENTITY_D, [], [ENTITY_C], callback);
    });

    it('Delete entity D', function (next) {
        ENTITY_D.del(function (err) {
            return next(err);
        });
    });

    it('Fetch entity C’s “following and others”', function (next) {
        expectEntityToFollow(ENTITY_C, [], [], next);
    });

    it('Delete entity C', function (next) {
        ENTITY_C.del(function (err) {
            return next(err);
        });
    });

});
