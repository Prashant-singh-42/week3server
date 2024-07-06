const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imageSchema = new Schema({
  image: {
    type: String,
    required: true
  },
  artist: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  likes: {
    type: Number,
    default: 0
  },
  lng: {
    type: Number,
    required: true,
  },
  lat: {
    type: Number,
    required: true,
  }
});

module.exports = Images = mongoose.model("Images", imageSchema);