'use strict';
var space = [];
var newTab = "chrome://newtab/";

function SaveCurrentSpace() {
    chrome.tabs.create({ "url": newTab });
    chrome.tabs.query({ "currentWindow": true }, callback);

    function callback(tabs) {
        tabs.forEach(function (currentValue, index, array) {
            SaveAndCloseTab(currentValue);
        });
    }
}

function LoadSpace() {
    space.forEach(function (currentValue, index, array) {
        chrome.tabs.create(currentValue, callback);

        function callback() {
            array.splice(index, 1);
        }
    });

    space = [];
}

function SaveAndCloseTab(tab) {
    if (!tab || (tab && (tab.pinned || tab.url === newTab))) {
        return;
    }

    var _tab = {
        index: tab.index,
        url: tab.url,
        active: tab.active,
        selected: tab.selected,
    }

    chrome.tabs.remove(tab.id, callback);

    function callback() {
        space.push(_tab);
    }
}

chrome.browserAction.onClicked.addListener(function (tab) {
    if (space.length > 0) {
        LoadSpace();
    } else {
        SaveCurrentSpace();
    }
});

function runScript(code) {
    try {
        if (code.code)
            chrome.tabs.executeScript(_tabId, code, callback);
        else if (code.file)
            chrome.tabs.executeScript(_tabId, code);
    } catch (e) {
        //console.error('ERROR@chrome.tabs.executeScript: ' + e);
    }

    function callback(response) {
        console.debug(response);
    }
}

//Load content script
runScript({ file: 'contentscript.js' });