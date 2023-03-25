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
