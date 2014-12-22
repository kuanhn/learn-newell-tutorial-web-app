(function(database){
"user strict"
var Sequelize = require('sequelize');

// db config
var env = "dev";
var config = require('./database.json')[env];
var password = config.password ? config.password : null;

// initialize database connection
var sequelize = new Sequelize(
	config.database,
	config.user,
	config.password,
	{
		logging: console.log,
		define: {
			timestamps: false
		}
	}
);

var crypto = require('crypto');
var DataTypes = require("sequelize");

var User = sequelize.define('user', {
    email: {
    	type: DataTypes.STRING(100),
    	primaryKey: true
    },
    password: DataTypes.STRING(100)
  }, {
    instanceMethods: {      
	    retrieveByEmail: function(user_email, onSuccess, onError) {
				User.find({where: {email: user_email}, attributes: ['email']})
					.success(onSuccess).error(onError);					
			},
	    add: function(onSuccess, onError) {
				var email = this.email;
				var password = this.password;
				
				var shasum = crypto.createHash('sha1');
				shasum.update(password);
				password = shasum.digest('hex');
				
				User.build({ email: email, password: password })
				.save().success(onSuccess).error(onError);
		  },
		  updateByEmail: function(user_email, onSuccess, onError) {				
				var email = this.email;
				var password = this.password;
				
				var shasum = crypto.createHash('sha1');
				shasum.update(password);
				password = shasum.digest('hex');
							
				User.update({ email: email, password: password},{where: {email: user_email} })
				.success(onSuccess).error(onError);
		  },
		  validateUser: function(user_email, password, onFinish){
		  	User.find({where: {email: user_email}})
				.success(function(users){
						if (users){														
							var shasum = crypto.createHash('sha1');
							shasum.update(password);
							password = shasum.digest('hex');							

							if (password != users.password){
								return onFinish(null, users, false);								
							} else {
								return onFinish(null, users, true);								 
							}
						} else {
							return onFinish(null, null, false);
						}
				}).error(function(err){
						return onFinish(err, null);
				});
			}		  
	  }
	});

var Lesson = sequelize.define('lesson', {
	title: DataTypes.STRING(200),
	content: DataTypes.TEXT,
	practice_content: DataTypes.TEXT,
	language: DataTypes.STRING(20),
	lesson_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		primaryKey: true,
		autoIncrement: true
	}
}, {
	instanceMethods: {
		retrieveAllByLanguage: function(request_language, onSuccess, onError){
			// get common info
			Lesson.findAll({where: {language: request_language}, attributes: ['title', 'lesson_id']})
				.success(onSuccess).error(onError);
		},
		retrieveById: function(id, onSuccess, onError){
			Lesson.find({where: {lesson_id: id}})
				.success(onSuccess).error(onError);
		}
	}
});

var Process = sequelize.define('learn_process', {
	user_email: {
		type: DataTypes.STRING(100),
		references: "users",
		referencesKey: "email",
		primaryKey: true		
	},
	lesson_id: {
		type: DataTypes.INTEGER,
		references: "lessons",
		referencesKey: "lesson_id",
		primaryKey: true
	},
	html_file: DataTypes.TEXT,
	css_file: DataTypes.TEXT,
	js_file: DataTypes.TEXT
}, {
	instanceMethods: {
		retrieveAllByEmail: function(user_email, onSuccess, onError){

		}
	}
});

var Note = sequelize.define('note', {
	user_email: {
		type: DataTypes.STRING(100),
		references: "users",
		referencesKey: "email",
		primaryKey: true		
	},
	lesson_id: {
		type: DataTypes.INTEGER,
		references: "lessons",
		referencesKey: "lesson_id",
		primaryKey: true
	},
	content: DataTypes.TEXT
}, {
	instanceMethods: {
		retrieveAllByEmail: function(user_email, onSuccess, onError){
			Note.findAll({where: {user_email: user_email}, attributes: ['user_email', 'lesson_id', 'content'], include: [{ model: Lesson, attributes: ['title', 'language']}]})
				.success(onSuccess).error(onError);
		},
		retrieveByEmail: function(user_email, onSuccess, onError){
			var lesson = this.lesson_id;
			Note.find({where: {user_email: user_email, lesson_id: lesson}, attributes: ['user_email', 'lesson_id', 'content'], include: [{ model: Lesson, attributes: ['title', 'language']}]})
				.success(onSuccess).error(onError);
		},
		add: function(onSuccess, onError){
			var email = this.user_email;
			var lesson = this.lesson_id;
			var content = this.content;

			console.log("Email: "+email+", Lesson: "+lesson+", Content:"+content);
			Note.build({ user_email: email, lesson_id: lesson, content: content})
				.save().success(onSuccess).error(onError);
		},
		update: function(onSuccess, onError){
			var email = this.user_email;
			var lesson = this.lesson_id;
			var content = this.content;

			Note.update({content: content}, {where: {user_email: email, lesson_id: lesson}})
				.success(onSuccess).error(onError);
		}
	}
});

var Achievement = sequelize.define('achievement', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		allowNull: false
	},
	name: DataTypes.STRING(100),
	condition_pass: DataTypes.INTEGER
}, {
	instanceMethods: {	
		retrieveById: function(achieve_id, onSuccess, onError){

		}
	}
});

var UserAchievement = sequelize.define('user_achievement', {
	user_email: {
		type: DataTypes.STRING(100),
		references: "users",
		referencesKey: "email",
		primaryKey: true		
	},
	achievement_id: {
		type: DataTypes.INTEGER,
		references: "achievements",
		referencesKey: "id",
		primaryKey: true
	}
}, {
	instanceMethods: {
		retrieveAllByEmail: function(user_email, onSuccess, onError){
		}
	}
});

User.hasMany(Process, {foreignKey: 'user_email'});
Lesson.hasMany(Process, {foreignKey: 'lesson_id'});
Process.belongsTo(User, {foreignKey: 'user_email'});
Process.belongsTo(Lesson, {foreignKey: 'lesson_id'});

User.hasMany(Note, {foreignKey: 'user_email'});
Lesson.hasMany(Note, {foreignKey: 'lesson_id'});
Note.belongsTo(User, {foreignKey: 'user_email'});
Note.belongsTo(Lesson, {foreignKey: 'lesson_id'});

User.hasMany(Achievement);

database.User = User;
database.Lesson = Lesson;
database.Note = Note;
database.Process= Process;
database.Achievement = Achievement;
database.UserAchievement = UserAchievement;
})(module.exports);