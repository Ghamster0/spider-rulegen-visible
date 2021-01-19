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
    sendToBackend({ type: "extract:contents", value: { indicator, template } })
}

export function initBackendListener(store) {
    bridge.on("msg-from-backend", (e) => {
        console.log("frontend <<< ", e)
        const msgBody = e.value
        switch (e.type) {
            case "selector-predict:urls":
                store.commit("SET_RULE_LINK", { indicator: msgBody.indicator, linkConf: { selector: msgBody.selector } })
                extractUrls(msgBody.indicator, msgBody.selector)
                break
            case "selector-predict:contents":
                store.commit("SET_RULE_EXTRACT", { indicator: msgBody.indicator, templatePatch: { selector: msgBody.selector } })
                store.commit("PREDICT_ADD")
                break
            case "extracted:urls":
                store.commit("SET_RULE_LINK", { indicator: msgBody.indicator, linkConf: { urls: msgBody.urls } })
                break
            case "extracted:contents":
                store.commit("SET_RULE_EXTRACT", { indicator: msgBody.indicator, templatePatch: { contents: msgBody.contents } })
        }
    });

}