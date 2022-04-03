const mongoose = require('mongoose');

const PlayerData = mongoose.model('PlayerData', new mongoose.Schema({
    _id: String,
    data: [{}, {}]
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
        const doc = new PlayerData({ _id: key, data: value });
        return doc.save();
    },
    get: function (key) {
        return PlayerData.findById(key);
    },
    getAll: function () {
        return PlayerData.find({});
    }
};