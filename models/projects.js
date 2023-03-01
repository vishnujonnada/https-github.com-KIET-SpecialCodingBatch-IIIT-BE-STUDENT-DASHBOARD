const mongoose = require('mongoose');

const project = new mongoose.Schema({
  userId: {
   type:String,
    required:true,
  },
  projectname: {
    type: String,
    required: true,
  },
  projectdesc:{
   type:String,
   required:true,
  },
  usedlang: {
    type: String,
    required: true,
  },
  teammem:{
    type:Array,
  }
});

const Project = mongoose.model('Project', project);

module.exports = Project;
