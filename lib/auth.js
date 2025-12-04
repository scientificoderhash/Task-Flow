const {MongoClient} = require("mongodb");
const uri = require("../atlas_uri");
const client = new MongoClient(uri);
const dbname = "Test";
const userCollectionName = "testUserCollection";
const userCollection = client.db(dbname).collection(userCollectionName);

const connectToDatabase = async () =>{
    try{
        await client.connect();
        console.log("Client connected");
    }catch(err){
        console.error("Error conncecting to database: " + err);
    }
}

const addNewUser = async(user) => {
    try{
        await connectToDatabase();
        let result = await userCollection.insertOne(user);
        console.log("User added with id: " + result.insertedId);
        return result.insertedId;
    }catch(err){
        console.error("Error in adding new User ", err);
        return null;
    }finally{
        await client.close();
        console.log("Connection closed");
    }
}

const getUser = async(username) => {
    try{
        await connectToDatabase();
        let user = await userCollection.findOne({
            username: username
        });
        if(!user){
            console.log("User not found");
            return null;
        }
        return user;
    }catch(err){
        console.error("Error in getting user: " + err);
        return null;
    }finally{
        await client.close();
        console.log("Connection closed");
    }
}



const deleteUser = async(userId) => {
    try{
        await connectToDatabase();
        let result = await userCollection.deleteOne({_id: userId});
        console.log("User deleted with id: " + result.deletedCount);
        return true;
    }catch(err){
        console.error("Error in deleting user: " + err);
        return false;
    }finally{
        await client.close();
        console.log("Connection closed");
    }
}

module.exports = { addNewUser, getUser, deleteUser };