const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended:false}));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


const mongourl = process.env.DB_URL
mongoose.connect(mongourl,{useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({username: String});
const user = mongoose.model("user",userSchema);

const exerciseSchema = new mongoose.Schema({
  userId: {type: String, required: true},
  description: String,
  duration: Number,
  date: Date
});

const exercise = mongoose.model("exercise",exerciseSchema);


app.post("/api/users",function(req,res){
 // res.json({username: req.body.username});
  //var bodyName = req.body.username;
  //console.log(bodyName)
  var a = req.body.username;
  console.log(a);
  const newUser = new user({username: a});
  console.log(newUser);
  newUser.save(function(err,data){
    console.log(data);
    if(err || !data){
      res.send("Error");
    }else{
      res.json({
        username: data.username,
        _id: data.id
      });
    }
  })
});

app.get("/api/users",function(req,res){
  user.find({},function(err,data){
    console.log(data);
    if(err || !data){
      res.send("no data");
    }else{
      res.json(data);
    }
  })
})

app.post("/api/users/:_id/exercises",function(req,res){
  //console.log(req.params);
  //console.log(req.body);

  const id = req.params._id;
  //const {description, duration,date} = req.body;
  const description = req.body.description;
  const duration = req.body.duration;
  const date = req.body.date;
  console.log(id);
  console.log(description +", "+duration +", "+date);
  user.findById(id,function(err,userData){
    if(err || !userData){
      res.send("There was a error");
    }else{
      const exerciseData = new exercise({
        userId: id,
        description: description,
        duration: duration,
        date: new Date(date)
      })
      exerciseData.save(function(err,data){
        if(err || !data){
          res.send("Data error");
        }else{
          res.json({
            username: userData.username,
            description: data.description,
            duration: data.duration,
            date: data.date.toDateString(),
            _id: userData.id
          })
        }
      })
    }
  })
})

app.get("/api/users/:_id/logs",function(req,res){
  var idParam = req.params._id;
  var b = []
  var c = []
  console.log(idParam);
  user.findById(idParam,function(err,data){
    if(err || !data){
      res.send("Log error")
    }else{
      b.push(data.username)
    }
    console.log(b);
  })

  exercise.findById(idParam,function(err,data){
    console.log(data);
    if(err || ! data){
      res.send("Log data error");
    }else{
      c.push(data.description);
      c.push(data.duration);
      c.push(data.date);
    }
    console.log(c)
  })
  
})




const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
