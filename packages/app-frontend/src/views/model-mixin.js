const example = {
    id: "site_1",
    name: "p1",
    rules: [
        {
            id: "rule_1",
            name: "Rule 1",
            // startUrls or extendUrls
            startUrls: ["https://www.ixigua.com/search/变态手机无限元宝游戏有哪些"],
            extendUrls: ["https://www.ixigua.com/search/变态手机无限元宝游戏有哪些"],
            example: "http://www.baidu.com",
            links: [
                {
                    id: "links_1",
                    name: "next page",
                    selector: "",
                    urls: [],
                    handler: ""
                },
            ],
            contents: []
        }
    ]
}


export default {
    methods: {
        getBaseSite() {
            return {
                id: "site_" + Math.random(),
                name: "",
                rules: []
            }
        },
        getBaseRule() {
            return {
                id: "rule_" + Math.random(),
                name: "",
                example: "",
                links: [],
                contents: []
            };
        },
        getBaseRuleLinks() {
            return {
                id: "ruleLink_" + Math.random(),
                name: "",
                selector: "",
                urls: [],
                handler: "",
            }
        }
    }
}