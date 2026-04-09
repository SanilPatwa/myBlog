const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
app.use(express.json());

let USERS = [];
let POSTS = [];
let userId = 0;

// Post routes 
app.post('/signup',(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    userExist = USERS.find(u=> u.username === username );
    if(userExist){
        return res.status(411).json({
            message:"User already exists"
        })
    }
    USERS.push({
        id:userId++,
        username, 
        password
    })
    res.status(200).json({
        message:"User created successfully"
    })
});

app.post('/signin',(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    let userExist = USERS.find(u=>u.username === username && u.password === password);
    if(!userExist){
        return res.status(404).json({
            message:"User not found!"
        })
    }
    const token = jwt.sign(
        {id:userExist.id, username: userExist.username},
        "sanilsecretkey"
    );

    res.status(200).json({token})
})


app.listen(3000,()=>{
    console.log('Server is running')
})