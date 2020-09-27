import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const p = {
    id: "project_id1",
    name: "Project 1",
    rules: [
        {
            id: "rule_id1",
            name: "Rule 1",
            startUrls: ["https://www.ixigua.com/search/变态手机无限元宝游戏有哪些"],
            example: "http://www.baidu.com",
            links: [
                {
                    id: "" + Math.random(),
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

export function createStore() {
    const store = new Vuex.Store({
        state: () => ({
            projects: [p],
            project: {},
            rule: {},
            ruleLink: {},
            ruleContent: {}
        }),
        mutations: {
            LOAD_PROJECT(state, p) {
                state.project = p
            },
            LOAD_RULE(state, rule) {
                state.rule = rule
            },
            LOAD_RULE_LINK(state, ruleLink) {
                state.ruleLink = ruleLink
            },
            ADD_RULE(state, rule) {
                state.project.rules.push(rule)
            },
            ADD_RULE_LINK(state, ruleLink) {
                state.rule.links.push(ruleLink)
            },
            ADD_RULE_CONTENT(state, content) {
                state.project.contents.push(content)
                state.ruleContent = content
            },
            SET_RULE_LINK_SELECTOR(state, cssSelector) {
                state.ruleLink.selector = cssSelector
            },
            SET_RULE_LINK_URLS(state, urls) {
                state.ruleLink.urls = urls
            },
            CLEAN_EXTEND_URLS(state, ruleLinkId) {
                for (const rule of state.project.rules) {
                    if (rule.extendUrls && rule.extendUrls[ruleLinkId]) {
                        delete rule.extendUrls[ruleLinkId]
                        break
                    }
                }
            },
            SET_EXTEND_URLS(state, { ruleLinkId, handlerId, urls }) {
                for (const rule of state.project.rules) {
                    if (rule.id === handlerId) {
                        if (!rule.extendUrls) {
                            rule.extendUrls = {}
                        }
                        rule.extendUrls[ruleLinkId] = urls
                        break
                    }
                }
            }
        },
        actions: {
            ADD_RULE({ commit }, rule) {
                const r = Object.assign({
                    links: [],
                    contents: []
                }, rule)
                commit("ADD_RULE", r)
                commit("LOAD_RULE", r)
            },
            ADD_RULE_LINK({ commit }, ruleLink) {
                commit("ADD_RULE_LINK", ruleLink)
                commit("LOAD_RULE_LINK", ruleLink)
            },
            CHANGE_RULE_LINK_HANDLER({ commit }, { ruleLinkId, handlerId, urls }) {
                commit("CLEAN_EXTEND_URLS", ruleLinkId)
                commit("SET_EXTEND_URLS", { ruleLinkId, handlerId, urls })

            },
            UPDATE_RULE_LINK_EXTRACTED({ state, commit }, urls) {
                const ruleLink = state.ruleLink
                commit("SET_RULE_LINK_URLS", urls)
                commit("CLEAN_EXTEND_URLS", ruleLink.id)
                commit("SET_EXTEND_URLS", { ruleLinkId: ruleLink.id, handlerId: ruleLink.handler, urls })
            }
        }
    })
    return store
}