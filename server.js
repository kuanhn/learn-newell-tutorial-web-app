var flash = require('connect-flash');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var expressSession = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var database = require('./database');


var User = database.User;
var Lesson = database.Lesson;
var Proces = database.Process;
var Note = database.Note;

passport.serializeUser(function(user, done) {	
  done(null, user.email);
});
 
passport.deserializeUser(function(email, done) {	
	var user = User.build();
  user.retrieveByEmail(email, function(user) {
    done(null, user);
  }, function(err){
  	done(err, null);
  });
});

// passport.use(new TwitterStrategy({
//     consumerKey: '6DhYbJJg3qLLFFzIPABy5MHUO',
//     consumerSecret: 'sqR50O37iuHyENDjPAatzhwqKRaaXea3sL7a7hFDATbnICtvPe',
//     callbackURL: "http://127.0.0.1:8080/auth/twitter/callback"
//   },
//   function(token, tokenSecret, profile, done) {    
//       console.log("USER:"+token);
//   }
// ));

passport.use('local', new LocalStrategy(
  function(email, password, done) {
  	console.log('email:'+email);
      var users = User.build();
      users.validateUser(email, password, function(err, user, result) {
      	console.log('user:'+user+', result:'+result);
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        if (!result) { return done(null, false); }
        return done(null, user);
      });    
  }
));


var app = express();

// app.use(favicon(__dirname + '/public/favicon.png'));
app.use(logger('dev'));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'app')));
app.use(cookieParser());
// app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
// app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());
app.use(expressSession({secret: 'learnWithNewell', resave: false, saveUninitialized: true}));

// init Passport =========================
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.post('/login', 
	passport.authenticate('local', {failureRedirect: '/login'}),
  function(req, res) {  	
  	console.log('pass auth');
    res.status(200).json({authenticated: true});
});
app.get('/login', function(req, res){
	res.status(200).json({authenticated: false});
})

var auth = function(req, res, next){ 
	if (!req.isAuthenticated()) res.send(401); else next(); 
};

// RESTful API ===========================
// USER 
app.get('/api/user/:email', function(req, res){
	// get user info by email
	var user = User.build();
	
	user.retrieveByEmail(req.params.email, function(users) {
		if (users) {		
		  res.status(200).json(users);
		} else {
		  res.status(404).send("User not found");
		}
	}, function(error) {
		res.status(404).send("User not found");
	});
});
app.post('/api/user/', function(req, res){
	// add user
	var email = req.body.email;
	var password = req.body.password;
	var user = User.build({email: email, password: password});
	user.add(function(sucess){
		res.status(200).json({message:"sucessed"});
	}, function(err){
		if (err.parent.code == "ER_DUP_ENTRY"){
			res.status(404).json({error:"Username existed"});
		} else res.status(404).send(err);
	});
});
app.put('/api/user/:email', function(req, res){
	// update user info
	var email = req.body.email;
	var password = req.body.password;
	var user = User.build({email: email, password: password});
	user.updateByEmail(req.params.email, function(sucess){		
		res.status(200).json({message:"sucessed"});
	}, function(err){
		res.status(404).send(err);
	});
}); 

// PROCESS
app.get('/api/process/:id', function(req, res){
	// get process of user on a lesson
	var user = req.body.email;
	var lesson_id = req.params.id;
});

// LESSON
app.get('/api/lesson/:id', function(req, res){
	// get lesson detail
	var lesson_id = req.params.id;
	var lesson = Lesson.build();
	lesson.retrieveById(lesson_id, function(lessons){
		if (lessons){
			res.status(200).json(lessons);
		} else {
			res.status(404).json({message: 'lesson not found'});
		}
	},function(error){
		res.status(404).send(error);
	})
});
app.post('/api/lesson', function(req, res){  /* for admin */
	// add lesson
	// this function for admin
});
app.put('/api/lesson/:id', function(req, res){  /* for admin */
	// update lesson
	// this function for admin
});
app.get('/api/lessons/:language', function(req, res){
	// get all lesson follow language(common info)
	var language = req.params.language;
	// res.status(200).json({message: 'test'});
	var lesson = Lesson.build();
	lesson.retrieveAllByLanguage(language, function(lessons){
		if (lessons){
			res.status(200).json(lessons);
		} else {
			res.status(404).json({message: 'found no lesson'});
		}
	}, function(error){
		res.status(404).send(error);
	});
});

// NOTE
app.get('/api/note/:lesson_id/:email', function(req, res){
	// get note in lesson
	var note = Note.build({lesson_id: req.params.lesson_id});
	note.retrieveByEmail(req.params.email, function(notes){
		if (notes){
			res.status(200).json(notes);
		} else {
			res.status(404).json({message: 'note not found'});
		}
	}, function(err){
		res.status(404).json(err);
	})
});
app.get('/api/notes/:email', function(req, res){
	// get note in lesson
	var note = Note.build();
	note.retrieveAllByEmail(req.params.email, function(notes){
		res.status(200).json(notes);
	}, function(err){
		res.status(404).json(err);
	})
});
app.post('/api/note/:lesson_id', function(req, res){
	// add note to user in lesson	
	var note = Note.build({user_email: req.body.email, lesson_id: req.params.lesson_id, content: req.body.content});
	note.add(function(success){
		res.status(200).json({message: "add success"});
	}, function(err){
		res.status(404).json({error: err});
	})
});
app.put('/api/note/:lesson_id', function(req, res){
	var note = Note.build({user_email: req.body.email, lesson_id: req.params.lesson_id, content: req.body.content});
	note.update(function(success){
		res.status(200).json({message: "add success"});
	}, function(err){
		res.status(404).json({error: err});
	});
});

// BADGE
app.get('/api/badge/:id', function(req, res){
	// get info about badge
});

// router ============================
app.get('*', 	function(req, res) {
  res.sendFile(path.resolve('./app/index.html'));
});

// listen (start app with node server.js) ======================================
app.listen(8080);
console.log("App listening on port 8080");