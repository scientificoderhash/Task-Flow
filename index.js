const express = require("express");
const path = require("path");
const app = express();
const port = 3000;
const generateUniqueId = require('generate-unique-id');
const { addNewTask, editTask, deleteTask, getAllTasks, getCategoryTasks} = require("./lib/db");
const { addNewUser, getUser } = require("./lib/auth");


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

app.post("/user/sign-up", (req, res) => {
    let {name, username, password} = req.body;
    console.log(req.body);
    data.push(req.body);
    data.forEach((e)=> {
        console.log(e);
    }) 
    res.redirect("/login");
    // let userId = addNewUser({name, username, password});
    // console.log(userId);
    // if(userId){
    //     res.redirect("/");
    // }else{
    //     res.redirect("/sign-up");
    // }
})

app.post("/user/sign-in", (req, res) => {
    let {username, password} = req.body;
    let user = data.find((p) => p.username === username);
    res.redirect(`/user?name=${user.name}`)
})

app.get("/user", (req, res) => {
    let {name} = req.query;
    let allTasks = getAllTasks();
    res.render("user.ejs", {name, allTasks});
})

app.post("/newtask", (req, res) => {
    console.log("req received");
    let {title, description, date, category} = req.body;
    var id1 = generateUniqueId();
    let task = {
        id: id1,
        title : title,
        description : description,
        date : date,
        category : category
    }
    addNewTask(task);
    console.log("Task sent to database");
    res.json(task);
})

app.post("/edittask", (req, res) => {
    console.log("req received");
    let {id, title, description, date, category} = req.body;
    let upsertedId = editTask(id, {title, description, date, category});
    if(!upsertedId){
        return res.json({error: "Error in editing task"});
    }
    res.json(task);
})

app.post("/deletetask", (req, res) => {
    let {id} = req.body;
    let task = allTasks.find((t) => t.id === id);
    if(task){
        allTasks = allTasks.filter((t) => t.id !== id);
    }
    res.json(allTasks);
})

app.get("/user/new-grp", (req, res) => {

})