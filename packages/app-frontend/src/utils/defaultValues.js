import { v4 as uuidv4 } from "uuid"

export function getDefaultGroup() {
    return {
        id: uuidv4(),
        name: "",
        rules: [],
    };
}

export function getDefaultRule() {
    return {
        id: uuidv4(),
        name: "",
        example: "",
        linksConf: [],
        contentsConf: null
    };
}

export function getDefaultLx() {
    return {
        id: uuidv4(),
        name: "",
        selector: "",
        urls: [],
        handler: "",
    };
}