const mongoose = require("mongoose");

const dbUrl = `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_PASSWORD}@cluster0.bwsqv.mongodb.net/mernstackdb?retryWrites=true&w=majority`;

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(() => {
    console.log("DB connection is successfull");
}).catch((error) => {
    console.log("db connection faild : "+error.message);
});


module.exports = mongoose;
