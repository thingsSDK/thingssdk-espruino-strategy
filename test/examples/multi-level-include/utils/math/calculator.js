'use strict';

function multiply(a, b) {
    return a * b;
}

export function square(a) {
    return multiply(a, a);
}

export function cube(a) {
    return multiply(a, square(a, a));
}

export function divide(a, b) {
    return a / b;
}