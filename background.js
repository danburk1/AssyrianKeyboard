let contextID = -1;

//Prevent background.js from sleeping.
setInterval(() => {
  chrome.runtime.getPlatformInfo(() => {});
}, 15000);

chrome.input.ime.onFocus.addListener(function(context) {
    contextID = context.contextID;
});

const regMap = {
        'a': 'ܐ', 'b': 'ܒ', 'g': 'ܓ', 'd': 'ܕ',
        'h': 'ܗ', 'w': 'ܘ', 'z': 'ܙ', 'k': 'ܟ',
        'm': 'ܡ', 'n': 'ܢ', 'p': 'ܦ', 't': 'ܬ',
        'q': 'ܩ', 'r': 'ܪ', 'f': 'ܫ', 'x': 'ܚ',
        's': 'ܣ', 'j': 'ܓ̰', 'c': 'ܨ', 'u': 'ܘܼ', 'o': 'ܘܿ',
        'e': 'ܥ', 'y': 'ܝ', 'l': 'ܠ', 'i': 'ܝܼ', 'v': 'ܛ',

        ',': '،',   // comma → Arabic comma
        '.': '.',   // dot → dot
        '!': '!',    // exclamation → exclamation

        '`': '̰', '2': 'ܵ', '1': 'ܲ', '3': 'ܸ', '4': 'ܹ', '5': 'ܿ', '6': 'ܼ', '7': '̇', '8': '̣', '9': '̈', '0': '̤',
        '\\': '݇'
};

const shiftMap = {
        '~': '̮',
        'g': 'ܓ̣',     // Shift + g
        'b': 'ܒ̣',     // Shift + b
        'p': 'ܦ̮',     // Shift + p
        'o': 'ܘܼ',     // Shift + o
        '?': '؟'
};

chrome.input.ime.onKeyEvent.addListener(function(engineID, keyData) {
    if (keyData.type !== 'keydown') {
        return false; 
    }

    if (contextID == 0){
        return false;
    }

    if (keyData.ctrlKey || keyData.altKey || keyData.metaKey) {
        return false;
    }

    const keyLower = keyData.key.toLowerCase();
    let mappedChar = null;

    if (!keyData.shiftKey && regMap[keyLower]) {
        mappedChar = regMap[keyLower];
    } else if (keyData.shiftKey) {
        mappedChar = shiftMap[keyLower] || shiftMap[keyData.key];
    }

    if (mappedChar) {
        chrome.input.ime.commitText({
            contextID: contextID,
            text: mappedChar
        });
        return true;
    }

    return false; 
});
