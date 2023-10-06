const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/views/index.html');
});

const mongourl = process.env.DB_URL;
mongoose.connect(
	mongourl,
	{ useNewUrlParser: true, useUnifiedTopology: true }
);

const userSchema = new mongoose.Schema({ username: String });
const user = mongoose.model('user', userSchema);

const exerciseSchema = new mongoose.Schema({
	userId: { type: String, required: true },
	description: String,
	duration: Number,
	date: Date
});

const exercise = mongoose.model('exercise', exerciseSchema);

app.post('/api/users', function(req, res) {
	// res.json({username: req.body.username});
	var bodyName = req.body.username;
	//console.log(bodyName)
	var a = req.body.username;
	//console.log(a);
	const newUser = new user({ username: a });
	//console.log(newUser);
	newUser.save(function(err, data) {
		//console.log(data);
		if (err || !data) {
			res.send('Error');
		} else {
			res.json({
				username: data.username,
				_id: data.id
			});
		}
	});
});

app.get('/api/users', function(req, res) {
	user.find({}, function(err, data) {
		//console.log(data);
		if (err || !data) {
			res.send('no data');
		} else {
			res.json(data);
		}
	});
});

app.post('/api/users/:_id/exercises', function(req, res) {
	//console.log(req.params);
	//console.log(req.body);

	const id = req.params._id;
	//const {description, duration,date} = req.body;
	const description = req.body.description;
	const duration = req.body.duration;
	const date = req.body.date;
	//console.log(id);
	//console.log(description +", "+duration +", "+date);
	user.findById(id, function(err, userData) {
		if (err || !userData) {
			res.send('There was a error');
		} else {
			const exerciseData = new exercise({
				userId: id,
				description: description,
				duration: duration,
				date: date ? new Date(date) : new Date()
			});
			exerciseData.save(function(err, data) {
				if (err || !data) {
					res.send('Data error');
				} else {
					res.json({
						username: userData.username,
						description: data.description,
						duration: data.duration,
						date: data.date.toDateString(),
						_id: userData.id
					});
				}
			});
		}
	});
});

app.get('/api/users/:_id/exercises', function(req, res) {
	exercise.find({}, function(err, data) {
		//console.log(data);
		if (err || !data) {
			res.send('no data');
		} else {
			res.json(data);
		}
	});
});

/*
app.get('/api/users/:_id/logs', function(req, res) {
	var idParam = req.params;
  let {from,to,limit} = req.query;

  //const exercises = await user.find(filter).limit(+limit ?? 500)
	//console.log(idParam);
	//var c = []

	user.find({ idParam }, function(err, data) {
		//console.log(data);
		if (err || !data) {
			res.send('Error');
		} else {
      const limitValue = typeof limit ==="number" ? limit : 500;
			exercise.find({ idParam }, function(err, exerdata) {
				//console.log(exerdata);
				if (err || !exerdata) {
					res.send('Log data error');
				} else {
					//console.log(exerdata);
          //var lim = exerdata.length - 1;
          if(limit){
            lim = limit
          }
					for (var i=exerdata.length - 1; i >= 0; i--) {
						//console.log(exerdata[exerdata.length-1])
						if (
							exerdata[i].description == undefined ||
							exerdata[i].duration == undefined ||
							exerdata[i].date == undefined
						) {
							return res.send('Duaration, date error');
						} else {
							var r = exerdata[i].description;
							//console.log(r);
							var s = exerdata[i].duration;
							//console.log('Before', exerdata[i].date);
							var t = exerdata[i].date.toDateString();

              var logging = [
									{
										description: r,
										duration: s,
										date: t
									}
								]
							//console.log(req.params._id);
							//console.log('after', t)
							return res.json({
								username: data.username,
								count: exerdata.length,
								_id: req.params._id,
								log: logging
							});
						}
					}
				}
			});
		}
	});
});
*/

let temp;
/*
app.get('/api/users/:_id/logs', function(req, res) {
	var idParam = req.params;
  let idvalue = req.params.id;
  let {from,to,limit} = req.query;
  limit = limit ? parseInt(limit) : null;
  const filter = {idvalue};

  if(from){
    filter.date = {$gte:new Date(from)}
  }

  if(to){
    if(!filter.date){
      filter.date = {}
    }
    filter.date.$lte = new Date(to);
  }

  //const exercises = await user.find(filter).limit(+limit ?? 500)
	//console.log(idParam);
	//var c = []
	user.find({ idParam }, function(err, data) {
		//console.log(data);
		if (err || !data) {
			res.send('Error');
		} else {
      temp = data[0].username
      //console.log(data.username);
      //const limitValue = typeof limit ==="number" ? limit : 500;
			exercise.find(filter, function(err, exerdata) {
				//console.log(exerdata);
				if (err || !exerdata) {
					res.send('Log data error');
				} else {
					//console.log(exerdata);
          //var lim = exerdata.length - 1; 
          const logs = []
					for (var i=exerdata.length - 1; i >= 0 && (limit == null || logs.length<limit); i--) {
						//console.log(exerdata[exerdata.length-1])
						if (
							exerdata[i].description == undefined ||
							exerdata[i].duration == undefined ||
							exerdata[i].date == undefined
						) {
							return res.send('Duaration, date error');
						} else {
							var r = exerdata[i].description;
							//console.log(r);
							var s = exerdata[i].duration;
							//console.log('Before', exerdata[i].date);
							var t = exerdata[i].date.toDateString();

              logs.push({
                description: r,
                duration: s,
                date: t
              });
              //console.log(data.username);
							//console.log(req.params._id);
							//console.log('after', t)
            /*
              return res.json({
								username: temp,
								count: exerdata.length,
								_id: req.params._id,
								log: logs
							});
       */
/*
						}
					}
*/
          /*
          var out = [];
          for(var j=0;j<logs.length;j++){
            out.push({
								username: temp,
								count: exerdata.length,
								_id: req.params._id,
								log: logs[j]
						})
          }
          const objout = Object.assign({},...out);
          //console.log(objout)
          return objout;
          */

          //console.log(exerdata.username);
          //console.log(temp);
          //console.log(logs.length);
          //return res.json({
						//		username: temp,
							//	count: exerdata.length,
								//_id: req.params._id,
								//log: logs
						//});
       
          //return outres
/*
				}
			});
		}
	});
});
*/
/*
app.get('/api/users/:_id/logs', async (req, res) => {
	let { from, to, limit } = req.query;
  limit = limit ? parseInt(limit) : 500;
	const id = req.params._id;
	const users = await user.findById(id);
	if (!users) {
		res.send('Could not find user');
		return;
	}
	let dateObj = {};
	if (from) {
		dateObj['$gte'] = new Date(from);
	}
	if (to) {
		dateObj['$lte'] = new Date(to);
	}
	let filter = {
		user_id: id
	};
	if (from || to) {
		filter.date = dateObj;
	}

  //const limitValue = typeof limit ==="number" ? limit : null;
	const exercises = await exercise.find(filter).limit(limit);

	const log = exercises.map(e => ({
		description: e.description,
		duration: e.duration,
		date: e.date.toDateString()
	}));

  //console.log(typeof log);
	res.json({
		username: users.username,
		count: exercises.length,
		_id: users._id,
		log
	});

  
});
*/

app.get('/api/users/:_id/logs', function (req, res) {
	let userId = req.params._id;
	let findConditions = { userId: userId };

	if (
		(req.query.from !== undefined && req.query.from !== '')
		||
		(req.query.to !== undefined && req.query.to !== '')
	) {
		findConditions.date = {};

		if (req.query.from !== undefined && req.query.from !== '') {
			findConditions.date.$gte = new Date(req.query.from);
		}

		if (findConditions.date.$gte == 'Invalid Date') {
			return res.json({ error: 'from date is invalid' });
		}

		if (req.query.to !== undefined && req.query.to !== '') {
			findConditions.date.$lte = new Date(req.query.to);
		}

		if (findConditions.date.$lte == 'Invalid Date') {
			return res.json({ error: 'to date is invalid' });
		}
	}

	let limit = (req.query.limit !== undefined ? parseInt(req.query.limit) : 0);

	if (isNaN(limit)) {
		return res.json({ error: 'limit is not a number' });
	}

	user.findById(userId, function (err, data) {
		if (!err && data !== null) {
			exercise.find(findConditions).sort({ date: 'asc' }).limit(limit).exec(function (err2, data2) {
				if (!err2) {
					return res.json({
						_id: data['_id'],
						username: data['username'],
						log: data2.map(function (e) {
							return {
								description: e.description,
								duration: e.duration,
								date: new Date(e.date).toDateString()
							};
						}),
						count: data2.length
					});
				}
			});
		} else {
			return res.json({ error: 'user not found' });
		}
	});
});


const listener = app.listen(process.env.PORT || 3000, () => {
	console.log('Your app is listening on port ' + listener.address().port);
});
