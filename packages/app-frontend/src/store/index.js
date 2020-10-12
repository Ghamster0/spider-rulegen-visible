import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export function createStore() {
    const store = new Vuex.Store({
        state: () => ({
            projects: [],
            project: {},
            rule: {},
            ruleLink: {},
            ruleContent: {}
        }),
        mutations: {
            LOAD_PROJECT(state, p) {
                state.project = p
            },
            ADD_PROJECT(state, project) {
                state.projects.push(project)
            },
            REMOVE_PROJECT(state, project) {
                const index = state.projects.indexOf(project)
                if (index >= 0) {
                    state.projects.splice(index, 1)
                }
            },
            LOAD_RULE(state, rule) {
                state.rule = rule
            },
            ADD_RULE(state, rule) {
                state.project.rules.push(rule)
            },
            REMOVE_RULE(state, rule) {
                const index = state.project.rules.indexOf(rule)
                if (index >= 0) {
                    state.project.rules.splice(index, 1)
                }
            },
            LOAD_RULE_LINK(state, ruleLink) {
                state.ruleLink = ruleLink
            },
            ADD_RULE_LINK(state, ruleLink) {
                state.rule.links.push(ruleLink)
            },
            REMOVE_RULE_LINK(state, ruleLink) {
                const index = state.rule.links.indexOf(ruleLink)
                if (index >= 0) {
                    state.rule.links.splice(index, 1)
                }
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
            },
            CLEAN_DEPEND_HANDLERS(state, ruleId) {
                for (const rule of state.project.rules) {
                    for (const lx of rule.links) {
                        if (lx.handler === ruleId) {
                            lx.handler = ""
                        }
                    }
                }
            }
        },
        actions: {
            ADD_PROJECT({ commit }, project) {
                commit("ADD_PROJECT", project)
                commit("LOAD_PROJECT", project)
            },
            REMOVE_PROJECT({ commit, state }, project) {
                commit("REMOVE_PROJECT", project)
                if (state.project === project) {
                    commit("LOAD_PROJECT", {})
                    commit("LOAD_RULE", {})
                }
            },
            ADD_RULE({ commit }, rule) {
                commit("ADD_RULE", rule)
                commit("LOAD_RULE", rule)
            },
            REMOVE_RULE({ commit, state }, rule) {
                commit("CLEAN_DEPEND_HANDLERS", rule.id)
                if (state.rule === rule) {
                    commit("LOAD_RULE_LINK", {})
                    commit("LOAD_RULE", {})
                }
                for (const r of rule.links) {
                    commit("CLEAN_EXTEND_URLS", r.id)
                }
                commit("REMOVE_RULE", rule)
            },
            ADD_RULE_LINK({ commit }, ruleLink) {
                commit("ADD_RULE_LINK", ruleLink)
                commit("LOAD_RULE_LINK", ruleLink)
            },
            REMOVE_RULE_LINK({ commit }, ruleLink) {
                commit("CLEAN_EXTEND_URLS", ruleLink.id)
                commit("REMOVE_RULE_LINK", ruleLink)
                commit("LOAD_RULE_LINK", {})
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