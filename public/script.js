function pointsOf(player) {
    return player.attributes.ZaI31jirkl.value;
}
function goldOf(player) {
    return player.attributes.fA5E2xq8DF.value;
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
if (fetch) {
    // fetch('https://www.modd.io/api/game-client/6200986fe2dd1a393507fac2').then(response => response.json()).then(data => {
    //     for (const id in data.data.itemTypes) {
    //         itemNames[id] = data.data.itemTypes[id].name;
    //     }
    // });
    let promise = fetch('/db').then(response => response.json());
    window.addEventListener('DOMContentLoaded', () => {
        const table = document.getElementById('farmerz-data');
        const farmerzInfoName = document.getElementById('farmerz-info-name'),
            farmerzInfoGold = document.getElementById('farmerz-info-gold'),
            farmerzInfoScore = document.getElementById('farmerz-info-score'),
            farmerzInfoItems = document.getElementById('farmerz-info-items'),
            farmerzInfoPlayerJson = document.getElementById('farmerz-info-player-json'),
            farmerzInfoUnitJson = document.getElementById('farmerz-info-unit-json');
        promise.then(data => {
            farmerzData = data;
            farmerzTable.deleteRow(1);
            
            const sortable = [];
            for (const name in data) {
                if (data[name]) sortable.push([name, data[name]]);
            }
            sortable.sort((a, b) => pointsOf(b[1][0]) - pointsOf(a[1][0]));
    
            for (const entry of sortable) {
                const player = entry[1][0];
                const unit = entry[1][1];
    
                const row = farmerzTable.insertRow(-1);
    
                const link = document.createElement('a');
                link.href = '#';
                link.setAttribute('data-toggle', 'modal');
                link.setAttribute('data-target', '#farmerz-info-modal');
                link.addEventListener('click', () => {
                    farmerzInfoName.innerText = entry[0];
                    farmerzInfoGold.innerText = goldOf(player);
                    farmerzInfoScore.innerText = pointsOf(player);
                    farmerzInfoPlayerJson.innerText = JSON.stringify(player);
                    farmerzInfoUnitJson.innerText = JSON.stringify(unit);
                    while (farmerzInfoItems.firstChild) {
                        farmerzInfoItems.removeChild(farmerzInfoItems.lastChild);
                    }
                    if (unit.inventoryItems) unit.inventoryItems.forEach(item => {
                        const li = document.createElement('li');
                        li.innerText = item.quantity + ' ' + itemNames[item.itemTypeId];
                        farmerzInfoItems.appendChild(li);
                    });
                });
                link.innerText = entry[0];
                
                row.insertCell(0).appendChild(link);
                row.insertCell(1).innerText = goldOf(player);
                row.insertCell(2).innerText = pointsOf(player);
            }
        }).catch(console.error);
    });
} else {
    alert('Failed to load leaderboard: Browser not compatible with Fetch API');
}
