const express = require("express");
const mongoose = require("mongoose");
const user=require('./models/user');
const middleware=require('./Auth/middleware')
const jwt = require('jsonwebtoken');
const Announcements=require('./models/announcements');
const Attendance=require('./models/attendance');
const Marks=require('./models/marks');
const Project=require('./models/projects')

const app = express();

app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/StudentDashBoard", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connected"));

  //student Dashboard options

app.get("/", (req, res) => {
  res.send("<h1>Student Dashboard</h1>");
});


app.post('/register',async(req,res)=>{
    try{

        const {fullname,email,mobile,rollno,password,confirmpassword}=req.body;
        const exist = await user.findOne({email});
        if(exist){
            return res.status(400).send("user already Registetred");
        }
        if(password!=confirmpassword){
            return res.status(403).send("Password Not Matched");
        }
        let newUser=new user({
            fullname,email,mobile,rollno,password,confirmpassword
        })
        newUser.save();
        return res.status(200).send('User Registered Succesfully')

    }catch(err){
        console.log(err);
        return res.status(500).send("Server Error");
    }
})



app.post('/login',async (req, res) => {
    try{
        const {email,password} = req.body;
        let exist = await user.findOne({email});
        if(!exist) {
            return res.status(400).send('User Not Found');
        }
        if(exist.password !== password) {
            return res.status(400).send('Invalid credentials');
        }
        let payload = {
            user:{
                id : exist.id
            }
        }
        jwt.sign(payload,'jwtSecret',{expiresIn:3600000},
          (err,token) =>{
              if (err) throw err;
              return res.json({token})
          }  
            )

    }
    catch(err){
        console.log(err);
        return res.status(500).send('Server Error')
    }
})

app.get('/profile',middleware,async(req,res)=>{
    try{
        let User=await user.findOne({_id:req.user.id});
        return res.json(User)
    }
    catch(err){
        console.log(err);
        return res.status(500).send('server error')
    }
})

app.put('/profile-edit',middleware,async(req,res)=>{
    try{
        let User = await user.findOneAndUpdate({_id:req.user.id},req.body,{new:true});
        res.send(User)

    }catch(error){
        res.status(500).send(err);
    }
})



//announce ments route
app.get('/announcements',middleware,async(req,res)=>{
    try{
        let msg=await Announcements.find().sort({ date: -1 });
        return res.json(msg)
    }
    catch(err){
        console.log(err);
        return res.status(500).send('server error')
    }
    
})


app.get('/attendance',middleware, async (req, res) => {
    try {
      const attendance = await Attendance.find({ userId:req.user.id });
      res.send(attendance);
    } catch (err) {
      res.status(500).send(err);
    }
  });


  app.get('/marks',middleware,async(req,res)=>{
    try {
      const mark = await Marks.find({ userId:req.user.id });
      res.send(mark);
    } catch (err) {
      res.status(500).send(err);
    }
  })

  app.get('/projects',middleware, async (req, res) => {
    try {
      const project = await Project.find({ userId: req.user.id });
      res.send(project);
    } catch (err) {
      res.status(500).send(err);
    }
  });

  app.get('/teaminfo',middleware,async(req,res)=>{
    try{
        const teamm=await user.findOne({_id:req.user.id})
        const t=teamm.team
        const c=teamm.category
        const teammem=await user.find({team:t,category:c},{"fullname":1 ,"_id":0})

      res.json(teammem)
    }catch(err){
      console.log(err)
    }
  })


//coordinator dashboard options for data adding purpose
app.post('/addproject',middleware,async(req,res)=>{
    try {
      const teamm=await user.findOne({_id:req.user.id})
      const t=teamm.team
      const c=teamm.category
      console.log(t)
      const teammem=await user.find({team:t,category:c},{"fullname":1 ,"_id":0})
      console.log(teammem)
      const { projectname,projectdesc,usedlang } = req.body;
      const project = new Project({ userId:req.user.id, projectname,projectdesc,usedlang, teammem });
      await project.save();
      res.status(200).json({ message: 'project added successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  })

app.post('/add-announcements',middleware,async(req,res)=>{
    try{
       const {msg}=req.body;

       let Announcement=new Announcements({
        msg
    })
    Announcement.save();
    return res.status(200).send('Announcement added Succesfully')
    }
    catch(err){
        console.log(err);
        return res.status(500).send('server error')
    }
    
})


app.post('/add-attendance',middleware, async (req, res) => {
    const attendance = new Attendance({
      userId: req.user.id,
      present: req.body.present
    });
    try {
      await attendance.save();
      res.send(attendance);
    } catch (err) {
      res.status(500).send(err);
    }
  });


  app.post('/add-semister-marks',middleware, async (req, res) => {
    try {
      const { semister, marks } = req.body;
      const semisterMarks = new Marks({ userId:req.user.id, semister, marks });
      await semisterMarks.save();
      res.status(200).json({ message: 'Semister marks added successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


app.listen(3000, () => {
  console.log("server is running at port http://localhost:3000");
});
