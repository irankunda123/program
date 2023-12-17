const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const authHome = require("./routes/home");
const authUser = require("./routes/user");


const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({extended:false}));
app.set("view engine", "ejs");

mongoose.connect(process.env.MONGO_CONNECTION).then(result=>{
    app.listen(6688, ()=> console.log("server running on port 6688"));
    console.log("database connected");
}).catch(err=>{
    console.log(err);
})

app.use("/", authHome);
app.use("/user", authUser);