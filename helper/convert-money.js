/** 
 * @param   {number} number
 * @return  {string} number
 */
export function currencyAbrev(number) {
    let decPlaces = Math.pow(10, 2);
    let abbrev = ["k", "m", "b", "t", "q", "Q"];
    for (let i = abbrev.length - 1; i >= 0; i--) {
        let size = Math.pow(10, (i + 1) * 3);
        if (size <= Math.abs(number)) {
            number = Math.round(number * decPlaces / size) / decPlaces;
            if ((number == 1000) && (i < abbrev.length - 1)) {
                number = 1;
                i++;
            }
            number += abbrev[i];
            break;
        }
    }
    return number;
}