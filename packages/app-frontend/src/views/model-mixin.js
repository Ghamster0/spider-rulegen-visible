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