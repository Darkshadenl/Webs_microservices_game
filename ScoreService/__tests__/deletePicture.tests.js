const { Score} = require('../models/score');
const { deletePictureOnTarget } = require('../repos/scoreRepo');

jest.mock('../models/score', () => {
    return {
        Score: {
            findOneAndUpdate: jest.fn(),
        },
    };
});

describe('deletePictureOnTarget', () => {
    test('successfully deletes a picture', async () => {
        const scoreId = 'someScoreId';
        const targetUploader = 'someUploader';
        const expectedResult = {
            status: 200,
            message: 'Deleted picture successfully.',
            updatedDocument: {} // Mock the expected result here
        };

        Score.findOneAndUpdate.mockResolvedValue(expectedResult.updatedDocument);

        const result = await deletePictureOnTarget(scoreId, targetUploader);

        expect(result).toEqual(expectedResult);
        expect(Score.findOneAndUpdate).toHaveBeenCalledWith(
            { 'scored._id': scoreId },
            { $unset: { 'scored.$.base64': "" } },
            { useFindAndModify: false, new: true }
        );
    });

    test('returns a 404 when no matching target is found', async () => {
        const scoreId = 'someNonexistentScoreId';
        const targetUploader = 'someUploader';

        Score.findOneAndUpdate.mockResolvedValue(null);

        const result = await deletePictureOnTarget(scoreId, targetUploader);

        expect(result).toEqual({
            status: 404,
            message: 'No matching target found for the given targetId and uploaderUsername.'
        });
    });
});
