const mongoose = require("mongoose");
const attendanceSchema = new mongoose.Schema({
  userId: {
    type:String,
    required:true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  present: {
    type: Boolean,
    default: false,
  },
});

const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;
