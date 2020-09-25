export default {
    methods: {
        loadSelector(cssSelector) {
            window.bridge.emit("msg-to-backend", {
                type: "selector:load",
                value: cssSelector,
            });
        },
        unLoadSelector() {
            window.bridge.emit("msg-to-backend", {
                type: "selector:deactive",
            });
        },
        goto(href) {
            window.bridge.emit("msg-to-backend", {
                type: "location:href",
                value: href,
            });
        },
        extractUrls(cssSelector) {
            window.bridge.emit("msg-to-backend", {
                type: "extract:urls",
                value: cssSelector,
            });
        }
    }
}