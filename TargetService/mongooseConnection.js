const mongoose = require('mongoose');

const url = process.env.MONGO_URL;


// Connect to mongoose. Catch any errors. If it fails, wait 5 seconds and try again. Keep trying until successful.
function connect() {
    mongoose.connect(url)
        .then(() => {
            console.log('Connected to MongoDB');
        })
        .catch((err) => {
            console.log('Error connecting to MongoDB: ' + err);
            console.log(`Url: ${url}`);
            setTimeout(connect, 2000);
        });
}

connect();
