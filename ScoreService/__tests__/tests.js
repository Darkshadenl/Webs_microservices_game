const { deletePictureOnTarget } = require('../repos/scoreRepo');
const Score = require('../models/Score');

describe('deletePictureOnTarget', () => {
    const scoreId = 'score-id';
    const targetUploader = 'target-uploader';

    it('should delete the picture successfully and return a status of 200', async () => {
        const findOneAndUpdateMock = jest.spyOn(Score, 'findOneAndUpdate').mockImplementation(() => ({ _id: 'score-id', title: 'New Score', scored: [{ _id: scoreId, base64: 'base64string' }] }));

        const result = await deletePictureOnTarget(scoreId, targetUploader);

        expect(findOneAndUpdateMock).toHaveBeenCalled();
        expect(result).toEqual({ status: 200, message: 'Deleted picture successfully.', updatedDocument: { _id: 'score-id', title: 'New Score', scored: [{ _id: scoreId }] } });

        findOneAndUpdateMock.mockRestore();
    });

    it('should return a status of 404 if no matching target is found', async () => {
        const findOneAndUpdateMock = jest.spyOn(Score, 'findOneAndUpdate').mockImplementation(() => null);

        const result = await deletePictureOnTarget(scoreId, targetUploader);

        expect(findOneAndUpdateMock).toHaveBeenCalled();
        expect(result).toEqual({ status: 404, message: 'No matching target found for the given targetId and uploaderUsername.' });

        findOneAndUpdateMock.mockRestore();
    });

    it('should throw an error if something goes wrong while deleting the picture', async () => {
        const findOneAndUpdateMock = jest.spyOn(Score, 'findOneAndUpdate').mockImplementation(() => {
            throw new Error('Something went wrong while deleting the picture.');
        });

        await expect(deletePictureOnTarget(scoreId, targetUploader)).rejects.toThrow('Something went wrong while deleting the picture.');

        findOneAndUpdateMock.mockRestore();
    });
});
