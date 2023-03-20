import express from "express";
import * as dotenv from 'dotenv';
import { MongoClient } from "mongodb";
import cors from 'cors';
import userRouter from "./router/users.router.js"
dotenv.config();
export const app = express();

const PORT = process.env.PORT;

const client = new MongoClient(process.env.MONGO_URL);
await client.connect();
console.log("Mongo is Connected!...");

app.use(cors())

app.use(express.json())

app.get("/", function (request, response) {
  response.send("Hello, Users");
});

app.use("/users", userRouter);

app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`));

export { client }