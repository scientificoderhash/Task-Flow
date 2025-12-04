function createNewTask(userId) {
    let background = document.body.querySelector('.background');
    background.classList.remove("hidden");
    let align = document.body.querySelector('.align');
    
    // Included Priority Select
    align.innerHTML = `<form onsubmit="addNewTask(event, '${userId}')" class="newTask">
            <div id="formBar">
              <span style="text-decoration: underline;">New Task</span>
              <button type="button" id="discard" onclick="cancelTask()">X</button>
            </div>

            <label for="title">Title:-</label>
            <input type="text" name="title" id="title" required> <br>

            <label for="description">Description:-</label>
            <div id="description"></div>

            <label for="date">Complete By:</label>
            <input type="date" name="date" id="date">

            <label for="priority">Priority:</label>
            <select name="priority" id="priority">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select> <br>

            <label for="category">Category:</label>
            <select name="category" id="category">
              <option value="work">Work</option>
              <option value="personal">Personal</option>
              <option value="study">Study</option>
            </select> <br>

            <input type="submit" value="Done" id="addTaskButton">
          </form>`;

    initQuill();
}

// Helper to init editor
function initQuill(content = "") {
    window.quill = new Quill('#description', {
        theme: 'snow',
        modules: { toolbar: [[{ header: [1, 2, false] }], ['bold', 'italic'], [{ list: 'ordered' }, { list: 'bullet' }]] },
        placeholder: 'Task description...'
    });
    window.quill.root.innerHTML = content;
    
    // Style fix
    const ql = document.querySelector('.ql-container');
    if(ql) { ql.style.border = '1px solid #D4A6A3'; ql.style.borderRadius = '0 0 5px 5px'; ql.style.backgroundColor = '#FFF9F5'; }
}

function closeForm() {
    document.body.querySelector('.background').classList.add("hidden");
}
function cancelTask() { closeForm(); }

// --- ADD NEW TASK ---
function addNewTask(event, userId) {
    event.preventDefault();
    
    const formData = {
        userId: userId,
        title: document.getElementById('title').value,
        description: window.quill.root.innerHTML,
        date: document.getElementById('date').value,
        priority: document.getElementById('priority').value, // ADDED
        category: document.getElementById('category').value
    };

    fetch('/newtask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(data => {
        if(data.error) return alert(data.error);
        location.reload(); // Simple reload to show new task (or manually append if you prefer)
    })
    .catch(console.error);
}

// --- OPEN EDIT FORM ---
document.querySelector('.content').addEventListener('click', (e) => {
    const editBtn = e.target.closest('.editTask');
    if (editBtn) {
        const taskDiv = editBtn.closest('.task');
        const taskId = taskDiv.getAttribute('data-id');
        
        // Get values from DOM
        const title = taskDiv.querySelector('.taskHead').innerText;
        const desc = taskDiv.querySelector('.taskDesc').innerHTML;
        const date = taskDiv.querySelector('.deadline').innerText;
        const category = taskDiv.querySelector('.categ').innerText;
        const priority = taskDiv.getAttribute('data-priority') || 'low'; // Get priority

        let align = document.body.querySelector('.align');
        document.body.querySelector('.background').classList.remove("hidden");

        // Same form structure as Add, but calls editNewTask
        align.innerHTML = `<form onsubmit="editNewTask(event, '${taskId}')" class="newTask">
            <div id="formBar">
              <span style="text-decoration: underline;">Edit Task</span>
              <button type="button" id="discard" onclick="cancelTask()">X</button>
            </div>

            <label>Title:-</label>
            <input type="text" id="title" value="${title}"> <br>

            <label>Description:-</label>
            <div id="description"></div>

            <label>Complete By:</label>
            <input type="date" id="date" value="${date}">

            <label>Priority:</label>
            <select id="priority">
              <option value="low" ${priority=='low'?'selected':''}>Low</option>
              <option value="medium" ${priority=='medium'?'selected':''}>Medium</option>
              <option value="high" ${priority=='high'?'selected':''}>High</option>
            </select> <br>

            <label>Category:</label>
            <select id="category">
              <option value="work" ${category.toLowerCase()=='work'?'selected':''}>Work</option>
              <option value="personal" ${category.toLowerCase()=='personal'?'selected':''}>Personal</option>
              <option value="study" ${category.toLowerCase()=='study'?'selected':''}>Study</option>
            </select> <br>

            <input type="submit" value="Update" id="addTaskButton">
          </form>`;

        initQuill(desc);
    }
});

// --- SUBMIT EDIT ---
function editNewTask(event, taskId) {
    event.preventDefault();

    const formData = {
        id: taskId,
        title: document.getElementById('title').value,
        description: window.quill.root.innerHTML,
        date: document.getElementById('date').value,
        priority: document.getElementById('priority').value, // ADDED
        category: document.getElementById('category').value
    };

    fetch('/edittask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(data => {
        if(data.error) return alert(data.error);
        location.reload(); // Reload to see changes
    })
    .catch(console.error);
}

// --- DELETE ---
function deleteTask(event) {
    event.preventDefault();
    const taskDiv = event.target.closest('.task');
    const taskId = taskDiv.getAttribute('data-id');

    if(confirm("Are you sure?")) {
        fetch('/deletetask', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: taskId })
        })
        .then(res => res.json())
        .then(data => {
            if(data.status === 'success') {
                taskDiv.remove();
            } else {
                alert("Failed to delete");
            }
        })
        .catch(console.error);
    }
}