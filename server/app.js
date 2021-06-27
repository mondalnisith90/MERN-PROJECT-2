require('dotenv').config();
const PORT = process.env.PORT;
const express = require("express");
require("./Database/dbconnection/dbcon");
const cookieParser = require("cookie-parser");



const app = express();
app.use(cookieParser());
app.use(express.json());
//we use router middleware
app.use(require("./Routers/router"));


app.listen(PORT, () => {
    console.log("Server is running at port no "+PORT)
})