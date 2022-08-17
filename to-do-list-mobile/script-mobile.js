const checkIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="11" height="9"><path fill="none" stroke="#FFF" stroke-width="2" d="M1 4.304L3.696 7l6-6"/></svg>`;
const moonIcon = `<path fill="#FFF" fill-rule="evenodd" d="M13 0c.81 0 1.603.074 2.373.216C10.593 1.199 7 5.43 7 10.5 7 16.299 11.701 21 17.5 21c2.996 0 5.7-1.255 7.613-3.268C23.22 22.572 18.51 26 13 26 5.82 26 0 20.18 0 13S5.82 0 13 0z"/>`;
const sunIcon = `<path fill="#FFF" fill-rule="evenodd" d="M13 21a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-5.657-2.343a1 1 0 010 1.414l-2.121 2.121a1 1 0 01-1.414-1.414l2.12-2.121a1 1 0 011.415 0zm12.728 0l2.121 2.121a1 1 0 01-1.414 1.414l-2.121-2.12a1 1 0 011.414-1.415zM13 8a5 5 0 110 10 5 5 0 010-10zm12 4a1 1 0 110 2h-3a1 1 0 110-2h3zM4 12a1 1 0 110 2H1a1 1 0 110-2h3zm18.192-8.192a1 1 0 010 1.414l-2.12 2.121a1 1 0 01-1.415-1.414l2.121-2.121a1 1 0 011.414 0zm-16.97 0l2.121 2.12A1 1 0 015.93 7.344L3.808 5.222a1 1 0 011.414-1.414zM13 0a1 1 0 011 1v3a1 1 0 11-2 0V1a1 1 0 011-1z"/>`;
const crossIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"><path fill="#494C6B" fill-rule="evenodd" d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z"/></svg>`;

let toDos = JSON.parse(localStorage.getItem("toDos")) || [];                    
let currentList = toDos;
let num = toDos.length;
let lastList = JSON.parse(localStorage.getItem("lastList")) || "all";

let addToDo = document.getElementById("addToDo");
let allbtn = document.getElementById("all");
let activebtn = document.getElementById("active");
let completedbtn = document.getElementById("completed");
let clearCompletedbtn = document.getElementById("clearCompleted");
let itemsNum = document.getElementById("toDoNum");
let ul = document.getElementById("toDoList");
let fCheck = document.getElementById("firstCheck");
let fClear = document.getElementById("firstClear");
let inputContainer = document.getElementById("inputContainer");
let switchModeIcon = document.getElementById("switch-mode-icon");
let body = document.getElementById("wrapper");
let bg = document.getElementById("background");
let tabList = document.getElementById("tabList");
let lastTabList = document.getElementById("lastTabList");
let checkList = document.getElementsByClassName("check");
let itemClc = document.getElementsByClassName("item");
let pchecked = document.getElementsByClassName("to-do-checked");
let pList = document.getElementsByTagName("p");

let alreadyCompleted = false;
let mode = localStorage.getItem("mode") || "dark";

switchModeIcon.addEventListener('click', () => {
    if (mode == "dark") {
        mode = "light";
        loadMode();
    }
    else {
        mode = "dark";
        loadMode();
    }
});

addToDo.addEventListener('keyup', function(event) {
    let item = {
        text: addToDo.value.trim(),
        completed: false,
    } 

    if (alreadyCompleted) {
        if (item.text != "") {
            item.completed = true;
        }
        else {
            alreadyCompleted = false;
            removeCheckStyles();
        }
    }

    if (event.key == "Enter" && item.text != "") {
        toDos.push(item);
        addToDo.value = "";
        alreadyCompleted = false;
        localStorage.setItem("toDos", JSON.stringify(toDos));
        removeCheckStyles();
        showLastSavedList();
    }   
    else {
        if (addToDo.value != "") {
            fClear.style.display = "block";
        }
        else {
            fClear.style.display = "none";
        }
    }
});

fCheck.addEventListener('click', function() {
    if (addToDo.value.trim() != "") {
        if (!alreadyCompleted) {
            alreadyCompleted = true;
            applyCheckStyles();
        }
        else {
            alreadyCompleted = false;
            removeCheckStyles();
        }
    }
});

fCheck.addEventListener('mouseover', function() {
    if (!alreadyCompleted) {
        fCheck.style.borderColor = "var(--Bright-Blue)";
    }
});

fCheck.addEventListener('mouseout', function() {
    if (!alreadyCompleted) {
        if (mode == "light") {
            fCheck.style.borderColor = "var(--Light-Grayish-Blue-lt)";
        }
        else {
            fCheck.style.borderColor = "var(--Very-Dark-Grayish-Blue-dt)";
        }
    }
});

fClear.addEventListener('click', function() {
    addToDo.value = "";
    alreadyCompleted = false;
    removeCheckStyles();
});

let createItem = function(item) {
    let li = document.createElement("li");
    li.classList.add("item");

    let spanCheck = document.createElement("span");
    spanCheck.classList.add("check");

    let spanClear = document.createElement("span");
    spanClear.classList.add("clear");

    let p = document.createElement("p");
    if (item.completed) {
        p.classList.add("to-do-checked");
        isChecked(spanCheck);
    }
    else {
        p.classList.add("to-do-not-checked");
        isNotChecked(spanCheck);
    }
    p.innerText = item.text;

    spanCheck.addEventListener('mouseover', function() {
        if (!item.completed) {
            spanCheck.style.borderColor = "var(--Bright-Blue)";
        }
    });

    spanCheck.addEventListener('mouseout', function() {
        if (!item.completed) {
            if (mode == "light") {
                spanCheck.style.borderColor = "var(--Light-Grayish-Blue-lt)";
            }
            else {
                spanCheck.style.borderColor = "var(--Very-Dark-Grayish-Blue-dt)";
            }
        }
    });

    spanCheck.addEventListener('click', function() {
        if (!item.completed) {
            p.classList.replace("to-do-not-checked", "to-do-checked");
            item.completed = true;
            isChecked(spanCheck);
            localStorage.setItem("toDos", JSON.stringify(toDos));
        }
        else {
            p.classList.replace("to-do-checked", "to-do-not-checked");
            item.completed = false;
            isNotChecked(spanCheck);
            localStorage.setItem("toDos", JSON.stringify(toDos));
        }
        showLastSavedList();
    });

    spanClear.addEventListener('click', function() {
        let index = toDos.indexOf(item);
        toDos.splice(index, 1);
        localStorage.setItem("toDos", JSON.stringify(toDos));

        ul.removeChild(li);
        showLastSavedList();
    });

    spanClear.innerHTML = crossIcon;
    li.append(spanCheck, p, spanClear);
    ul.prepend(li);
}

let getSavedList = function() {
    let itemList = document.getElementsByClassName("item");
    delete itemList[0];
    
    while (itemList.length != 0) {
        ul.removeChild(itemList[0]);
        delete itemList[0];
    }
    
    currentList.forEach(item => {
        createItem(item);
    });

    loadMode();
}

let updateNum = function() {
    num = currentList.length;
    itemsNum.innerText = num + " items left"; 
}

let showAll = function() {
    currentList = toDos;
    lastList = "all";
    getSavedList();
    updateNum();
    ChangeTabListMode();
    localStorage.setItem("lastList", JSON.stringify(lastList));
}

let showActive = function() {
    let actives = [];
    currentList = toDos;
    currentList.forEach(item => {
        if (!item.completed) {
            actives.push(item);
        }
    });
    currentList = actives;
    lastList = "active";
    getSavedList();
    updateNum();
    ChangeTabListMode();
    localStorage.setItem("lastList", JSON.stringify(lastList));
}

let showCompleted = function() {
    let completedList = [];
    currentList = toDos;
    currentList.forEach(item => {
        if (item.completed) {
            completedList.push(item);
        }
    });
    currentList = completedList;
    lastList = "completed";
    getSavedList();
    updateNum();
    ChangeTabListMode();
    localStorage.setItem("lastList", JSON.stringify(lastList));
}

let clearCompleted = function() {
    let temp = lastList;
    currentList = toDos;
    showActive();
    toDos = currentList;
    lastList = temp;
    showLastSavedList();
    localStorage.setItem("toDos", JSON.stringify(toDos));
}

let showLastSavedList = function() {
    if (lastList == "all") {
        showAll();
    }
    else if (lastList == "active") {
        showActive();
    }
    else {
        showCompleted();
    }
}

let loadMode = function () {
    if (mode == "light") {
        switchModeIcon.innerHTML = moonIcon;
        addToDo.classList.replace("input-dark", "input-light");
        allbtn.classList.replace("button-class", "button-class-light");
        activebtn.classList.replace("button-class", "button-class-light");
        completedbtn.classList.replace("button-class", "button-class-light");
        clearCompletedbtn.classList.replace("button-class", "button-class-light");
        localStorage.setItem("mode", mode);

        changeProp(addToDo, "color", "var(--Very-Dark-Grayish-Blue-lt)")
        changeProp(body, "background-color", "var(--Very-Light-Gray)");
        changeProp(bg, "background-image", "var(--Light-Theme-URL)");
        changeProp(inputContainer, "background-color", "white");
        changeProp(ul, "background-color", "white");
        changeProp(ul, "box-shadow", "0px 30px 30.0px 5.0px var(--Very-Light-Grayish-Blue)");
        changeProp(lastTabList, "background-color", "white");
        changeProp(lastTabList, "box-shadow", "0px 10px 20.0px 5.0px var(--Very-Light-Grayish-Blue)");
        changeProps(checkList, "border-color", "var(--Light-Grayish-Blue-lt)");
        changeProps(itemClc, "border-bottom", "1px solid var(--Light-Grayish-Blue-lt)");
        changeProps(pList, "color", "var(--Very-Dark-Grayish-Blue-lt)");
        changeProps(pchecked, "color", "var(--Light-Grayish-Blue-lt)");
        changeProps(pchecked, "text-decoration-color", "var(--Light-Grayish-Blue-lt)");
    }
    else {
        switchModeIcon.innerHTML = sunIcon;
        addToDo.classList.replace("input-light", "input-dark");
        allbtn.classList.replace("button-class-light", "button-class");
        activebtn.classList.replace("button-class-light", "button-class");
        completedbtn.classList.replace("button-class-light", "button-class");
        clearCompletedbtn.classList.replace("button-class-light", "button-class");
        localStorage.setItem("mode", mode);

        changeProp(addToDo, "color", "var(--Light-Grayish-Blue)");
        changeProp(body, "background-color", "var(--Very-Dark-Blue)");
        changeProp(bg, "background-image", "var(--Dark-Theme-URL)");
        changeProp(inputContainer, "background-color", "var(--Very-Dark-Desaturated-Blue)");
        changeProp(ul, "background-color", "var(--Very-Dark-Desaturated-Blue)");
        changeProp(ul, "box-shadow", "0px 10px 30.0px 4.0px hsl(0deg 0% 0% / 0.36)");
        changeProp(lastTabList, "background-color", "var(--Very-Dark-Desaturated-Blue)");
        changeProp(lastTabList, "box-shadow", "0px 10px 30.0px 4.0px hsl(0deg 0% 0% / 0.36)");
        changeProps(checkList, "border-color", "var(--Very-Dark-Grayish-Blue-dt)");
        changeProps(itemClc, "border-bottom", "1px solid var(--Very-Dark-Grayish-Blue-dt)");
        changeProps(pList, "color", "var(--Light-Grayish-Blue)");
        changeProps(pchecked, "color", "var(--Dark-Grayish-Blue)");
        changeProps(pchecked, "text-decoration-color", "var(--Dark-Grayish-Blue)");
    }

    inputChecked();
    ChangeTabListMode();
}

let ChangeTabListMode = () => {
    if (mode == "light") {
        changeProp(itemsNum, "color", "var(--Dark-Grayish-Blue-lt)");
        changeProp(allbtn, "color", "var(--Dark-Grayish-Blue-lt)");
        changeProp(activebtn, "color", "var(--Dark-Grayish-Blue-lt)");
        changeProp(completedbtn, "color", "var(--Dark-Grayish-Blue-lt)");
        changeProp(clearCompletedbtn, "color", "var(--Dark-Grayish-Blue-lt)");
    }
    else {
        changeProp(itemsNum, "color", "var(--Very-Dark-Grayish-Blue-dt)");
        changeProp(allbtn, "color", "var(--Very-Dark-Grayish-Blue-dt)");
        changeProp(activebtn, "color", "var(--Very-Dark-Grayish-Blue-dt)");
        changeProp(completedbtn, "color", "var(--Very-Dark-Grayish-Blue-dt)");
        changeProp(clearCompletedbtn, "color", "var(--Very-Dark-Grayish-Blue-dt)");
    }

    switch (lastList) {
        case ("all"): 
            changeProp(allbtn, "color", "var(--Bright-Blue)", 'important');
            break;
        case ("active"): 
            changeProp(activebtn, "color", "var(--Bright-Blue)", 'important');
            break;
        case ("completed"): 
            changeProp(completedbtn, "color", "var(--Bright-Blue)", 'important');
    }
}

let isChecked = (elem) => {
    elem.innerHTML = checkIcon;
    changeProp(elem, "background", "var(--Check-Background)");
    changeProp(elem, "width", "22px");
    changeProp(elem, "height", "22px");
    changeProp(elem, "border", "transparent");
}

let isNotChecked = (elem) => {
    elem.innerHTML = "";
    changeProp(elem, "background", "transparent");
    changeProp(elem, "width", "19px");
    changeProp(elem, "height", "19px");
    if (mode == "light") {
        changeProp(elem, "2px solid var(--Light-Grayish-Blue-lt)");
    }
    else {
        changeProp(elem, "2px solid var(--Very-Dark-Grayish-Blue-dt)");
    }
}

let applyCheckStyles = function() {
    addToDo.classList.add("to-do-checked");
    inputChecked();
    isChecked(fCheck);
}

let removeCheckStyles = function() {
    addToDo.classList.remove("to-do-checked");
    inputChecked();
    isNotChecked(fCheck);
    if (mode == "light") {
        fCheck.style.border = "2px solid var(--Light-Grayish-Blue-lt)";
    }
    else {
        fCheck.style.border = "2px solid var(--Very-Dark-Grayish-Blue-dt)";
    }
}

let inputChecked = () => {
    if (alreadyCompleted) {
        if (mode == "light") {
            changeProp(addToDo, "color", "var(--Light-Grayish-Blue-lt)", 'important');
            changeProp(addToDo, "text-decoration-color", "var(--Light-Grayish-Blue-lt)", 'important');
        }
        else {
            changeProp(addToDo, "color", "var(--Dark-Grayish-Blue)", 'important');
            changeProp(addToDo, "text-decoration-color", "var(--Dark-Grayish-Blue)", 'important');
        }   
    }
    else {
        if (mode == "light") {
            changeProp(addToDo, "color", "var(--Very-Dark-Grayish-Blue-lt)", 'important');
        }
        else {
            changeProp(addToDo, "color", "var(--Light-Grayish-Blue)", 'important');
        } 
    }
}

let changeProps = (elems, prop, value) => {
    for(let i = 0; i < elems.length; i++) {
        changeProp(elems[i], prop, value);
    }
}

let changeProp = (elem, prop, value, ...importance) => {
    elem.style.setProperty(prop, value, importance);
}

showLastSavedList();
