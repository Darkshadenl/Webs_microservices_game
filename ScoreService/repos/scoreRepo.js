const Score = require('../models/score');

/**
    *
    *  Builds a score entry object
    *  @param {string} base64image - The base64 encoded image
    *  @param {Object} targetJSON - An object containing the username, targetUsername, and targetId
    *  @param {number} score - The score to be assigned
    *  @returns {Object} An object containing the username and scored object
    */
function buildScoreEntry(base64image, targetJSON, score) {
    const {username, targetUsername, targetId} = targetJSON;

    if (base64image === undefined || targetUsername === undefined || targetId === undefined)
        throw new Error('Missing parameters');

    return {
        username: username,
        scored: {
            base64: base64image,
            targetUsername: targetUsername,
            targetId: targetId,
            score: score
        }
    }
    }

async function saveScore(scoreEntry){
    const s = new Score({
        username: scoreEntry.username,
        scored: scoreEntry.scored
    });
    return new Promise((resolve, reject) => {
        s.save()
            .then(savedValue => {
                if (savedValue) {
                    resolve(savedValue)
                }
            })
            .catch(e => {
                console.trace('Saving failed')
                reject(e);
            })
    })
}

module.exports = {
    buildScoreEntry,
    saveScore
}
