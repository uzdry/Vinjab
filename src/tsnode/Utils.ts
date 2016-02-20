/**
 * Created by valentin on 09/02/16.
 */


/**
 * static helper methods
 */
class Utils {

    /**
     *
     *
     * @param str String to check
     * @param prefix to check
     * @returns wether the specified string starts with the specified prefix {boolean}
     */
    static startsWith(str, prefix): boolean {
        if (str.length < prefix.length)
            return false;
        for (var i = prefix.length - 1; (i >= 0) && (str[i] === prefix[i]); --i)
            continue;
        return i < 0;
    }
}

export {Utils}
