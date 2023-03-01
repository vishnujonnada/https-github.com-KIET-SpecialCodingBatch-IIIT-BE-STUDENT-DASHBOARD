const mongoose = require('mongoose')

const Announcements= new mongoose.Schema({
    msg:{
        type:String,
        required:true,
    },
    date:{
        type:Date,
       default:Date
    }
});
module.exports = mongoose.model("Announcements", Announcements);