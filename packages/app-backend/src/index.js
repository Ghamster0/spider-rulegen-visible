import { SelectorGadget } from "@spider-rulegen/vendor"
import { EventEmitter } from 'events'
import { getUrls } from "./utils"
import extractor from "./extractor"

const emitter = new EventEmitter()
SelectorGadget.prototype.emitter = emitter

window.activeIndicator = {}
window.formerSelector = ''

emitter.on("setPath", (e) => {
    if (formerSelector !== e) {
        formerSelector = e
        sendMessage({ type: `selector-predict:${activeIndicator.type}`, value: { indicator: activeIndicator.data, selector: e } })
    }
})

function onExtractUrls(msgBody) {
    sendMessage({
        type: "extracted:urls",
        value: {
            indicator: msgBody.indicator,
            urls: getUrls(msgBody.selector)
        }
    })
}

async function onExtractContents(msgBody) {
    const contents = await extractor(msgBody.template, 0)
    sendMessage({ type: "extracted:contents", value: { indicator: msgBody.indicator, contents } })
}

function loadSelector(selector) {
    formerSelector = SelectorGadget.toggleOpen().refreshFromPath({ value: selector })
}

const onMessage = (e) => {
    console.log("backend <<< ", e)
    if (e.type !== "msg-to-backend") return
    const msg = e.data
    switch (msg.type) {
        case "location:href":
            window.location.href = msg.value
            break
        case "selector:clear":
            SelectorGadget.toggleClose()
            formerSelector = ""
            activeIndicator = {}
            break
        case "extract:urls":
            onExtractUrls(msg.value)
            break
        case "extract:contents":
            onExtractContents(msg.value)
            break
        case "selector:urls":
            activeIndicator = { type: "urls", data: msg.value.indicator }
            loadSelector(msg.value.selector)
            break
        case "selector:contents":
            activeIndicator = { type: "contents", data: msg.value.indicator }
            loadSelector(msg.value.selector)
            break
    }
}

function onDisconnect() {
    SelectorGadget.toggleClose()
}

export function initBackend(sendMessage, handlers) {
    window.sendMessage = sendMessage
    handlers(onMessage, onDisconnect)
}
