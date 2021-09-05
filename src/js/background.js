'use strict';
const newTab = "chrome://newtab/";

// const createDB = () => {
//     idb.open('products', 1, (upgradeDB) => {
//         var store = upgradeDB.createObjectStore('beverages', {
//             keyPath: 'id'
//         });
//         store.put({ id: 123, name: 'coke', price: 10.99, quantity: 200 });
//         store.put({ id: 321, name: 'pepsi', price: 8.99, quantity: 100 });
//         store.put({ id: 222, name: 'water', price: 11.99, quantity: 300 });
//     });
// }

// self.addEventListener('activate', (event) => {
//     event.waitUntil(createDB());
// });

// const readDB = () => {
//     idb.open('products', 1).then(function (db) {
//         var tx = db.transaction(['beverages'], 'readonly');
//         var store = tx.objectStore('beverages');
//         return store.getAll();
//     }).then(function (items) {
//         // Use beverage data
//     });
// };

const GetSpaceOnLocalStorage = () => {
    return JSON.parse(localStorage.getItem('space_0'));
};

const SaveCurrentSpace = () => {
    chrome.tabs.create({ "url": newTab });
    chrome.tabs.query({ "currentWindow": true }, (tabs) => {
        tabs.forEach((currentValue, index, array) => {
            SaveAndCloseTab(currentValue);
        });
    });
};

const LoadSpace = () => {
    let space = [];

    if (localStorage.getItem('space_0') !== 'undefined') {
        const result = GetSpaceOnLocalStorage()
        if (Array.isArray(result) && result.length > 0) {
            space = [...result];
        }
    }

    space.forEach(function (currentValue, index, array) {
        chrome.tabs.create(currentValue, callback);

        function callback() {
            array.splice(index, 1);
        }
    });
};

const SaveAndCloseTab = (tab) => {
    if (!tab || (tab && (tab.pinned || tab.url === newTab))) {
        return;
    }

    const _tab = {
        index: tab.index,
        url: tab.url,
        active: tab.active,
        selected: tab.selected,
    };

    console.log(_tab)

    // chrome.tabs.remove(tab.id, () => {
    //     space.push(_tab);
    //     localStorage.setItem('space_0', JSON.stringify(space));
    // });
};

// const runScript = (code) => {
//     try {
//         if (code.code)
//             chrome.scripting.executeScript(_tabId, code, (response) => {
//                 console.debug(response);
//             });
//         else if (code.file)
//             chrome.scripting.executeScript(_tabId, code);
//     } catch (e) {
//         console.error('ERROR@runScript: ' + e);
//     }
// };

chrome.action.onClicked.addListener((tab) => {
    const space = GetSpaceOnLocalStorage();

    if (space.length > 0) {
        LoadSpace();
    } else {
        SaveCurrentSpace();
    }
});

// //Load content script
// runScript({ file: 'contentscript.js' });
