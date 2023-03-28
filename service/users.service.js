import { ObjectId } from "mongodb";
import { client } from "../index.js";

export async function getUserByName(username) {
    return await client
        .db("passwordDB")
        .collection("users")
        .findOne({ username: username });
}
export async function createUser(data) {
    return await client
        .db("passwordDB")
        .collection("users")
        .insertOne(data);
}

export async function getUserById(id) {
    return await client
        .db("passwordDB")
        .collection("users")
        .findOne({ _id: new ObjectId(id) });
}

export async function confirmEmailOTP(data) {
    return await client
        .db("passwordDB")
        .collection("confirmusers")
        .insertOne(data);
}

export async function checkOTP(OTP) {
    return await client
        .db("passwordDB")
        .collection("confirmusers")
        .findOne({ OTP: OTP });
}