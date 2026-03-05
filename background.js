chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ isAssyrianEnabled: false });
});

chrome.action.onClicked.addListener(async (tab) => {
    const data = await chrome.storage.local.get('isAssyrianEnabled');
    const newState = !data.isAssyrianEnabled;
    await chrome.storage.local.set({ isAssyrianEnabled: newState });
});

chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && changes.isAssyrianEnabled !== undefined) {
        const isEnabled = changes.isAssyrianEnabled.newValue;
        if (isEnabled) {
            chrome.action.setBadgeText({ text: 'ON' });
            chrome.action.setBadgeBackgroundColor({ color: '#4CAF50' });
        } else {
            chrome.action.setBadgeText({ text: '' });
        }
    }
});
