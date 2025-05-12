function formatDateTime(isoString, format) {
    const date = new Date(isoString);
    let options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: (format === '12')
    };
    return date.toLocaleString(undefined, options);
}

function updateTimes(format) {
    const timeElements = document.querySelectorAll('time');
    timeElements.forEach((el) => {
        if (el.getAttribute('data-inst-atime')) {
            el.nextSibling?.remove(); 
        }
        const datetime = el.getAttribute('datetime');
        if (datetime) {
            const formattedTime = formatDateTime(datetime, format);
            const span = document.createElement('span');
            span.style.fontSize = '12px';
            span.style.marginLeft = '5px';
            span.style.color = '#888';
            span.textContent = `(${formattedTime})`;
            el.after(span);
            el.setAttribute('data-inst-atime', 'true'); 
        }
    });
}

chrome.storage.sync.get(['timeFormat'], (result) => {
    const format = result.timeFormat || '12';
    updateTimes(format);
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "updateTimeFormat") {
        updateTimes(message.format);
    }
});
