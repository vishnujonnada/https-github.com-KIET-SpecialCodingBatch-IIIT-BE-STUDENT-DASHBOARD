const mongoose = require('mongoose');

const marksSchema = new mongoose.Schema({
  userId: {
   type:String,
    required:true,
  },
  semister: {
    type: String,
    required: true
  },
  marks: {
    type: String,
    required: true
  }
});

const Marks = mongoose.model('Marks', marksSchema);

module.exports = Marks;
