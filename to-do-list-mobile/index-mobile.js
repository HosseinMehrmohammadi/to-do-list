"use strict";
export const __esModule = true;
import { ToDoList } from "http://127.0.0.1:8080/src/models/listModel.js";
import { changeProp, changeProps } from "http://127.0.0.1:8080/src/methods/changePropMethods.js";
import { getMode, store, storeLastList, getLastList, storeMode } from "http://127.0.0.1:8080/src/methods/localStorageMethods.js";
import { crossIcon, moonIcon, sunIcon, checkIcon } from "http://127.0.0.1:8080/res/svg.js";
import { BRIGHT_BLUE, LIGHT_GRAYISH_BLUE_LT, VERY_DARK_GRAYISH_BLUE_DT, VERY_DARK_GRAYISH_BLUE_LT, VERY_LIGHT_GRAY, WHITE, LIGHT_GRAYISH_BLUE, VERY_DARK_BLUE, VERY_DARK_DESATURATED_BLUE, DARK_GRAYISH_BLUE, DARK_GRAYISH_BLUE_LT } from "http://127.0.0.1:8080/res/color.js";
import { BOX_SHADOW_LT, TABLIST_BOX_SHADOW_LT, ITEM_BORDER_BOTTOM_LT, BOX_SHADOW_DT, ITEM_BORDER_BOTTOM_DT, CHECK_BACKGROUND, CHECK_BORDER_LT, CHECK_BORDER_DT } from "http://127.0.0.1:8080/res/style.js";
import { LT_URL, DT_URL } from "http://127.0.0.1:8080/res/url.js";
var toDos = new ToDoList();
var currentList = toDos.items;
var alreadyCompleted = false;
var mode = (0, getMode)();
var addToDo = document.getElementById("addToDo");
var allbtn = document.getElementById("all");
var activebtn = document.getElementById("active");
var completedbtn = document.getElementById("completed");
var clearCompletedbtn = document.getElementById("clearCompleted");
var itemsNum = document.getElementById("toDoNum");
var ul = document.getElementById("toDoList");
var lastTabList = document.getElementById("lastTabList");
var fCheck = document.getElementById("firstCheck");
var fClear = document.getElementById("firstClear");
var inputContainer = document.getElementById("inputContainer");
var switchModeIcon = document.getElementById("switch-mode-icon");
var body = document.getElementById("wrapper");
var bg = document.getElementById("background");
var checkList = document.getElementsByClassName("check");
var itemClc = document.getElementsByClassName("item");
var pchecked = document.getElementsByClassName("to-do-checked");
var pList = document.getElementsByTagName("p");
switchModeIcon.addEventListener('click', function () {
    if (mode == "DARK") {
        mode = "LIGHT";
        loadMode();
    }
    else {
        mode = "DARK";
        loadMode();
    }
});
addToDo.addEventListener('keyup', function (event) {
    var item = {
        text: addToDo.value.trim(),
        isCompleted: false
    };
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
        (0, store)(toDos);
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
fCheck.addEventListener('click', function () {
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
fCheck.addEventListener('mouseover', function () {
    if (!alreadyCompleted) {
        fCheck.style.borderColor = BRIGHT_BLUE;
    }
});
fCheck.addEventListener('mouseout', function () {
    if (!alreadyCompleted) {
        if (mode == "LIGHT") {
            fCheck.style.borderColor = LIGHT_GRAYISH_BLUE_LT;
        }
        else {
            fCheck.style.borderColor = VERY_DARK_GRAYISH_BLUE_DT;
        }
    }
});
fClear.addEventListener('click', function () {
    addToDo.value = "";
    alreadyCompleted = false;
    removeCheckStyles();
    fClear.style.display = "none";
});
allbtn.addEventListener('click', function () {
    showAll();
});
activebtn.addEventListener('click', function () {
    showActive();
});
completedbtn.addEventListener('click', function () {
    showCompleted();
});
clearCompletedbtn.addEventListener('click', function () {
    clearCompleted();
});
var createItem = function (item) {
    var li = document.createElement("li");
    li.classList.add("item");
    var spanCheck = document.createElement("span");
    spanCheck.classList.add("check");
    var spanClear = document.createElement("span");
    spanClear.classList.add("clear");
    var p = document.createElement("p");
    if (item.isCompleted) {
        p.classList.add("to-do-checked");
        isChecked(spanCheck);
    }
    else {
        p.classList.add("to-do-not-checked");
        isNotChecked(spanCheck);
    }
    p.innerText = item.text;
    spanCheck.addEventListener('mouseover', function () {
        if (!item.isCompleted) {
            spanCheck.style.borderColor = BRIGHT_BLUE;
        }
    });
    spanCheck.addEventListener('mouseout', function () {
        if (!item.isCompleted) {
            if (mode == "LIGHT") {
                spanCheck.style.borderColor = LIGHT_GRAYISH_BLUE_LT;
            }
            else {
                spanCheck.style.borderColor = VERY_DARK_GRAYISH_BLUE_DT;
            }
        }
    });
    spanCheck.addEventListener('click', function () {
        if (!item.isCompleted) {
            p.classList.replace("to-do-not-checked", "to-do-checked");
            item.isCompleted = true;
            isChecked(spanCheck);
            (0, store)(toDos);
        }
        else {
            p.classList.replace("to-do-checked", "to-do-not-checked");
            item.isCompleted = false;
            isNotChecked(spanCheck);
            (0, store)(toDos);
        }
        showLastSavedList();
    });
    spanClear.addEventListener('click', function () {
        var index = toDos.items.indexOf(item);
        toDos.items.splice(index, 1);
        (0, store)(toDos);
        ul.removeChild(li);
        showLastSavedList();
    });
    spanClear.innerHTML = crossIcon;
    li.append(spanCheck, p, spanClear);
    ul.prepend(li);
};
var getSavedList = function () {
    while (ul.childElementCount != 1) {
        ul.removeChild(ul.firstChild);
    }
    currentList.forEach(function (item) {
        createItem(item);
    });
    loadMode();
};
var updateNum = function () {
    itemsNum.innerText = currentList.length + " items left";
};
var showAll = function () {
    currentList = toDos.items;
    (0, storeLastList)("ALL");
    getSavedList();
    updateNum();
    ChangeTabListMode();
};
var showActive = function () {
    var actives = [];
    currentList = toDos.items;
    currentList.forEach(function (item) {
        if (!item.isCompleted) {
            actives.push(item);
        }
    });
    currentList = actives;
    (0, storeLastList)("ACTIVE");
    getSavedList();
    updateNum();
    ChangeTabListMode();
};
var showCompleted = function () {
    var completedList = [];
    currentList = toDos.items;
    currentList.forEach(function (item) {
        if (item.isCompleted) {
            completedList.push(item);
        }
    });
    currentList = completedList;
    (0, storeLastList)("COMPLETED");
    getSavedList();
    updateNum();
    ChangeTabListMode();
};
var clearCompleted = function () {
    var lastList = (0, getLastList)();
    currentList = toDos.items;
    showActive();
    toDos.items = currentList;
    (0, storeLastList)(lastList);
    showLastSavedList();
    (0, store)(toDos);
};
var showLastSavedList = function () {
    switch ((0, getLastList)()) {
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
};
var loadMode = function () {
    if (mode == "LIGHT") {
        switchModeIcon.innerHTML = moonIcon;
        replaceClassList();
        (0, storeMode)(mode);
        (0, changeProp)(addToDo, "color", VERY_DARK_GRAYISH_BLUE_LT);
        (0, changeProp)(body, "background-color", VERY_LIGHT_GRAY);
        (0, changeProp)(bg, "background-image", LT_URL);
        (0, changeProp)(inputContainer, "background-color", WHITE);
        (0, changeProp)(ul, "background-color", WHITE);
        (0, changeProp)(ul, "box-shadow", BOX_SHADOW_LT);
        (0, changeProp)(lastTabList, "background-color", WHITE);
        (0, changeProp)(lastTabList, "box-shadow", TABLIST_BOX_SHADOW_LT);
        (0, changeProps)(checkList, "border-color", LIGHT_GRAYISH_BLUE_LT);
        (0, changeProps)(itemClc, "border-bottom", ITEM_BORDER_BOTTOM_LT);
        (0, changeProps)(pList, "color", VERY_DARK_GRAYISH_BLUE_LT);
        (0, changeProps)(pchecked, "color", LIGHT_GRAYISH_BLUE_LT);
        (0, changeProps)(pchecked, "text-decoration-color", LIGHT_GRAYISH_BLUE_LT);
    }
    else {
        switchModeIcon.innerHTML = sunIcon;
        replaceClassList();
        (0, storeMode)(mode);
        (0, changeProp)(addToDo, "color", LIGHT_GRAYISH_BLUE);
        (0, changeProp)(body, "background-color", VERY_DARK_BLUE);
        (0, changeProp)(bg, "background-image", DT_URL);
        (0, changeProp)(inputContainer, "background-color", VERY_DARK_DESATURATED_BLUE);
        (0, changeProp)(ul, "background-color", VERY_DARK_DESATURATED_BLUE);
        (0, changeProp)(ul, "box-shadow", BOX_SHADOW_DT);
        (0, changeProp)(lastTabList, "background-color", VERY_DARK_DESATURATED_BLUE);
        (0, changeProp)(lastTabList, "box-shadow", BOX_SHADOW_DT);
        (0, changeProps)(checkList, "border-color", VERY_DARK_GRAYISH_BLUE_DT);
        (0, changeProps)(itemClc, "border-bottom", ITEM_BORDER_BOTTOM_DT);
        (0, changeProps)(pList, "color", LIGHT_GRAYISH_BLUE);
        (0, changeProps)(pchecked, "color", DARK_GRAYISH_BLUE);
        (0, changeProps)(pchecked, "text-decoration-color", DARK_GRAYISH_BLUE);
    }
    inputChecked();
    ChangeTabListMode();
};
var ChangeTabListMode = function () {
    if (mode == "LIGHT") {
        (0, changeProp)(itemsNum, "color", DARK_GRAYISH_BLUE_LT);
        (0, changeProp)(allbtn, "color", DARK_GRAYISH_BLUE_LT);
        (0, changeProp)(activebtn, "color", DARK_GRAYISH_BLUE_LT);
        (0, changeProp)(completedbtn, "color", DARK_GRAYISH_BLUE_LT);
        (0, changeProp)(clearCompletedbtn, "color", DARK_GRAYISH_BLUE_LT);
    }
    else {
        (0, changeProp)(itemsNum, "color", VERY_DARK_GRAYISH_BLUE_DT);
        (0, changeProp)(allbtn, "color", VERY_DARK_GRAYISH_BLUE_DT);
        (0, changeProp)(activebtn, "color", VERY_DARK_GRAYISH_BLUE_DT);
        (0, changeProp)(completedbtn, "color", VERY_DARK_GRAYISH_BLUE_DT);
        (0, changeProp)(clearCompletedbtn, "color", VERY_DARK_GRAYISH_BLUE_DT);
    }
    switch ((0, getLastList)()) {
        case ("ALL"):
            (0, changeProp)(allbtn, "color", BRIGHT_BLUE, 'important');
            break;
        case ("ACTIVE"):
            (0, changeProp)(activebtn, "color", BRIGHT_BLUE, 'important');
            break;
        case ("COMPLETED"):
            (0, changeProp)(completedbtn, "color", BRIGHT_BLUE, 'important');
    }
};
var isChecked = function (elem) {
    elem.innerHTML = checkIcon;
    (0, changeProp)(elem, "background", CHECK_BACKGROUND);
    (0, changeProp)(elem, "width", "22px");
    (0, changeProp)(elem, "height", "22px");
    (0, changeProp)(elem, "border", "transparent");
};
var isNotChecked = function (elem) {
    elem.innerHTML = "";
    (0, changeProp)(elem, "background", "transparent");
    (0, changeProp)(elem, "width", "19px");
    (0, changeProp)(elem, "height", "19px");
    if (mode == "LIGHT") {
        (0, changeProp)(elem, "border", CHECK_BORDER_LT);
    }
    else {
        (0, changeProp)(elem, "border", CHECK_BORDER_DT);
    }
};
var applyCheckStyles = function () {
    addToDo.classList.add("to-do-checked");
    inputChecked();
    isChecked(fCheck);
};
var removeCheckStyles = function () {
    addToDo.classList.remove("to-do-checked");
    inputChecked();
    isNotChecked(fCheck);
    if (mode == "LIGHT") {
        fCheck.style.border = CHECK_BORDER_LT;
    }
    else {
        fCheck.style.border = CHECK_BORDER_DT;
    }
};
var inputChecked = function () {
    if (alreadyCompleted) {
        if (mode == "LIGHT") {
            (0, changeProp)(addToDo, "color", LIGHT_GRAYISH_BLUE_LT, 'important');
            (0, changeProp)(addToDo, "text-decoration-color", LIGHT_GRAYISH_BLUE_LT, 'important');
        }
        else {
            (0, changeProp)(addToDo, "color", DARK_GRAYISH_BLUE, 'important');
            (0, changeProp)(addToDo, "text-decoration-color", DARK_GRAYISH_BLUE, 'important');
        }
    }
    else {
        if (mode == "LIGHT") {
            (0, changeProp)(addToDo, "color", VERY_DARK_GRAYISH_BLUE_LT, 'important');
        }
        else {
            (0, changeProp)(addToDo, "color", LIGHT_GRAYISH_BLUE, 'important');
        }
    }
};
var replaceClassList = function () {
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
};
showLastSavedList();
