import { template } from 'lodash'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const p = {
    id: "15615-1135-1-65156102-1sd",
    name: "Group Default",
    rules: [
        {
            id: "rule_id1",
            name: "Rule 1",
            startUrls: ["http://www.baidu.com", "http://www.sogou.com"],
            example: "http://www.baidu.com",
            links: [
                {
                    id: "" + Math.random(),
                    name: "下一页",
                    selector: ".links",
                    urls: [
                        "http://www.baidu.com",
                        "https://www.sogou.com"
                    ],
                    handler: ""
                },
            ],
            contentsConf: null
        }
    ]
}

function getRule(state, groupId, ruleId) {
    const group = state.groups.find(i => i.id === groupId)
    return group && group.rules.find(i => i.id === ruleId)
}

export function createStore() {
    const store = new Vuex.Store({
        state: () => ({
            mode: "multi",
            groups: [p],
            group: {},
            groupId: null,
            rules: [],
            rule: {},
            ruleId: null
        }),
        mutations: {
            LOAD_GROUP(state, id) {
                const idx = state.groups.findIndex(i => i.id === id)
                if (idx >= 0) {
                    state.groupId = id
                    state.group = state.groups[idx]
                    state.rules = state.group.rules
                } else {
                    state.groupId = null
                    state.group = {}
                    state.rules = []
                }
            },
            PUSH_GROUP(state, group) {
                state.groups.push(group)
            },
            SPLICE_GROUP(state, id) {
                const idx = state.groups.findIndex(i => i.id === id)
                if (idx >= 0) {
                    state.groups.splice(idx, 1)
                }
                console.log(state.groups, idx)
            },
            LOAD_RULE(state, id) {
                const idx = state.rules.findIndex(i => i.id === id)
                if (idx >= 0) {
                    state.rule = state.rules[idx]
                    state.ruleId = id
                } else {
                    state.ruleId = null
                    state.rule = {}
                }
            },
            SET_RULE(state, rule) {
                const idx = state.rules.findIndex(i => i.id === rule.id)
                if (idx >= 0) {
                    state.rules[idx] = { ...state.rules[idx], ...rule }
                    if (state.rule.id === rule.id) {
                        state.rule = state.rules[idx]
                    }
                }
            },
            PUSH_RULE(state, rule) {
                state.rules.push(rule)
            },
            SPLICE_RULE(state, id) {
                const idx = state.rules.findIndex(i => i.id === id)
                if (idx >= 0) {
                    state.rules.splice(idx, 1)
                    if (state.ruleId === id) {
                        state.ruleId = null
                        state.rule = {}
                    }
                }
            },
            SET_RULE_LINK(state, { indicator, linkConf }) {
                console.log(indicator, linkConf)
                const rule = getRule(state, indicator.groupId, indicator.ruleId)
                if (rule) {
                    const lx = rule.links.find(i => i.id === indicator.id)
                    if (lx) {
                        Object.assign(lx, linkConf)
                    }
                }
            },
            SET_RULE_EXTRACT(state, { indicator, templatePatch }) {
                const rule = getRule(state, indicator.groupId, indicator.ruleId)

                function recursionFind(item, id) {
                    if (item.id === id)
                        return item
                    if (item.listData) {
                        for (const childItem of item.listData) {
                            const res = recursionFind(childItem, id)
                            if (res)
                                return res
                        }
                    }
                    return null
                }

                if (rule) {
                    const item = recursionFind(rule.contentsConf, indicator.id)
                    console.log(item)
                    if (item) {
                        if (templatePatch.selector) {
                            templatePatch.rawSelector = templatePatch.selector
                        }
                        Object.assign(item, templatePatch)
                    }
                }
            }
        },
        actions: {
            selectGroup({ commit, state }, id) {
                if (state.groupId !== id) {
                    this.dispatch("selectRule", null)
                    commit("LOAD_GROUP", id)
                }
            },
            deleteGroup({ commit, state }, id) {
                commit("SPLICE_GROUP", id)
                if (state.groupId === id) {
                    commit("LOAD_GROUP", null)
                }
            },
            selectRule({ commit, state }, id) {
                if (state.rule.id !== id) {
                    commit("LOAD_RULE", id)
                }
            },
            deleteRule({ commit, state }, id) {
                commit("SPLICE_RULE", id)
                if (state.ruleId === id) {
                    commit("LOAD_RULE", null)
                }
            },
        }
    })
    return store
}