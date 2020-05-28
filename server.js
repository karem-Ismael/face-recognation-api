const express=require('express')
 const app=express()
const bodyParser=require('body-parser')
const bcrypt=require('bcrypt-nodejs')
const cors=require('cors')
const signin=require('./controllers/signin')
const register=require('./controllers/register')
const image=require('./controllers/load')
const PORT = process.env.PORT || 3001 ;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0; 

const  db = require('knex')({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl:true
    }
  })
app.use(bodyParser.json())
app.use(cors())
app.get('/',(req,res)=>{
    res.send('it is working')
})
app.get('/profile/:id',(req,res)=>{
    const {id}=req.params
    db.select('*').from('users').where({
        'id':id
    }).then(user=>{
        if(user.length >0){
        res.json(user)
        }else{
            res.status(400).json('user not found')
        }
    }).catch(err=> res.json('error getting user')) 
})
app.put('/image',(req,res)=>{image.updateentries(req,res,db)})
app.post('/signin',(req,res)=>{signin.handlesignin(req,res,db,bcrypt)})
app.post('/register',(req,res)=>{register.handleregister(req,res,db,bcrypt)})
const callback=()=>{
    console.log(`app is running ON PORT ${PORT}`)
}
app.listen(PORT,callback)