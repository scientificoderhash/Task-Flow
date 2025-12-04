const {MongoClient, ObjectId} = require("mongodb");
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

connectToDatabase();

const addNewTask = async(task) => {
    try{
        let result = await taskCollection.insertOne(task);
        console.log("Task added with id: " + result.insertedId);
        return result.insertedId;
    }catch(err){
        console.error("Error in adding new Task: " + err);
        return null;
    }
}

const editTask = async(id, task) => {
    try {
        // FIX 1: Convert string ID to ObjectId
        const filter = { _id: new ObjectId(id) };
        
        let result = await taskCollection.updateOne(filter, {$set: task});
        
        // FIX 2: Check modifiedCount or matchedCount, NOT upsertedId
        return result.matchedCount > 0; 
    } catch(err) {
        console.error("Error in editing Task: " + err);
        return false;
    }
}

const deletetask = async(id) => {
    try {
        // FIX 3: Convert string ID to ObjectId
        const filter = { _id: new ObjectId(id) };
        
        let result = await taskCollection.deleteOne(filter);
        return result.deletedCount > 0;
    } catch(err) {
        console.error("Error in deleting Task: " + err);
        return false;
    }
}

const getAllTasks = async(userId) => {
    try {
        let tasks = await taskCollection.find({userId: userId}).toArray();
        return tasks;
    } catch(err) {
        console.error("Error in fetching tasks: " + err);
        return [];
    }
}

const getCategoryTasks = async(userId, categId) => {
    try{
        let categTasks = await taskCollection.find({userId: userId, category: categId}).toArray();
        return categTasks;
    }catch(err){
        console.error("Error in fetching category tasks: " + err);
    }
}

module.exports = { addNewTask, editTask, deletetask, getAllTasks, getCategoryTasks };