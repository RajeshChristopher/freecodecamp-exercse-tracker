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
  var idParam = req.params;
  //console.log(idParam);
  //var c = []

  user.find({idParam},function(err,data){
    //console.log(data);
    if(err || !data){
      res.send("Error")
    }else{
      exercise.find({idParam},function(err,exerdata){
    //console.log(exerdata);
    if(err || ! exerdata){
      res.send("Log data error");
    }else{
      console.log(exerdata);
      for(var i=exerdata.length -1 ; i>=0; i--){
          //console.log(exerdata[exerdata.length-1])
        if(exerdata[i].description == undefined || exerdata[i].duration == undefined || exerdata[i].date == undefined){
          return(res.send("Duaration, date error"));
        }else{
          var r = exerdata[i].description;
        //console.log(r);
        var s = exerdata[i].duration;
        //console.log(s);
        var t = exerdata[i].date.toDateString();
        console.log(t);
        return(res.json({
        username: data.username,
        count: exerdata.length,
        _id: req.params._id,
        log: [{
          description: r,
          duration: s,
          date: t
        }]
      })
        )
        }
        
        
      }
      
    }
  })
    }
  })
  
  
})




const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
