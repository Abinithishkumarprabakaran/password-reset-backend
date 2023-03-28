import express from "express";
import bcrypt from "bcrypt";
import { getUserByName, createUser, confirmEmailOTP, getUserById, checkOTP } from "../service/users.service.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import {Str} from '@supercharge/strings';
import { totp } from 'otplib';

const router = express.Router();

async function generateHashedPassword(password) {
    const NO_OF_ROUNDS = 10;
    const salt = await bcrypt.genSalt(NO_OF_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt)
    // console.log(salt)
    // console.log(hashedPassword)
    return hashedPassword
  }

router.post("/signup", async function (request, response) {
    const { username, password } = request.body;

    const userFromDB = await getUserByName(username);

    if(userFromDB) {
        response.status(404).send({message: "Username Already Exists"})
    }
    else if(password.length < 8) {
        response.status(404).send({message: "Password Length should be more than 8 characters"})
    }
    else{
        const hashedPassword = await generateHashedPassword(password)
        const result = await createUser({
            username: username,
            password: hashedPassword
        })
        response.send(result)
    }
});

router.post("/login", async function (request, response) {
    const { username, password } = request.body;
  
    const userFromDB = await getUserByName(username);
    // console.log(userFromDB)
  
    if( !userFromDB ) {
      response.status(401).send({message: "Invalid Credentials"})
    }
    else {
      const storedDBPassword = userFromDB.password;
      const isPasswordCheck = await bcrypt.compare(password, storedDBPassword)
      // console.log(isPasswordCheck)
      if( isPasswordCheck ) {
        const token = jwt.sign({ id: userFromDB._id }, process.env.SECRET_KEY)
        // console.log(token);
        response.send({ message: 'Login successful', token: token })
      }
      else {
        response.status(401).send({ message: 'Invalid Credentials' })
      }
    }
})

router.post("/confirmation", async function( request, response ) {
  const { username } = request.body

  const userFromDB = await getUserByName(username);
  // console.log(userFromDB.username)

  if( !userFromDB ) {
    console.log("No user found")
    response.status(404).send({message: "User Not Found"})
  }
  else {
    const OTP = totp.generate(process.env.SECRET_KEY_FOR_RESET);
    console.log(OTP);

    const resetToken = {
      "username" : userFromDB.username,
      "OTP" : OTP,
      "createdAt" : new Date(),
    }
    const result = await confirmEmailOTP(resetToken)
    console.log(resetToken)
    response.send(result)
  }
})

router.post("/forgotpassword", async function( request, response ) {
  const { OTP } = request.body

  const checkingOTP = await checkOTP(OTP)

  if( !checkingOTP ) {
    console.log("Invalid OTP")
    response.status(401).send({message: "Invalid OTP"})
  }
  else {
    response.send(checkingOTP)
  }

})

// router.get("/changepassword/:id/:token", async function (request, response) {
//   const {id, token} = request.params;
//   console.log(request.params)

//   const userFromDB = await getUserById(id);

//   if( !userFromDB ) {
//     console.log("No user found")
//     response.status(404).send({message: "User Not Found"})
//   }

//   const secret = process.env.SECRET_KEY_FOR_RESET
  
//   try {
//     const verify = jwt.verify(token, secret)
//     response.send("Verified")
//   }
//   catch(err) {
//     console.log(err)
//     response.send("Not Verified")
//   }
// })

export default router

