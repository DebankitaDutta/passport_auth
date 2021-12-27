const localStrategy=require('passport-local');
const mongoose=require('mongoose');
const User=require("../models/User");
const bcrypt=require('bcryptjs');

module.exports=function(passport){
    //adding passport middleware
    // console.log('hi am inside passsport');
    passport.use(
        new localStrategy({usernameField:'email'},(email,password,done)=>{
          
        User.findOne({email:email})
        .then(user=>{
            if(!user){
                return done(null,false,{message:"username doesn't exist"});
            }

            bcrypt.compare(password,user.password,(err,isMatch)=>{
                if(err) throw err;
                if(isMatch){
                    
                    return done(null,user);
                }
                else{
                    // console.log('incorrect password:');
                    return done(null,false,{message: 'incorrect password'});
                }
            })
        })
        .catch(err=>console.log(err));
    })

)
passport.serializeUser((user, done)=>{
    done(null, user.id);
  });
  
  passport.deserializeUser((id, done)=>{
    User.findById(id,(err, user)=>{
      done(err, user);
    });
  });
  

}