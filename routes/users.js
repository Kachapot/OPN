var express = require("express");
var router = express.Router();
var { auth } = require("../auth");
const validate = require("../validations");

const bcrypt = require("bcrypt");
var fs = require("fs");
const dayjs = require('dayjs');

//Note : please Add "Authorization: Bearer faketoken_user1" to Headers before try any functions in this files.

// Registration page
router.post("/regis", auth, async (req, res) => {
  try {
    const body = req.body;
    // validate data from client
    const { error } = validate.regisValidate(body);
    if (error)
      return res.json({ status: 400, message: error.details[0].message, data: [] });
    // hash password before insert to DB
    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(body.password, salt);
    // Config User data before insert to DB
    const userData = {
      email: body.email,
      passowrd: hashpassword,
      name: body.name,
      birthDate: body.birthDate,
      gender: body.gender,
      address: body.address,
      subscribe: body.subscribe,
    };
    // onetime insert for example,please delete json data from ./dbsample.json before retry.
    fs.appendFile( "./routes/dbsample.json",
      JSON.stringify(userData),
      function (err) {
        if (err) throw err;
        // return success message to client
        return res.json({ status: 200, message: "Success!", data: [] });
      }
    );
    
  } catch (error) {
    console.log(error);
    res.json({ status: 200, message: "catch!", data: [] });
  }
});

// Profile page
// Note : please regis Customer data before try this function.
router.get("/profile", auth, async (req, res) => {
  try {
    fs.readFile('./routes/dbsample.json', 'utf8', (err, data)=>{
      if (err) throw err
      // checking Is customer data exists?
      if(!data || data.length == 0) return res.json({status:400,message:"data not found",data:[]})

      // convert String back to Json
      data = JSON.parse(data)

      // set payload data before send to client.
      let payload = {
        email:data.email,
        name:data.name,
        age:dayjs().diff(data.birthDate,'year'),
        address:data.address,
        subscribe: data.subscribe
      }
      // return data to client.
      return res.json({status:200,message:"success",data:payload})
    });
    
  } catch (error) {
    console.log(error);
    return res.json({ status: 400, message: "catch", data: [] });
  }
});

// Edit Profile page
router.post('/edit',auth,async(req,res)=>{
  try {
    const body = req.body
    // validate data before update
    const {error} = validate.editValidate(body) 
    if (error) return res.json({ status: 400, message: error.details[0].message, data: [] });
    fs.readFile('./routes/dbsample.json', 'utf8', (err, data)=>{
      if (err) throw err
      // checking Is customer data exists?
      if(!data || data.length == 0) return res.json({status:400,message:"data not found",data:[]})

      // convert String back to Json
      data = JSON.parse(data)

      if(body.deleteStatus){
        fs.writeFile('./routes/dbsample.json','','utf8',(err)=>{
          if (err) {
            // return error message to cliend.
            return res.json({status:400,message:'Error can not delete profile',data:[]})
          }
          // return success message to client.
          return res.json({status:200,message:"Deleted Profile.",data:[]})
        })
      }else{
        // set data before update to file
      let dataUpdate = {
        email:data.email,
        password:data.passowrd,
        name:data.name,
        birthDate:body.birthDate,
        gender : body.gender,
        address : body.address,
        subscribe : body.subscribe
      }

      // Convert Json back to String before write file
      dataUpdate = JSON.stringify(dataUpdate)
      // Write new data to file.
      fs.writeFile('./routes/dbsample.json', dataUpdate, 'utf8', (err) => {
        if (err) {
          // return error message to cliend.
          return res.json({status:400,message:'Error update data',data:[]})
        }
        // return success message to client.
        return res.json({status:200,message:"update success",data:[]})
      });
      }
      
    });
  } catch (error) {
    console.log(error);
    return res.json({status:400,message:"catch",data:[]})
  }
})

// Password change page
router.post('/updatePassword',auth ,async(req,res)=>{
  try {
    const body = req.body
    const {error} = validate.updatePassowrdValidate(body)
    if (error) return res.json({ status: 400, message: error.details[0].message, data: [] });
    fs.readFile('./routes/dbsample.json', 'utf8', async (err, data)=>{
      console.log(data);
      // checking Is customer data exists?
      if(!data || data.length == 0) return res.json({status:400,message:"data not found",data:[]})

      // convert String back to Json
      data = JSON.parse(data)
      // compare current password with password in DB
      const compare = await bcrypt.compare(body.currentPassword, data.password);
      // If password not match return Error.
      if(!compare) return res.json({status:400,message:"Current Password is not correct!",data:[]})

      // hash password before insert to DB
      const salt = await bcrypt.genSalt(10);
      const hashpassword = await bcrypt.hash(body.newPassword, salt);

      let dataUpdate = {
        email:data.email,
        password:hashpassword,
        name:data.name,
        birthDate:data.birthDate,
        gender : data.gender,
        address : data.address,
        subscribe : data.subscribe
      }

      // Convert Json back to String before write file
      dataUpdate = JSON.stringify(dataUpdate)
      // Write new data to file.
      fs.writeFile('./routes/dbsample.json', dataUpdate, 'utf8', (err) => {
        if (err) {
          // return error message to cliend.
          return res.json({status:400,message:'Error update data',data:[]})
        }
        // return success message to client.
        return res.json({status:200,message:"update new password success",data:[]})
      });
    })
  } catch (error) {
    console.log(error);
    return res.json({status:400,message:"catch!",data:[]})
  }
})



module.exports = router;
