import { Item } from './itemModel';
import { load } from "../methods/localStorageMethods";

export interface ToDo {
    items: Item[]
}

export class ToDoList {
    items: Item[];

    constructor() {
        load(this);
    }
}
