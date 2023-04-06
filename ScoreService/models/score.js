const Mongoose = require('mongoose');

let scoreSchema = new Mongoose.Schema({
    username: {type: 'string', required: true, unique: true},
    scored: [
        {
            base64: {type: 'string'},
            targetUsername: {type: 'string'},
            targetId: {type: Mongoose.Schema.Types.ObjectId},
            score: {type: 'string'},
            achieved: {type: 'boolean'},
        }
    ],
}, {timestamps: true});

let targetScoreSchema = new Mongoose.Schema({
    targetUsername: {type: 'string', required: true, unique: true},
    scores: [
        {
            username: {type: 'string'},
            score: {type: 'string'},
            achieved: {type: 'boolean'},
        }
    ],
}, {timestamps: true});

scoreSchema.pre('save', async function (next) {
    const targetScores = this.scored.map(score => ({
        targetUsername: score.targetUsername,
        username: this.username,
        score: score.score,
        achieved: score.achieved
    }));

    await Promise.all(
        targetScores.map(async (targetScore) => {
            const target = await TargetScore.findOneAndUpdate(
                { targetUsername: targetScore.targetUsername },
                { $push: { scores: targetScore } },
                { upsert: true, new: true }
            );
        })
    );

    next();
});

const Score = Mongoose.model('Score', scoreSchema);
const TargetScore = Mongoose.model('TargetScore', targetScoreSchema);

module.exports = {
    Score,
    TargetScore
};
