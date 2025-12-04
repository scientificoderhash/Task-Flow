const express = require("express");
const path = require("path");
const bcrypt = require('bcrypt');
const app = express();
const port = 3000;
const generateUniqueId = require('generate-unique-id');
const { addNewTask, editTask, deletetask, getAllTasks, getCategoryTasks} = require("./lib/db");
const { addNewUser, getUser } = require("./lib/auth");

const saltRounds = 10;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended : true}));
app.use(express.json());

let data = [];

// let allTasks = [];


app.listen(port, (req, res) => {
    console.log(`server is working at port: ${port}`);
})

app.get("/", (req, res) => {
    res.render("landingPage.ejs");
})

app.get("/login", (req, res) => {
    res.render("login.ejs");
})

app.post("/user/sign-up", async (req, res) => {
    let {name, username, password} = req.body;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);
    console.log(req.body);
    // data.push(req.body);
    // data.forEach((e)=> {
    //     console.log(e);
    // }) 
    let userId = await addNewUser({name, username, hashedPassword});
    console.log(userId);
    if(userId){
        res.redirect("/login");
    }else{
        res.redirect("/sign-up");
    }
    // res.redirect("/login");
})

app.post("/user/sign-in", async (req, res) => {
    let {username, password} = req.body;
    let user = await getUser(username);
    if(!user || !bcrypt.compareSync(password, user.hashedPassword)){
        return res.redirect("/login");
    }
    res.redirect(`/user?name=${user.name}&userId=${user._id}`);
})

app.get("/user", async(req, res) => {
    let {name, userId} = req.query;
    let allTasks = await getAllTasks(userId);
    res.render("user.ejs", {name, allTasks, userId});
})

app.post("/newtask", (req, res) => {
    console.log("req received");
    let {title, description, date, category, userId} = req.body;
    console.log("This is the userId: " + userId);
    let task = {
        userId: userId,
        title : title,
        description : description,
        date : date,
        category : category
    }
    addNewTask(task);
    console.log("Task sent to database");
    res.json(task);
})

app.post("/edittask", async (req, res) => { // Make async
    console.log("Edit req received");
    let {id, title, description, date, category, priority} = req.body;
    
    // Call the DB function
    let isUpdated = await editTask(id, {title, description, date, category, priority});
    
    if(isUpdated){
        // Send back the updated data so frontend can update UI
        res.json({ id, title, description, date, category, priority, status: "success" });
    } else {
        res.status(500).json({error: "Failed to update task"});
    }
})

app.post("/deletetask", async (req, res) => { // Make async
    let {id} = req.body;
    
    let isDeleted = await deletetask(id);
    
    if (isDeleted) {
        res.json({ status: "success", id: id });
    } else {
        res.status(500).json({ error: "Failed to delete task" });
    }
})

app.get("/user/new-grp", (req, res) => {

})