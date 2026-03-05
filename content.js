let isEnabled = false;

chrome.storage.local.get('isAssyrianEnabled', (data) => {
    isEnabled = !!data.isAssyrianEnabled;
});

chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && changes.isAssyrianEnabled !== undefined) {
        isEnabled = changes.isAssyrianEnabled.newValue;
    }
});

function insertText(text) {
    if (!document.execCommand('insertText', false, text)) {
        const el = document.activeElement;
        if (el && typeof el.selectionStart === 'number') {
            const start = el.selectionStart;
            const end = el.selectionEnd;
            el.setRangeText(text, start, end, 'end');
            el.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }
}

document.addEventListener('keydown', (e) => {
    if (e.shiftKey && e.code === 'Space') {
        e.preventDefault();
        chrome.storage.local.set({ isAssyrianEnabled: !isEnabled });
        return;
    }

    if (!isEnabled) return;

    if (e.ctrlKey || e.metaKey || e.altKey) return;

    const el = document.activeElement;
    const isEditable = el.tagName === 'TEXTAREA' || 
                       (el.tagName === 'INPUT' && /^(text|search|password|email|url)$/i.test(el.type)) || 
                       el.isContentEditable;
                       
    if (!isEditable) return;

    const regMap = {
        'a': 'ܐ', 'b': 'ܒ', 'g': 'ܓ', 'd': 'ܕ',
        'h': 'ܗ', 'w': 'ܘ', 'z': 'ܙ', 'k': 'ܟ',
        'm': 'ܡ', 'n': 'ܢ', 'p': 'ܦ', 't': 'ܬ',
        'q': 'ܩ', 'r': 'ܪ', 'f': 'ܫ', 'x': 'ܚ',
        's': 'ܣ', 'j': 'ܓ̰', 'c': 'ܨ', 'u': 'ܘܼ', 'o': 'ܘܿ',
        'e': 'ܥ', 'y': 'ܝ', 'l': 'ܠ', 'i': 'ܝܼ', 'v': 'ܛ',
        ',': '،', '.': '.', '!': '!',
        '`': '̰', '2': 'ܵ', '1': 'ܲ', '3': 'ܸ', '4': 'ܹ', '5': 'ܿ', '6': 'ܼ', '7': '̇', '8': '̣', '9': '̈', '0': '̤',
        '\\': '݇'
    };

    const shiftMap = {
        '~': '̮',
        'g': 'ܓ̣',     
        'b': 'ܒ̣',     
        'p': 'ܦ̮',     
        'o': 'ܘܼ',     
        '?': '؟'
    };

    const keyLower = e.key.toLowerCase();

    if (regMap[keyLower] && !e.shiftKey) {
        e.preventDefault();
        insertText(regMap[keyLower]);
    } else if (shiftMap[keyLower]) {
        e.preventDefault();
        insertText(shiftMap[keyLower]);
    }
}, true);
