import { Item } from '../src/models/itemModel';
import { ToDo, ToDoList } from '../src/models/listModel';
import { ListType } from '../src/types/listType';
import { ModeType } from '../src/types/modeType';
import { changeProp, changeProps } from '../src/methods/changePropMethods';
import { store, getMode, storeMode, getLastList, storeLastList } from '../src/methods/localStorageMethods';

import * as svg from '../res/svg';
import * as color from '../res/color';
import * as customStyle from '../res/style';
import * as url from '../res/url'

let toDos: ToDo = new ToDoList();             
let currentList = toDos.items;
let alreadyCompleted: boolean = false;
let mode: ModeType = getMode();

let addToDo = document.getElementById("addToDo") as HTMLInputElement;
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

let checkList = document.getElementsByClassName("check");
let itemClc = document.getElementsByClassName("item");
let pchecked = document.getElementsByClassName("to-do-checked");
let pList = document.getElementsByTagName("p");

switchModeIcon.addEventListener('click', () => {
    if (mode == "DARK") {
        mode = "LIGHT";
        loadMode();
    }
    else {
        mode = "DARK";
        loadMode();
    }
});

addToDo.addEventListener('keyup', (event: KeyboardEvent) => {
    let item: Item = {
        text: addToDo.value.trim(),
        isCompleted: false,
    } 

    if (alreadyCompleted) {
        if (item.text != "") {
            item.isCompleted = true;
        }
        else {
            alreadyCompleted = false;
            removeCheckStyles();
        }
    }

    if (event.key == "Enter" && item.text != "") {
        toDos.items.push(item);
        addToDo.value = "";
        alreadyCompleted = false;
        store(toDos);
        removeCheckStyles();
        showLastSavedList();
    }  
    if (addToDo.value != "") {
        fClear.style.display = "block";
    }
    else {
        fClear.style.display = "none";
    }
});

fCheck.addEventListener('click', () => {
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

fCheck.addEventListener('mouseover', () => {
    if (!alreadyCompleted) {
        fCheck.style.borderColor = color.BRIGHT_BLUE;
    }
});

fCheck.addEventListener('mouseout', () => {
    if (!alreadyCompleted) {
        if (mode == "LIGHT") {
            fCheck.style.borderColor = color.LIGHT_GRAYISH_BLUE_LT;
        }
        else {
            fCheck.style.borderColor = color.VERY_DARK_GRAYISH_BLUE_DT;
        }
    }
});

fClear.addEventListener('click', () => {
    addToDo.value = "";
    alreadyCompleted = false;
    removeCheckStyles();
    fClear.style.display = "none";
});

allbtn.addEventListener('click', () => {
    showAll();
});

activebtn.addEventListener('click', () => {
    showActive();
});

completedbtn.addEventListener('click', () => {
    showCompleted();
});

clearCompletedbtn.addEventListener('click', () => {
    clearCompleted();
});

let createItem = (item: Item) => {
    let li: HTMLLIElement = document.createElement("li");
    li.classList.add("item");

    let spanCheck: HTMLSpanElement = document.createElement("span");
    spanCheck.classList.add("check");

    let spanClear: HTMLSpanElement = document.createElement("span");
    spanClear.classList.add("clear");

    let p = document.createElement("p");
    if (item.isCompleted) {
        p.classList.add("to-do-checked");
        isChecked(spanCheck);
    }
    else {
        p.classList.add("to-do-not-checked");
        isNotChecked(spanCheck);
    }
    p.innerText = item.text;

    spanCheck.addEventListener('mouseover', () => {
        if (!item.isCompleted) {
            spanCheck.style.borderColor = color.BRIGHT_BLUE;
        }
    });

    spanCheck.addEventListener('mouseout', () => {
        if (!item.isCompleted) {
            if (mode == "LIGHT") {
                spanCheck.style.borderColor = color.LIGHT_GRAYISH_BLUE_LT;
            }
            else {
                spanCheck.style.borderColor = color.VERY_DARK_GRAYISH_BLUE_DT;
            }
        }
    });

    spanCheck.addEventListener('click', () => {
        if (!item.isCompleted) {
            p.classList.replace("to-do-not-checked", "to-do-checked");
            item.isCompleted = true;
            isChecked(spanCheck);
            store(toDos);
        }
        else {
            p.classList.replace("to-do-checked", "to-do-not-checked");
            item.isCompleted = false;
            isNotChecked(spanCheck);
            store(toDos);
        }
        showLastSavedList();
    });

    spanClear.addEventListener('click', () => {
        let index = toDos.items.indexOf(item);
        toDos.items.splice(index, 1);
        store(toDos);

        ul.removeChild(li);
        showLastSavedList();
    });

    spanClear.innerHTML = svg.crossIcon;
    li.append(spanCheck, p, spanClear);
    ul.prepend(li);
}

let getSavedList = () => {
    while (ul.childElementCount != 1) {
        ul.removeChild(ul.firstChild);
    }
    currentList.forEach(item => {
        createItem(item);
    });

    loadMode();
}

let updateNum = () => {
    itemsNum.innerText = currentList.length + " items left"; 
}

let showAll = () => {
    currentList = toDos.items;
    storeLastList("ALL");
    getSavedList();
    updateNum();
    ChangeTabListMode();
}

let showActive = () => {
    let actives = [];
    currentList = toDos.items;
    currentList.forEach(item => {
        if (!item.isCompleted) {
            actives.push(item);
        }
    });
    currentList = actives;
    storeLastList("ACTIVE");
    getSavedList();
    updateNum();
    ChangeTabListMode();
}

let showCompleted = () => {
    let completedList = [];
    currentList = toDos.items;
    currentList.forEach(item => {
        if (item.isCompleted) {
            completedList.push(item);
        }
    });
    currentList = completedList;
    storeLastList("COMPLETED");
    getSavedList();
    updateNum();
    ChangeTabListMode();
}

let clearCompleted = () => {
    let lastList: ListType = getLastList();
    currentList = toDos.items;
    showActive();
    toDos.items = currentList;
    storeLastList(lastList);
    showLastSavedList();
    store(toDos);
}

let showLastSavedList = () => {
    switch (getLastList()) {
        case ("ALL"):
            showAll();
            break;
        case ("ACTIVE"):
            showActive();
            break;
        case ("COMPLETED"):
            showCompleted();
            break;
    }
}

let loadMode = () => {
    if (mode == "LIGHT") {
        switchModeIcon.innerHTML = svg.moonIcon;
        replaceClassList();
        storeMode(mode);

        changeProp(addToDo, "color", color.VERY_DARK_GRAYISH_BLUE_LT);
        changeProp(body, "background-color", color.VERY_LIGHT_GRAY);
        changeProp(bg, "background-image", url.LT_URL);
        changeProp(inputContainer, "background-color", color.WHITE);
        changeProp(ul, "background-color", color.WHITE);
        changeProp(ul, "box-shadow", customStyle.BOX_SHADOW_LT);

        changeProps(checkList, "border-color", color.LIGHT_GRAYISH_BLUE_LT);
        changeProps(itemClc, "border-bottom", customStyle.ITEM_BORDER_BOTTOM_LT);
        changeProps(pList, "color", color.VERY_DARK_GRAYISH_BLUE_LT);
        changeProps(pchecked, "color", color.LIGHT_GRAYISH_BLUE_LT);
        changeProps(pchecked, "text-decoration-color", color.LIGHT_GRAYISH_BLUE_LT);
    }
    else {
        switchModeIcon.innerHTML = svg.sunIcon;
        replaceClassList();
        storeMode(mode);
        
        changeProp(addToDo, "color", color.LIGHT_GRAYISH_BLUE);
        changeProp(body, "background-color", color.VERY_DARK_BLUE);
        changeProp(bg, "background-image", url.DT_URL);
        changeProp(inputContainer, "background-color", color.VERY_DARK_DESATURATED_BLUE);
        changeProp(ul, "background-color", color.VERY_DARK_DESATURATED_BLUE);
        changeProp(ul, "box-shadow", customStyle.BOX_SHADOW_DT);

        changeProps(checkList, "border-color", color.VERY_DARK_GRAYISH_BLUE_DT);
        changeProps(itemClc, "border-bottom", customStyle.ITEM_BORDER_BOTTOM_DT);
        changeProps(pList, "color", color.LIGHT_GRAYISH_BLUE);
        changeProps(pchecked, "color",color.DARK_GRAYISH_BLUE);
        changeProps(pchecked, "text-decoration-color", color.DARK_GRAYISH_BLUE);
    }

    inputChecked();
    ChangeTabListMode();
}

let ChangeTabListMode = () => {
    if (mode == "LIGHT") {
        changeProp(itemsNum, "color", color.DARK_GRAYISH_BLUE_LT);
        changeProp(allbtn, "color", color.DARK_GRAYISH_BLUE_LT);
        changeProp(activebtn, "color", color.DARK_GRAYISH_BLUE_LT);
        changeProp(completedbtn, "color", color.DARK_GRAYISH_BLUE_LT);
        changeProp(clearCompletedbtn, "color", color.DARK_GRAYISH_BLUE_LT);
    }
    else {
        changeProp(itemsNum, "color", color.VERY_DARK_GRAYISH_BLUE_DT);
        changeProp(allbtn, "color", color.VERY_DARK_GRAYISH_BLUE_DT);
        changeProp(activebtn, "color", color.VERY_DARK_GRAYISH_BLUE_DT);
        changeProp(completedbtn, "color", color.VERY_DARK_GRAYISH_BLUE_DT);
        changeProp(clearCompletedbtn, "color", color.VERY_DARK_GRAYISH_BLUE_DT);
    }

    switch (getLastList()) {
        case ("ALL"): 
            changeProp(allbtn, "color", color.BRIGHT_BLUE, 'important');
            break;
        case ("ACTIVE"): 
            changeProp(activebtn, "color", color.BRIGHT_BLUE, 'important');
            break;
        case ("COMPLETED"): 
            changeProp(completedbtn, "color", color.BRIGHT_BLUE, 'important');
    }
}

let isChecked = (elem) => {
    elem.innerHTML = svg.checkIcon;
    changeProp(elem, "background", customStyle.CHECK_BACKGROUND);
    changeProp(elem, "width", "22px");
    changeProp(elem, "height", "22px");
    changeProp(elem, "border", "transparent");
}

let isNotChecked = (elem) => {
    elem.innerHTML = "";
    changeProp(elem, "background", "transparent");
    changeProp(elem, "width", "19px");
    changeProp(elem, "height", "19px");
    if (mode == "LIGHT") {
        changeProp(elem, "border", customStyle.CHECK_BORDER_LT);
    }
    else {
        changeProp(elem, "border", customStyle.CHECK_BORDER_DT);
    }
}

let applyCheckStyles = () => {
    addToDo.classList.add("to-do-checked");
    inputChecked();
    isChecked(fCheck);
}

let removeCheckStyles = () => {
    addToDo.classList.remove("to-do-checked");
    inputChecked();
    isNotChecked(fCheck);
    if (mode == "LIGHT") {
        fCheck.style.border = customStyle.CHECK_BORDER_LT;
    }
    else {
        fCheck.style.border = customStyle.CHECK_BORDER_DT;
    }
}

let inputChecked = () => {
    if (alreadyCompleted) {
        if (mode == "LIGHT") {
            changeProp(addToDo, "color", color.LIGHT_GRAYISH_BLUE_LT, 'important');
            changeProp(addToDo, "text-decoration-color", color.LIGHT_GRAYISH_BLUE_LT, 'important');
        }
        else {
            changeProp(addToDo, "color", color.DARK_GRAYISH_BLUE, 'important');
            changeProp(addToDo, "text-decoration-color", color.DARK_GRAYISH_BLUE, 'important');
        }   
    }
    else {
        if (mode == "LIGHT") {
            changeProp(addToDo, "color", color.VERY_DARK_GRAYISH_BLUE_LT, 'important');
        }
        else {
            changeProp(addToDo, "color", color.LIGHT_GRAYISH_BLUE, 'important');
        } 
    }
}

let replaceClassList = () => {
    if (mode == "LIGHT") {
        addToDo.classList.replace("input-dark", "input-light");
        allbtn.classList.replace("button-class", "button-class-light");
        activebtn.classList.replace("button-class", "button-class-light");
        completedbtn.classList.replace("button-class", "button-class-light");
        clearCompletedbtn.classList.replace("button-class", "button-class-light");
    }
    else {
        addToDo.classList.replace("input-light", "input-dark");
        allbtn.classList.replace("button-class-light", "button-class");
        activebtn.classList.replace("button-class-light", "button-class");
        completedbtn.classList.replace("button-class-light", "button-class");
        clearCompletedbtn.classList.replace("button-class-light", "button-class");
    }
}

showLastSavedList();
