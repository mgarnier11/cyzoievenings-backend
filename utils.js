

/**
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

/**
 * Find all occurences of a string(find) in an other string(source)
 * Returns an array with all indexes found
 * @param {String} source source string
 * @param {String} find string to find
 */
function indexes(source, find) {
    var result = [];
    for (i = 0; i < source.length; ++i) {
        // If you want to search case insensitive use 
        // if (source.substring(i, i + find.length).toLowerCase() == find) {
        if (source.substring(i, i + find.length) == find) {
            result.push(i);
        }
    }
    return result;
}


let Utils = {
    shuffle: shuffle,

    indexes: indexes,
}

module.exports = Utils;