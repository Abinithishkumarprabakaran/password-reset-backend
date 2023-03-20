import express from "express";
import { getUserByName, createUser, getAllUsers } from "../service/users.service.js";
const router = express.Router();

router.get("/signup", async function (request, response) {
    // response.send("Welcome to Signup");

    const result = await getAllUsers()

    response.send(result)

});

router.post("/signup", async function (request, response) {
    const { username, password } = request.body;

    const userFromDB = await getUserByName(username);
    // console.log(userFromDB);

    if(userFromDB) {
        response.status(404).send({message: "Username Already Exists"})
    }
    else if(password.length < 8) {
        response.status(404).send({message: "Password Length should be more than 8 characters"})
    }
    else{
        const result = await createUser({
            username: username,
            password: password
        })
        response.send(result)
    }


});

export default router

