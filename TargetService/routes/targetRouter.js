const {deleteTarget, saveUser, findTargetByUsername, saveUserTarget, findTargetById, getAllTargets} = require('../repos/targetRepo')

const express = require('express');
const router = express.Router();

const createError = require("http-errors");
const paginate = require("../middleware/pagination");
const removeFields = require("../tools/object_cleaner");


// Het moet mogelijk zijn om jouw targets te verwijderen
// Authentication



/**
 * Add a target
 */
router.post('/',
    async (req,
           res,
           next) => {
        const data = req.body;
        const {location, base64} = data;
        const username = req.user.username;

        if (!username || !location || !base64) {
            return next(createError(400, 'Missing parameters'))
        }

        const user = await findTargetByUsername(username);
        let response = ""
        let savedValue;

        try {
            if (user !== null && user !== undefined) {
                savedValue = await saveUserTarget(user, {location, base64})
                response = "User already existed, target is saved to user."
            } else {
                // User does not exist, create user and save target to user
                await saveUser(username)
                    .then((user) => {
                        saveUserTarget(user, {location, base64}).then((s) => {
                            savedValue = s;
                        })
                    })
                response = "User did not exist, user was created and target is saved to user."
            }
            console.log(savedValue)

            res.status(200).json({
                response: `Target created. ${response}..`,
                data: {
                    targetUsername: username,
                    targetId: savedValue.targets[0]._id,
                }
        });
        } catch (e) {
            next(createError(400, `Something went wrong.`))
            console.trace(`Something went wrong ${e}`)
        }
    })

/**
 * Get all targets by all users
 * Een overzicht van targets kunnen ophalen op bijv. plaatsnaam etc.;
 */
router.get('/all', paginate, async (req, res, next) => {
    const {startIndex, endIndex} = res.pagination;
    let paginatedData;

    const locationFilter = req.query.location;
    const filter = locationFilter ? { 'targets.location': locationFilter } : {};

    await getAllTargets(filter).then(t => {
        if (!t)
            return next(createError(404, `User not found.`))

        let data = []
        for (const target of t) {
            const plainObject = target.toObject();
            removeFields(plainObject, ['_id', '__v', 'createdAt', 'updatedAt'])

            if (locationFilter) {
                plainObject.targets = plainObject.targets.filter(subTarget => subTarget.location === locationFilter);
            }

            data.push(plainObject)
        }
        paginatedData = data.slice(startIndex, endIndex);
        res.json({
            pagination: {
                totalItems: t.length,
                currentPage: req.query.page || 1,
                totalPages: Math.ceil(t.length / res.pagination.limit),
            },
            data: paginatedData
        });
    }).catch(e => {
        console.error(e)
        next(createError(400, `Something went wrong.`))
    })
})

/**
 * Get a single target by username.
 * Can use query filters to filter on index or on id. If id is provided, index is ignored.
 */
router.get('/byUsername/:username',
    async (req,
           res, next) => {
        let index, id, username;
        try {
            index = req.query.index;
            id = req.query.id;
            username = req.params.username.charAt(0).toUpperCase() + req.params.username.slice(1);
        } catch (e) {
            console.log(e)
        }

        if (!username || typeof username !== 'string') {
            next(new Error('Incorrect format'));
        }

        await findTargetByUsername(username).then(t => {
            if (!t)
                return next(createError(404, `User not found.`))
            if (index) {
                res.json(t.targets[index])
            } else if (id) {
                res.json(t.targets.id(id))
            } else {
                res.json({
                    data: t
                });
            }
        }).catch(e => {
            console.log(e)
            next(createError(400, `Something went wrong.`))
        })
})

/**
 * Get a full target. This means a full target container, not just a single target.
 * So this will return user details and all targets.
 */
router.get('/:id',
    async (req, res, next) => {
        const id = req.params.id;

        if (!id) {
            next(new Error('Incorrect format. _id is missing.'));
        }

        await findTargetById(id).then(t => {
            res.json(t)
        } ).catch(e => {
            console.error(`Something went wrong ${e}`)
            next(createError(400, `Something went wrong.`))
        })
 })


/**
 * Delete target by id.
 * This means a full target container, not just a single target.
 */
router.delete('/:id', async (req,
                                    res,
                                    next) => {
    const id = req.params.id;
    const username = req.user.username;

    if (!id) {
        next(new Error('Incorrect format.'));
    }

    await deleteTarget(id, username).then((m) => {
        if (m.code === 0) {
            res.send(m.message);
        }
        res.send(`${m.message}: ${id}`);
    }).catch(err => {
        console.trace(`Deleting target ${id} failed: ${err}`);
    });
})

router.get('/', async (req, res) => {
    res.render('index', {title: 'target'})
})

module.exports = router;
