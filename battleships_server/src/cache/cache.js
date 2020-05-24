
const NodeCache = require('node-cache');

const cache = new NodeCache()

// Cache schema:

exports.set = (key, val) => {
    cache.set(key, val)
    return true;
}

exports.update = (key, val) => {
    const cacheData = cache.get(key);
    const newObject = { ...cacheData, ...val};

    cache.set(key, newObject);
    return true;
}

exports.get = (key) => {
    const data = cache.get(key)
    return data;
}