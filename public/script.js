function pointsOf(player) {
    return +player.attributes.ZaI31jirkl.value;
}
function goldOf(player) {
    return +player.attributes.fA5E2xq8DF.value;
}
const itemNames = {
    "BzM1tb88pK": "Tulip",
    "MJkFzYrj9u": "Cosmos",
    "E98YFwzNsN": "Automatic Sprinkler",
    "2KNlVnm4RE": "copy animal",
    "tdZn799ofy": "Sheep",
    "6IjG0OGeyV": "Yellow Onion",
    "xiSIAqcTQl": "Potato",
    "KuP5KVBNXZ": "Watermelon",
    "JlTVM2QaxO": "Land Deed",
    "wiJAEUTXLs": "Cauliflower",
    "eYDKyYGM3e": "Butternut Squash",
    "HOdoJ0rghc": "copy plant",
    "N0FSJzWIih": "Pig",
    "rrN6dAE8Pa": "Dry Protected Pasture",
    "s8Fas5K99L": "Dry Pasture",
    "xwH4s7mKQp": "Protected Pasture",
    "yYxhLY8zbS": "Pasture",
    "C7ag6DmMUn": "Common Feed",
    "2XEMPplB1M": "Protected Compost Heap",
    "k9vaLmwo6m": "Dry Protected Plot",
    "gRgzCnfSCh": "Protected Plot",
    "708mX9XEB8": "Dry Plot",
    "GvZo41SzGm": "Water Bucket",
    "07ybEcAaHr": "Fertilizer",
    "QD0oeuhyX4": "Empty Bucket",
    "GgpcmnE6T8": "Compost Heap",
    "cGBzNtjxR2": "Carrot",
    "f5JlW6xuMh": "Plot",
    "zZo6kAmvkd": "Saffron"
};
let farmerzData;

if (fetch) {
    // fetch('https://www.modd.io/api/game-client/6200986fe2dd1a393507fac2').then(response => response.json()).then(data => {
    //     for (const id in data.data.itemTypes) {
    //         itemNames[id] = data.data.itemTypes[id].name;
    //     }
    // });
    const promise = fetch('/db').then(response => response.json());
    window.addEventListener('DOMContentLoaded', () => {
        const farmerzTable = document.getElementById('farmerz-data'),
              farmerzInfoItems = document.getElementById('farmerz-info-items'),
              farmerzInfoPlayerJson = document.getElementById('farmerz-info-player-json'),
              farmerzInfoUnitJson = document.getElementById('farmerz-info-unit-json');
        let KEY;
        function $retrieve(payload) {
            return $.post('/', payload, (data, status) => {
                if (status == 'success' && data.response != 'error') {
                    const response = JSON.parse(data.response);
                    if (response[1] == 'none') delete farmerzData[response[0]];
                    else farmerzData[response[0]] = response.slice(1).map(JSON.parse);
                    loadTable(farmerzData);
                } else {
                    console.error('Failed to get data, please check deploy logs');
                    payload.KEY = KEY;
                    pending.retrieve.push(payload);
                }
            });
        }
        function $store(payload) {
            return $.post('/', payload, (data, status) => {
                if (status != 'success' || data.response !== '') {
                    console.error('Failed to send update, please check deploy logs');
                    payload.KEY = KEY;
                    pending.store.push(payload);
                }
                $('#farmerz-info-modal').modal('hide');
            });
        }
        function loadTable(data) {
            farmerzData = data;
            while (farmerzTable.rows.length > 1) farmerzTable.deleteRow(1);

            const sortable = [];
            for (const name in data) {
                if (data[name]) sortable.push([name, data[name]]);
            }
            sortable.sort((a, b) => pointsOf(b[1][0]) - pointsOf(a[1][0]));

            for (const [name, [player, unit]] of sortable) {

                const row = farmerzTable.insertRow(-1);

                const link = document.createElement('a');
                link.href = '#';
                link.setAttribute('data-toggle', 'modal');
                link.setAttribute('data-target', '#farmerz-info-modal');
                link.addEventListener('click', () => {
                    $('#farmerz-info-name').text(name);
                    $('#farmerz-info-gold').text(goldOf(player).toLocaleString());
                    $('#farmerz-info-score').text(pointsOf(player).toLocaleString());
                    farmerzInfoPlayerJson.value = JSON.stringify(player);
                    farmerzInfoUnitJson.value = JSON.stringify(unit);
                    $(farmerzInfoItems).empty();
                    if (unit.inventoryItems) unit.inventoryItems.forEach(item => {
                        const li = document.createElement('li');
                        li.innerText = item.quantity + ' ' + itemNames[item.itemTypeId];
                        farmerzInfoItems.appendChild(li);
                    });
                });
                link.innerText = name;

                row.insertCell(0).appendChild(link);
                row.insertCell(1).innerText = goldOf(player);
                row.insertCell(2).innerText = pointsOf(player);
            }
        }
        promise.then(loadTable).catch(console.error);
        const pending = {
            retrieve: [],
            store: []
        };
        new WebSocket(`wss://${window.location.hostname}`).addEventListener('message', event => {
            $retrieve({
                [KEY]: 'retrieve',
                name: event.data
            });
        });
        document.getElementById('farmerz-update-json').addEventListener('click', () => {
            $store({
                [KEY]: 'store',
                name: $('#farmerz-info-name').text(),
                data: [
                    JSON.parse(farmerzInfoPlayerJson.value),
                    JSON.parse(farmerzInfoUnitJson.value)
                ]
            });
        });
        document.getElementById('update-key').addEventListener('click', () => {
            KEY = $('#key-db').val();
            pending.retrieve.forEach(payload => {
                delete payload[payload.KEY];
                delete payload.KEY;
                payload[KEY] = 'retrieve';
                $retrieve(payload);
            });
            pending.store.forEach(payload => {
                delete payload[payload.KEY];
                delete payload.KEY;
                payload[KEY] = 'store';
                $store(payload);
            });
            pending.retrieve.length = pending.store.length = 0;
        });
    });
} else {
    console.error('Failed to load leaderboard: Browser not compatible with Fetch API');
}
