/**
    *
    *  Converts a binary string to a base64 string
    *  @param {string} image - The binary string to convert
    *  @returns {string} - The base64 string
    */
    function binaryToBase64(image) {
    const binaryData = Buffer.from(image, 'utf8');
    return binaryData.toString('base64');
    }

module.exports = {
    binaryToBase64
}
