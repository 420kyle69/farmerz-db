const mongoose = require('mongoose');

const PlayerData = mongoose.model('PlayerData', new mongoose.Schema({
    _id: String,
    data: [{}, {}]
}, { collection: 'data' }));

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
        PlayerData.find().exec().then(data => {
            const dictionary = {};
            for (const e of data) {
                dictionary[e._id] = e.data;
            }
            return dictionary;
        });
    }
};
