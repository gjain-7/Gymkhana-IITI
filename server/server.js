const express = require('express')
const cors = require('cors')
const app = express()
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');
require('dotenv').config()


const DB_URI = process.env.MONGO_URI
const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN

const Users = require('./models/users')

app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }))
app.use(express.json({ limit: '50mb' }))

const cloudinary = require('cloudinary').v2
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

mongoose.connect(DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(res => console.log('mongoDB connected...'))
  .catch(err => console.log(err))

app.get('/', (req, res) => {
  res.status(200).json({
    msg: "This is the server of Gymkhana IITI"
  })
})

const jwtAuth = async (req,res,next)=>{
  try{
    // return next()
    console.log("JWT Middleware",req.headers.authorization)
    const decoded = jwt.verify(req.headers.authorization, process.env.JWT_KEY)
    console.log("Decoded token ",decoded)

    req.userName = decoded.name

    const userEmailId = decoded.email
    const user = await Users.findOne({userEmailId:userEmailId})
    if(user)
    {
      return next()
    }
    else
    {
      return res.status(401).json({message:"JWT Auth Failed"})
    }
  }
  catch(error){
    console.log(error)
    return res.status(401).json({message:"JWT Auth Failed"})
  }
}

const usersRoute = require('./routes/users')
app.use('/users', jwtAuth,usersRoute)

const contentRoute = require('./routes/content')
app.use('/content', jwtAuth,contentRoute)

const authRoute = require('./routes/auth')
app.use('/auth',authRoute)

app.use('/uploadImage',jwtAuth)

app.route('/uploadImage').post(async (req, res) => {
  try {
    let imgData  = req.body.img
    imgData = JSON.parse(imgData)
    const imgString = imgData.data

    const dataFor = req.body.dataFor

    const uploadResponse = await cloudinary.uploader.upload(imgString);
    const imgURL = uploadResponse.secure_url

    let userName = req.userName


    let user = await Users.findOne({userName:userName})
    const versionIndex = (user.contentVersions).length - 1;

    if(dataFor=="poster")
    {
        user = await Users.updateOne({userName:userName},{'$set': { [`contentVersions.${versionIndex}.homePagePoster.src`] : imgURL}},{new:true})
    }
    else if(dataFor=="logo")
    {
        user = await Users.updateOne({userName:userName},{'$set': { [`contentVersions.${versionIndex}.userDetails.logo`] : imgURL}},{new:true})
    }
    else if(dataFor=="editSectionChild")
    {
        const sectionID = req.body.sectionID
        const sectionChildID = req.body.sectionChildID
        let allSections = user.contentVersions[versionIndex].Sections;
        let sectionIndex = allSections.findIndex((element) => element.sectionID === parseInt(sectionID));
        let sectionContent = allSections[sectionIndex].sectionContent;
        let sectionChildIndex = sectionContent.findIndex((element) => element.sectionChildID === parseInt(sectionChildID))
        user = await Users.updateOne({userName:userName},{'$set': { [`contentVersions.${versionIndex}.Sections.${sectionIndex}.sectionContent.${sectionChildIndex}.sectionChildImage`] : imgURL}},{new:true})
    }

    res.json({ msg: 'success' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ err: 'Something went wrong' });
  }
})

app.route('/public/:userName').get(async (req,res)=>{
  try {
    console.log("Public user fetch called")
    const {userName : userName} = req.params
    const user = await Users.findOne({userName:userName})
    return res.status(201).json({"user":user})
    

  } catch (error) {
      return res.status(404).json({message:error})
  }
})

app.listen(PORT, () => {
  console.log(`Listening on the port: ${PORT}`);
});


