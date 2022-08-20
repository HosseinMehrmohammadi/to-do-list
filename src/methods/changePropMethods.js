"use strict";
export const __esModule = true;
var changeProps = function (elems, prop, value) {
    for (var i = 0; i < elems.length; i++) {
        (0, _changeProp)(elems[i], prop, value);
    }
};
const _changeProps = changeProps;
export { _changeProps as changeProps };
var changeProp = function (elem, prop, value, importance) {
    elem.style.setProperty(prop, value, importance);
};
const _changeProp = changeProp;
export { _changeProp as changeProp };
