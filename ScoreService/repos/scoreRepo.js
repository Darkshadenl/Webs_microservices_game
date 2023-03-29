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
    console.info('Saving score entry: ', scoreEntry)
    return new Promise(async (resolve, reject) => {
        try {
            const existingScore = await Score.findOne({ username: scoreEntry.username });

            // If the username exists, check for duplicate base64 strings
            if (existingScore) {
                const existingBase64 = existingScore.scored.find(
                    (score) => score.base64 === scoreEntry.scored.base64
                );

                // If the base64 string already exists, resolve with scoreEntry.scored
                if (existingBase64) {
                    resolve(existingScore);
                } else {
                    // If the base64 string doesn't exist, push the new score entry and save the document
                    existingScore.scored.push(scoreEntry.scored);
                    const updatedScore = await existingScore.save();
                    resolve(updatedScore);
                }
            } else {
                // If the username does not exist, create a new document
                const s = new Score({
                    username: scoreEntry.username,
                    scored: scoreEntry.scored,
                });

                const savedValue = await s.save();
                resolve(savedValue);
            }
        } catch (e) {
            console.trace('Saving failed');
            reject(e);
        }
    });
}

async function getAllScores(username) {
    try {
        // Find the Score document with the given username
        const userScores = await Score.findOne({ username: username });
        if (userScores) {
            return userScores.scored;
        } else {
            return [];
        }
    } catch (e) {
        console.trace('Error retrieving scores');
        throw e;
    }
}

module.exports = {
    buildScoreEntry,
    saveScore,
    getAllScores
}
