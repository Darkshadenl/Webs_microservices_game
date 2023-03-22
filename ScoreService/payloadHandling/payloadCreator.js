async function validateAction(action) {
    return new Promise((resolve, reject) => {
        if (action === undefined || typeof action !== 'string') {
            reject(new Error("Action was not defined or is not a string"));
        }
        if (action !== 'create' && action !== 'delete' && action !== 'get') {
            reject(new Error("Action is not valid"));
        }
        resolve(true);
    });
}

async function validateId(id) {
    return new Promise((resolve, reject) => {
        if (id === undefined || typeof id !== 'string') {
            reject(new Error("Id was not defined or is not a string"));
        }
        resolve(true);
    });
}

async function validateFieldName(fieldName) {
    return new Promise((resolve, reject) => {
        if (fieldName === undefined || typeof fieldName !== 'string') {
            reject(new Error("Table name was not defined or is not a string"));
        }
        resolve(true);
    });
}

async function validateDataValue(dataValue) {
    return new Promise((resolve, reject) => {
        if (dataValue === undefined || typeof dataValue !== 'object') {
            reject(new Error("Data value was not defined or is not an object"));
        }
        resolve(true);
    });
}

/**
 *
 *  Creates a payload object with the given parameters
 *  @async
 *  @param {string} action - The action to be performed
 *  @param {string, number} id - The id of the object
 *  @param {string} tablename - The name of the table
 *  @param {string|object} dataValue - The value of the data
 *  @returns {Object} - The payload object
 */
async function createPayload(action, tablename, dataValue = "") {
    return await Promise.all([
        validateAction(action),
        // validateId(id),
        validateFieldName(tablename),
        validateDataValue(dataValue)])
        .then(() => {
            return {
                "fromService": "target",
                "action": action,
                "body": {
                    "tablename": tablename,
                    "dataValue": dataValue
                }};
        }).catch((e) => {
            console.log("Validation failed: ", e);
            return null;
        });
}

module.exports = createPayload;
