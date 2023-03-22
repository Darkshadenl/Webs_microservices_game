async function validateAction(action) {
    return new Promise((resolve, reject) => {
        if (action === undefined || typeof action !== 'string') {
            reject(new Error("Action was not defined or is not a string"));
        }
        resolve();
    });
}

async function validateId(id) {
    return new Promise((resolve, reject) => {
        if (id === undefined || typeof id !== 'string') {
            reject(new Error("Id was not defined or is not a string"));
        }
        resolve();
    });
}

async function validateFieldName(fieldName) {
    return new Promise((resolve, reject) => {
        if (fieldName === undefined || typeof fieldName !== 'string') {
            reject(new Error("Field name was not defined or is not a string"));
        }
        resolve();
    });
}

async function validateDataValue(dataValue) {
    return new Promise((resolve, reject) => {
        if (dataValue === undefined || typeof dataValue !== 'string') {
            reject(new Error("Data value was not defined or is not a string"));
        }
        resolve();
    });
}

/**
    *
    *  Creates a payload object with the given parameters
    *  @async
    *  @param {string} action - The action to be performed
    *  @param {string, number} id - The id of the object
    *  @param {string} fieldName - The name of the field
    *  @param {string} dataValue - The value of the data
    *  @returns {Object} - The payload object
    */
async function createPayload(action, id, fieldName, dataValue = "") {
    await Promise.all([
        validateAction(action),
        validateId(id),
        validateFieldName(fieldName),
        validateDataValue(dataValue)])
        .then(() => {
            console.log("All validations passed");

            return {
                "fromService": "target",
                "action": action,
                "body": {
                    "id": id,
                    "tableName": fieldName,
                    "dataValue": dataValue
                }};
        }).catch((e) => {
            console.log("Validation failed: ", e);
            return null;
        });
    }

module.exports = createPayload;
