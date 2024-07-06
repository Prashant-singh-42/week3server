const { Router } = require("express");
const router = Router();
const verifyJWT = require("../middleware/auth.middleware.js");
const imageController = require("../controllers/image.controller.js");

const { upload } = require("../middleware/imageUpload.middleware.js")

// router.post("/login", authController.login);
// router.post('/register', authController.register);
// router.get('/logout', verifyJWT, authController.logout);

router.post('/addImage', upload.single("image"), imageController.addImage)
router.get('/getAllImages', imageController.getAllImages)
router.get('/getImage/:id', imageController.getImage)
router.get('/like/:id', imageController.like)

module.exports = router;