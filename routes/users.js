const express=require('express');
const router=express.Router();
const bcrypt=require('bcryptjs');
const User=require('../models/User')
const passport=require('passport');
//login page
router.get('/login',(req,res)=>{
    res.render('login');
})
//register page
router.get('/register',(req,res)=>{
    res.render('register');
})

//user post
router.post('/register',(req,res)=>{
    // console.log(req.body);
    const { name,email,password,password2}=req.body;
    let errors=[];

    //checking for mandatory fields
    if(!name || !email || !password ||!password2){
        errors.push({msg: 'please fill in all the fields'});
    }

    //checking for password comfirmation
    if(password!= password2){
        errors.push({msg: "password is not matching"});
    }

    //checking for password length
    if(password.length<6){
        errors.push({msg: 'password length should be more than 6'});
    }

    //validation passing logic

    if(errors.length>0){
        res.render('register',{
            errors,
            name,
            email,
            password,
            password2
        })
    }
    else{
        //validation passed
        User.findOne({email:email})
        .then(user=>{
            if(user){
                errors.push({msg:"mail id is registered"});
                res.render('register',{
                    errors,
                    name,
                    email,
                    password,
                    password2
                })
            }
            else{
                const newUser=new User({
                    name,
                    email,
                    password,
                    password2
                })
                bcrypt.genSalt(10,(err,salt)=>
                    bcrypt.hash(newUser.password,salt,(err,hash)=>{
                        if(err) throw err;
                        // set password to hashed
                            newUser.password=hash;
                        //details saving in db
                            newUser.save()
                            .then(user=>{
                                req.flash('success_msg','you are now registered and can login');
                                res.redirect('/users/login');
                            })
                            .catch(err=>{
                                console.log(err);
                            })
                    })
                )

                
            }
        })
       
    }
})

//login handle
router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/dashboard',
        failureRedirect:'/users/login',
        failureFlash:true
    })(req,res,next)
    
})

router.get('/logout',(req,res)=>{
    req.logOut();
    req.flash('success_msg','you are successfully logged out');
    res.redirect('/users/login');
})

module.exports=router;