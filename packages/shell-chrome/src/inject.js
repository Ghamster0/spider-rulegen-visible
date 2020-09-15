import { initInject } from "@spider-rulegen/app-inject"

initInject({
    pre() {
        const mount = document.createElement("div")
        mount.setAttribute("id", "inject_app")
        document.body.appendChild(mount)
        console.log("Spider rule gen -> initInject run")
    }
}, "inject_app")