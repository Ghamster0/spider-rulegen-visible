function sendToBackend(msg) {
    window.bridge.emit("msg-to-backend", msg)
}

export function loadUrlsSelector({ indicator, selector }) {
    window.bridge.emit("msg-to-backend", {
        type: "selector:urls",
        value: { indicator, selector },
    });
}

export function loadContentsSelector({ indicator, selector }) {
    console.log(indicator, selector)
    sendToBackend({
        type: "selector:contents",
        value: { indicator, selector },
    });
}

export function clearSelector() {
    window.bridge.emit("msg-to-backend", {
        type: "selector:clear",
    });
}


export function gotoPage(href) {
    window.bridge.emit("msg-to-backend", {
        type: "location:href",
        value: href,
    });
}

export function extractUrls(indicator, selector) {
    sendToBackend({ type: "extract:urls", value: { indicator, selector } })
}

export function extractContent({ indicator, template }) {
    console.log("extractContent", indicator, template)
    sendToBackend({ type: "extract:contents", value: { indicator, template } })
}

export function sendToDatabus(msg, tabId) {
    msg.tabId = tabId
    window.bridge.emit("rulegen-to-databus", msg)
}