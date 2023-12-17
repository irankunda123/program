const express = require("express");
const router = express.Router();
//const authController = require("../controllers/authController");
const Admin = require("../models/user");
const Event = require("../models/event");
const multer = require("multer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const maxAge = 2*24*60*60;
const createToken = (id)=>{
    return jwt.sign({ id }, process.env.JWT_SECRET)
}

router.get("/adminReg", (req,res)=>{
    res.render("adminReg");
});


router.post("/adminReg", async (req,res)=>{
    try {
        const { name, email, password } = req.body
        const user = new Admin({
            name,
            email,
            password,
        })
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(user.password, salt);
        user.password = hashedPassword;
        const newUser = await user.save();
        console.log(newUser);
        
        res.redirect("/user/adminlog");
    } catch (error) {
        console.log(error);
    }
})

router.get("/adminlog", (req,res)=>{
    res.render("adminlog");
});

router.post("/adminlog", async (req,res)=>{
    try {
        const { email, password } = req.body;
        const user = await Admin.findOne({ email: email });
        if(user){
            const match = await bcrypt.compare(password, user.password);
            if(match){
                const token = createToken(user._id)
                res.cookie("userLoggedin", token);
                res.redirect("/user/addEvent");
            }
            else{
                throw Error("incorrect password");
            }
        }
        else{
            throw Error("incorrect user");
        }
    } catch (error) {
        console.log(error);
    }
})

router.get("/addEvent", (req,res)=>{
    res.render("addEvent");
})

const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req,file,cb)=>{
        cb(null, file.originalname);
    },
});

const upload = multer({
    storage: storage
}).single("fileevent")


router.post("/addEvent", (req,res)=>{
        upload(req,res, (err)=>{
            if(err){
                console.log(err);
            }
            else{
                const newImage = new Event({
                    eventName: req.body.eventname,
                    description: req.body.description,
                    image: {
                        data: req.file.filename,
                        content_Type: 'image/png'
                    },
                    picture: req.file.originalname
                });
                newImage.save().then(()=> res.redirect("/user/images")).catch(err=> console.log(err));
            }
        })
})

router.get("/images", async (req,res)=>{
    const images = await Event.find().sort({_id: -1});
    res.render("images", {images:images})
})

module.exports = router;