import R from "ramda";
import * as core from "./core.js";

// Comparators
export const composeComparators = 
    (comparators) => 
        (a, b) => {
            core;
            return comparators.reduce((prevResult, c) => prevResult !== 0 ? prevResult : c(a, b), 0);
        };

export const ascending = R.lt;

export const descending = R.gt;

export const compare = R.curry((f, compareOp) => R.comparator((a, b) => compareOp(f(a), f(b))));
