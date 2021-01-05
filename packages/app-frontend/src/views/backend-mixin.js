function sendBackend(msgBody) {
    window.bridge.emit("msg-to-backend", msgBody)
}

export default {
    methods: {
        loadSelector(cssSelector) {
            sendBackend({
                type: "selector:load",
                value: cssSelector
            })
        },
        unLoadSelector() {
            sendBackend({ type: "selector:deactive" })
        },
        goto(href) {
            sendBackend({
                type: "location:href",
                value: href,
            })
        }
    }
}