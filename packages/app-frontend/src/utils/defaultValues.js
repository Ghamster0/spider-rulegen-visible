import { v4 as uuidv4 } from "uuid"

export function getDefaultRule() {
    return {
        id: uuidv4(),
        name: "",
        example: "",
        links: [],
        extractors: [],
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