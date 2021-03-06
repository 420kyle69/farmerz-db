const db = require("./database"),
    express = require('express'),
    app = express(),
    KEY = process.env.KEY,
    clients = new Set();
require('express-ws')(app);
app.use(express.urlencoded({ extended: true, limit: '64kb' }));

app.post('/', (req, res) => {
    console.log('%s request recieved for %s', req.body[KEY], req.body.name);
    switch (req.body[KEY]) {
        case 'store':
            try {
                const data = req.body.data;

                const player = data[0];
                delete player.variables.playerUnit;
                player.attributes.JpF8WMPYfL.value = 0;

                // https://github.com/moddio/taro/blob/master/engine/core/IgeEntity.js#L4064
                const keysToStream = ['min', 'max', 'regenerateSpeed', 'value'];
                for (const id in player.attributes) {
                    const attribute = player.attributes[id];
                    for (const i in attribute) {
                        if (!keysToStream.includes(i)) delete attribute[i];
                    }
                }

                const unit = data[1];
                delete unit.attributes;
                delete unit.variables;
                unit.inventoryItems?.forEach(item => {
                    delete item.attributes;
                    delete item.variables;
                });

                db.set(req.body.name, data).then(() => {
                    res.send({ response: '' });
                    clients.forEach(ws => ws.send(req.body.name));
                });
            } catch (e) {
                console.error('Error processing request:', req.body, e);
                res.send({ response: 'error' });
            }
            break;
        case 'retrieve':
            db.get(req.body.name).then(data => {
                if (data)
                    res.send({ response: JSON.stringify([req.body.name, ...data.map(JSON.stringify)]) });
                else
                    res.send({ response: JSON.stringify([req.body.name, 'none']) });
            });
            break;
        default:
            console.error('Unrecognized request:', req.body);
            res.send({ response: 'error' });
    }
});

app.get('/db/:page', (req, res) => {
    const page = parseInt(req.params.page);
    if (page >= 0)
        db.getPage(page).then(data => res.send(data));
    else
        res.sendStatus(400);
});

app.use(express.static('public'));

app.ws('/', ws => {
    clients.add(ws);
    ws.on('close', () => clients.delete(ws));
});

app.listen(process.env.PORT, () => {
    console.log('App started.');
});
