const timeToggle = document.getElementById('timeToggle');
const formatLabel = document.getElementById('formatLabel');
const timezoneElement = document.getElementById('timezone');

chrome.storage.sync.get(['timeFormat'], (result) => {
    const format = result.timeFormat || '12';
    if (format === '24') {
        timeToggle.checked = true;
        formatLabel.textContent = '24-hour';
    } else {
        formatLabel.textContent = '12-hour';
    }
});

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    if (tab && tab.url && tab.url.includes("instagram.com")) {
        timeToggle.disabled = false;
    } else {
        timeToggle.disabled = true;
        bodyContent.textContent = "Go to Instagram Web to enable this extension";
    }
});

timeToggle.addEventListener('change', () => {
    const selectedFormat = timeToggle.checked ? '24' : '12';
    chrome.storage.sync.set({ timeFormat: selectedFormat }, () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { action: "updateTimeFormat", format: selectedFormat });
        });
    });
    formatLabel.textContent = selectedFormat + '-hour';
});

const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
timezoneElement.textContent = `Timezone: ${timeZone}`;
