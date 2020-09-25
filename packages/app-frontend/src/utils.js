export function stringSplit(s) {
    return s.split("\n").map((url) => url.trim()).filter((url) => url !== "")
}