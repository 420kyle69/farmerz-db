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
        return PlayerData.updateOne({ _id: key }, { _id: key, data: value }, { upsert: true });
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
