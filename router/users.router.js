import express from "express";
import { getUserByName, createUser } from "../service/users.service.js";
const router = express.Router();

router.get("/signup", function (request, response) {
    response.send("Welcome to Signup");
});

router.post("/signup", async function (request, response) {
    const { username, password } = request.body;

    const userFromDB = await getUserByName(username);
    console.log(userFromDB);

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

