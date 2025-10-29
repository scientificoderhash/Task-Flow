const {MongoClient} = require("mongodb");
const uri = require("../atlas_uri");
const client = new MongoClient(uri);
const dbname = "Test";
const taskCollectionName = "testCollection";
const taskCollection = client.db(dbname).collection(taskCollectionName);

const connectToDatabase = async () =>{
    try{
        await client.connect();
        console.log("Client connected");
    }catch(err){
        console.error("Error conncecting to database: " + err);
    }
}

const addNewTask = async(task) => {
    try{
        await connectToDatabase();
        let result = await taskCollection.insertOne(task);
        console.log("Task added with id: " + result.insertedId);
        return result.insertedId;
    }catch(err){
        console.error("Error in adding new Task: " + err);
        return null;
    }finally{
        await client.close();
        console.log("connection closed");
    }
}

const editTask = async(id, task) => {
    try{
        await connectToDatabase();
        let result = await taskCollection.updateOne(id, {$set: task});
        console.log("Task edited with id: " + result.upsertedId);
        return result.upsertedId;
    }catch(err){
        console.error("Error in editing Task: " + err);
        return null;
    }finally{
        await client.close();
        console.log("connection closed");
    }
}

const deletetask = async(id) => {
    try{
        await connectToDatabase();
        let result = await taskCollection.deleteOne(id);
        console.log("Task deleted with id: " + result.deletedCount);
    }catch(err){
        console.error("Error in deleting Task: " + err);
    }finally{
        await client.close();
        console.log("Connection closed");
    }
}

const getAllTasks = async(userId) => {
    try{
        await connectToDatabase();
        let tasks = await taskCollection.find({userId: userId}).toArray();
        return tasks;
    }catch(err){
        console.error("Error in fetching tasks: " + err);
    }finally{
        console.log("Connection closed");
    }
}

const getCategoryTasks = async(userId, categId) => {
    try{
        await connectToDatabase();
        let categTasks = await taskCollection.find({userId: userId, category: categId}).toArray();
        return categTasks;
    }catch(err){
        console.error("Error in fetching category tasks: " + err);
    }finally{
        console.log("Connection closed");
    }
}

module.exports = { addNewTask, editTask, deletetask, getAllTasks, getCategoryTasks };