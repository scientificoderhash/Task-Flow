function addItem(){
  const new_item = document.body.querySelector("#svg-add-item");
}


function addCategory() {
  const new_group = document.body.querySelector("#svg-add");
  const new_group_name = document.body.querySelector("#group-name")
  
  const gp = document.body.querySelectorAll(".gp");
  gp.forEach((e) => {
    e.style.display = "none";
  })

  const add_group = document.body.querySelector("#add_group");
  add_group.style.display = "block";

  add_group.focus();

  add_group.addEventListener("blur", () => {
    let group = add_group.value.trim();
    if(group){
      let li = document.createElement("li");
      li.innerHTML = `<p>${group}</p>` + `<svg onclick="addItem()" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" height="30px" id="svg-add-item" class="gp">
            <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z" />
          </svg>`;
      
      document.body.querySelector("#all_groups").appendChild(li);
    }
    add_group.value = "";
    add_group.style.display = "none";

    gp.forEach((e) => {
      e.style.display = "block";
    })
  })
}