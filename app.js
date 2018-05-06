var express = require('express');
var app = express();
var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/bloggdb");
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var expressSanitizer = require('express-sanitizer');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var passportLocalMongoose = require('passport-local-mongoose');
var User = require("./models/user");
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(expressSanitizer());
app.use(require('express-session')({
	secret:"Subash Basnet aka Mr Mojo Risin",
	resave:false,
	saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//--------------------------------------//
//Blog Model
//--------------------------------------//
var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	content: String,
	created: {type:Date, default:Date.now}
});
var Blog = mongoose.model("Blog",blogSchema);

//--------------------------------------//
//User Model
//--------------------------------------//


//--------------------------------------//
//Homepage
//--------------------------------------//
app.get("/",function(req,res){
	res.redirect("/blogs");
});

//--------------------------------------//
//HomePage
//--------------------------------------//
app.get("/blogs",function(req,res){
	Blog.find({},function(err,blogs){
		if(!err){
			res.render("home",{blog:blogs});
		}
	});
});


app.get("/register",function(req,res){
	res.render("register");
});

app.post("/register",function(req,res){
	User.register(new User({username:req.body.username}),req.body.password,function(err,user){
		if(!err){
			passport.authenticate("local")(req,res,function(){
				res.redirect("/");
			});
		}
	});
});

app.get("/login",function(req,res){
	res.render("login");
});

app.post("/login",passport.authenticate("local",{
	successRedirect:"/",
	failureRedirect:"/login"
}),function(req,res){
});





//--------------------------------------//
//Create New Blog
//--------------------------------------//
app.get("/blogs/new",function(req,res){
	res.render("new");
});

//--------------------------------------//
//Post New Blog
//--------------------------------------//
app.post("/blogs",function(req,res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog,function(err){
		if(!err){
			res.redirect("/");
		}else{
			res.render("new")
		}
	});
});

//--------------------------------------//
//View Blog
//--------------------------------------//
app.get("/blogs/:id",function(req,res){
	Blog.findById(req.params.id,function(err,blog){
		if(!err){
			res.render("show",{blog:blog});
		}else{
			res.redirect("/");
		}
	});
});

//--------------------------------------//
//Edit BLog
//--------------------------------------//
app.get("/blogs/:id/edit",function(req,res){
	Blog.findById(req.params.id,function(err,blog){
		if(!err){
			res.render("edit",{blog:blog});
		}else{
			res.redirect("/");
		}
	});
});

//--------------------------------------//
//Edit and Post Blog
//--------------------------------------//
app.put("/blogs/:id",function(req,res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,blog){
		if(!err){
			res.redirect("/blogs/req.params.id");
		}else{
			res.redirect("/");
		}
	});
});

//--------------------------------------//
//Delete Blog
//--------------------------------------//
app.delete("/blogs/:id",function(req,res){
	Blog.findByIdAndRemove(req.params.id,function(err){
		if(!err){
			res.redirect("/blogs");
		}else{
			res.redirect("/");
		}
	});
});

//--------------------------------------//
//Listen
//--------------------------------------//
app.listen(3000,function(){
	console.log("HEY HOO");
});

