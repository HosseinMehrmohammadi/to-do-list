"use strict";
export const __esModule = true;
function store(list) {
    localStorage.setItem("toDos", JSON.stringify(list.items));
}
const _store = store;
export { _store as store };
function load(list) {
    list.items = JSON.parse(localStorage.getItem("toDos")) || [];
}
const _load = load;
export { _load as load };
function storeMode(mode) {
    localStorage.setItem("mode", JSON.stringify(mode));
}
const _storeMode = storeMode;
export { _storeMode as storeMode };
function getMode() {
    return JSON.parse(localStorage.getItem("mode")) || "LIGHT";
}
const _getMode = getMode;
export { _getMode as getMode };
function storeLastList(lastList) {
    localStorage.setItem("lastList", JSON.stringify(lastList));
}
const _storeLastList = storeLastList;
export { _storeLastList as storeLastList };
function getLastList() {
    return JSON.parse(localStorage.getItem("lastList")) || "ALL";
}
const _getLastList = getLastList;
export { _getLastList as getLastList };
function clearStorage() {
    localStorage.clear();
}
const _clearStorage = clearStorage;
export { _clearStorage as clearStorage };
