import express from "express";
import bcrypt from "bcrypt";
import { getUserByName, createUser } from "../service/users.service.js";
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

export default router

