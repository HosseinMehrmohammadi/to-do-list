export const changeProps = (elems, prop: string, value: string) => {
    for (let i = 0; i < elems.length; i++) {
        changeProp(elems[i], prop, value);
    }
}

export const changeProp = (elem, prop: string, value: string, importance?: string) => {
    elem.style.setProperty(prop, value, importance);
}
