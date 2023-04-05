function removeFields(obj, fields) {
    for (const key of fields) {
        if (obj.hasOwnProperty(key)) {
            console.log(`Deleting ${key} from object`)
            delete obj[key];
        } else {
            console.log(`Key ${key} does not exist in object`)
        }
    }
    return obj;
}

module.exports = removeFields;
