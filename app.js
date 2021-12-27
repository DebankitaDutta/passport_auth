const express=require('express');
const app=express();
const expressLayouts=require('express-ejs-layouts');
const path=require('path');
const session=require('express-session');
const flash=require('connect-flash');
const indexRouter=require('./routes/index');
const usersRouter=require('./routes/users');
const mongoose=require('mongoose');
const passport=require('passport');
const dotenv=require('dotenv');

dotenv.config();
//passport config
require('./config/passport')(passport);

//db config
const  db=require("./config/key").DB;


//db connection with mongoose
mongoose.connect(db)
.then(()=>{
    console.log('db connected');
})
.catch(err=>{
console.log(err);
})

//EJS
app.use(expressLayouts);
app.set('view engine','ejs');
// app.set('views', path.join(__dirname, 'views'));

//body parser middleware
app.use(express.urlencoded({extended: false}));

//for flash message
app.use(session({
    secret:'secret',
    saveUninitialized: true,
    resave: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
//global vars
app.use((req,res,next)=>{
    res.locals.success_msg=req.flash('success_msg');
    res.locals.error_msg=req.flash('error_msg');
    res.locals.error=req.flash('error');
    next();
})
//routes

app.use('/',indexRouter);
app.use('/users',usersRouter);


app.listen(process.env.PORT || 5000,()=>{
    console.log('server started');
})