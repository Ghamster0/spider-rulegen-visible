(() => {
    async function wrapper() {
        const sleep = (t) => new Promise(r => setTimeout(r, t))
        let scrollMax = 5

        let successTimes = 0
        let failTimes = 0

        let lastHeight = document.body.scrollHeight
        while (true) {
            window.scrollTo(0, lastHeight + 10000)
            await sleep(1000)

            const currentHeight = document.body.scrollHeight
            if (currentHeight > lastHeight) {
                lastHeight = currentHeight
                successTimes += 1
                failTimes = 0
            } else {
                failTimes += 1
            }

            if (successTimes >= scrollMax || failTimes >= 2) {
                break
            }
        }
    }
    return wrapper()
})()