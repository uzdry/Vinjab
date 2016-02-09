/**
 * Created by valentin on 09/02/16.
 */

class Utils {
    static startsWith(str, prefix): boolean {
        if (str.length < prefix.length)
            return false;
        for (var i = prefix.length - 1; (i >= 0) && (str[i] === prefix[i]); --i)
            continue;
        return i < 0;
    }
}

export {Utils}
