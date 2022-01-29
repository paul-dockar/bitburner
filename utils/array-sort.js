/**
 * @description - Sorts a map's value ascending
 * @param {Map} m 
 * @returns {Map}
 */
export function sortMap(m) {
    let a = [];
    for (let x of m)
        a.push(x);

    a.sort(function(x, y) {
        return x[1] - y[1];
    });

    return new Map(a);
}