import { ToDo } from "../models/listModel";
import { ListType } from "../types/listType";
import { ModeType } from "../types/modeType";

export function store(list: ToDo) {
    localStorage.setItem("toDos", JSON.stringify(list.items));
}

export function load(list: ToDo) {
    list.items = JSON.parse(localStorage.getItem("toDos")) || [];
}

export function storeMode(mode: ModeType) {
    localStorage.setItem("mode", JSON.stringify(mode));
}

export function getMode() {
    return JSON.parse(localStorage.getItem("mode")) || "LIGHT";
}

export function storeLastList(lastList: ListType) {
    localStorage.setItem("lastList", JSON.stringify(lastList));
}

export function getLastList() {
    return JSON.parse(localStorage.getItem("lastList")) || "ALL";
}

export function clearStorage() {
    localStorage.clear();
}
