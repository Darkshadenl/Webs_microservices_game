const { Score, TargetScore} = require('../models/score');

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

    const achieved = score > 0.05 && score < 0.3

    return {
        username: username,
        scored: {
            base64: base64image,
            targetUsername: targetUsername,
            targetId: targetId,
            score: score,
            achieved: achieved
        }
    }
}

async function saveScore(scoreEntry){
    console.info('Saving score entry: ', {
        username: scoreEntry.username,
        image: scoreEntry.scored.base64.substring(0, 20),
        targetUsername: scoreEntry.scored.targetUsername,
        targetId: scoreEntry.scored.targetId,
        score: scoreEntry.scored.score
    })
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

/**
 * Retrieves all scores for a given username.
 * Username of a player, not a target uploader.
 * @param {string} username - The username for which the scores need to be retrieved
 * @returns {Array} An array of scored objects representing the scores of the user. Each scored object contains a target username and score.
 */
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

/**
 Retrieves scores for a given target username from the database, so not a player username
 @param {string} targetUsername - the target username to retrieve scores for
 @returns {Array} - An array of scores for the given target username, or null if no scores are found
 */
async function getScoresByTargetUsername(targetUsername) {
    const targetScore = await TargetScore.findOne({ targetUsername });

    if (!targetScore) {
        console.log(`No scores found for target username: ${targetUsername}`);
        return null;
    }

    return targetScore.scores;
}

/**
 * Retrieve a score entry object by target username and index
 * @param {string} targetUsername - The target username associated with the score entry to retrieve
 * @param {number} index - The index of the score entry to retrieve
 * @returns {Object|null} - Returns the score entry object at the specified index, or null if not found
 */
async function getScoresByTargetIndex(targetUsername, index) {
    const targetScore = await TargetScore.findOne({ targetUsername });

    if (!targetScore || !targetScore.scores || targetScore.scores.length === 0) {
        console.log(`No scores found for target username: ${targetUsername}`);
        return null;
    }

    if (index >= targetScore.scores.length) {
        console.log(`Index out of bounds for target username: ${targetUsername}`);
        return null;
    }

    return targetScore.scores[index];
}

/**
 * Retrieves scores for a given user-target pair
 * @param {string} username - The username of the user who is being scored
 * @param {string} targetUsername - The username of the user for whom the score was assigned
 * @param {string} targetId - The id of the target user
 * @returns {Array} An array of score objects
 */
async function getScoresByUserAndTarget(username, targetUsername, targetId) {
    const userScores = await Score.findOne({ username: username });

    if (!userScores || !userScores.scored || userScores.scored.length === 0) {
        console.log(`No scores found for username: ${username}`);
        return [];
    }

    return userScores.scored.filter(
        (score) => {
            console.log(score.targetId.toString() === targetId)

            return score.targetUsername === targetUsername && score.targetId.toString() === targetId
        }
    );
}



// De scores inzien van alle gebruikers van mijn target
// authentication




// Mijn targets verwijderen
// authentication



// Foto's van users op mijn target verwijderen
// authentication






module.exports = {
    buildScoreEntry,
    saveScore,
    getAllScores,
    getScoresByTargetUsername,
    getScoresByTargetIndex,
    getScoresByUserAndTarget
}
