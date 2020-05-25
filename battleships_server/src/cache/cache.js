
const NodeCache = require('node-cache');

const ongoingGames = new NodeCache({ useClones: false });

/* Cache schema:
// ongoingGames :
{
    gameID: {
        game: Class Object
    }
}
*/

class Cache {
    constructor() {
        this.cache = new NodeCache({ useClones: false });
    }

    update(key, val) {
        const cacheData = ongoingGames.get(key);
        const newObject = { ...cacheData, ...val };

        this.cache.set(key, newObject);
        return newObject;
    }

    del(key) {
        this.cache.del(key);
        return true;
    }

    get(key) {
        const data = this.cache.get(key);

        if (data === undefined) return false;
        return data;
    }
}

exports.ongoingGamesCache = new Cache();
