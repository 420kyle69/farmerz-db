const mongoose = require('mongoose');

const PlayerData = mongoose.model('PlayerData', new mongoose.Schema({
    _id: String,
    data: [{}, {}]
}, {
    collection: 'data',
    versionKey: false
}));

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, '❌ mongodb connection error'));
db.once('open', () => console.log('✅ mongodb connected successfully'));

module.exports = {
    set: function (key, value) {
        return PlayerData.findById(key).exec().then(doc => {
            if (doc) doc.overwrite({ data: value });
            else doc = new PlayerData({ _id: key, data: value });
            return doc.save();
        });
    },
    get: function (key) {
        return PlayerData.findById(key).exec().then(doc => doc && doc.data);
    },
    getAll: function () {
        return PlayerData.find().exec().then(data => {
            const dictionary = {};
            for (const e of data) {
                dictionary[e._id] = e.data;
            }
            return dictionary;
        });
    }
};

const https = require('https');

function get(url, callback) {
    https.get(url, res => {
        let data = '';
        res.on('data', chunk => {
            data += chunk;
        });
        res.on('end', () => {
            callback(data);
        });
    }).on('error', err => {
        console.error(`Error getting ${url}: ${err.message}`);
    });
}

get(process.env.REPLIT_DB_URL + '?prefix=', keys => {
    keys.split('\n').forEach(name => {
        get(process.env.REPLIT_DB_URL + '/' + name, data => {
            data && module.exports.set(name, JSON.parse(data));
        });
    });
});
