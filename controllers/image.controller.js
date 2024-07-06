const Image = require("../models/images.model");
const User = require("../models/user.model.js");
const jwt = require("jsonwebtoken");

const { uploadOnCloudinary } = require("../utils/cloudinary.js");

const addImage = async (req, res) => {
    try {
        const token = req.cookies?.accessToken;
        if (!token) {
            return res.status(401).json("token not found");
        }

        if (!req.file) {
            return res.status(401).json("file not found");
        }

        const upload = await uploadOnCloudinary(req.file.path);


        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded?._id);
        if (!user) return res.status(404).json("user not found");

        console.log(req.body)

        const imageD = await Image.create({
            image: upload.url,
            artist: user.fullName,
            desc: req.body.desc,
            location: req.body.location,
            lat: req.body.lat,
            lng: req.body.lng,
        });
        if (!user.pictures) {
            user.pictures = [];
        }
        user.pictures.push(imageD._id);
        await user.save();

        res.status(200).json(imageD);
    } catch (error) {
        console.log(error);
        return res.status(401).json("error uploading image");
    }
};

const getAllImages = async (req, res) => {
    try {
        const images = await Image.find({})    
        res.status(200).json(images)
    } catch (error) {
        console.error(error)
        res.status(200).json("error fetching images")
    }
}

const getImage = async (req, res) => {
    try {
        const id = req.params.id
        const image = await Image.findById(id)
        res.status(200).json(image)
    } catch (error) {
        console.error(error)
        res.status(200).json("error fetching image")
    }
}

const like = async (req, res) => {
    try {
        const id = req.params.id
        const image = await Image.findById(id)
        image.likes += 1
        image.save()
        res.status(200).json(image)
    } catch (error) {
        console.error(error)
        res.status(200).json("error fetching image")
    }
}


module.exports = { addImage, getImage, getAllImages, like };
