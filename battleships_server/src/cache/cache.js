
const NodeCache = require('node-cache');

const ongoingGames = new NodeCache({ useClones: false });

// Cache schema:
/* {
    gameID : {
    game: Class Object
    player1Socket: Socket Object
    player2Socket: Socket Object
    }
    ...
}
*/

exports.update = (key, val) => {
    const cacheData = ongoingGames.get(key);
    const newObject = { ...cacheData, ...val };

    ongoingGames.set(key, newObject);
    return newObject;
};

exports.del = (key) => {
    ongoingGames.del(key);
    return true;
};

exports.get = (key) => {
    const data = ongoingGames.get(key);

    if (data === undefined) return false;
    return data;
};
