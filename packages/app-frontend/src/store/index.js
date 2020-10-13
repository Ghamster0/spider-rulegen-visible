import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export function createStore() {
    const store = new Vuex.Store({
        state: () => ({
            sites: [],
            site: {},
            rule: {},
            ruleLink: {},
            ruleContent: {}
        }),
        mutations: {
            LOAD_SITE(state, p) {
                state.site = p
            },
            ADD_SITE(state, site) {
                state.sites.push(site)
            },
            REMOVE_SITE(state, site) {
                const index = state.sites.indexOf(site)
                if (index >= 0) {
                    state.sites.splice(index, 1)
                }
            },
            LOAD_RULE(state, rule) {
                state.rule = rule
            },
            ADD_RULE(state, rule) {
                state.site.rules.push(rule)
            },
            REMOVE_RULE(state, rule) {
                const index = state.site.rules.indexOf(rule)
                if (index >= 0) {
                    state.site.rules.splice(index, 1)
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
                state.site.contents.push(content)
                state.ruleContent = content
            },
            SET_RULE_LINK_SELECTOR(state, cssSelector) {
                state.ruleLink.selector = cssSelector
            },
            SET_RULE_LINK_URLS(state, urls) {
                state.ruleLink.urls = urls
            },
            CLEAN_EXTEND_URLS(state, ruleLinkId) {
                for (const rule of state.site.rules) {
                    if (rule.extendUrls && rule.extendUrls[ruleLinkId]) {
                        delete rule.extendUrls[ruleLinkId]
                        break
                    }
                }
            },
            SET_EXTEND_URLS(state, { ruleLinkId, handlerId, urls }) {
                for (const rule of state.site.rules) {
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
                for (const rule of state.site.rules) {
                    for (const lx of rule.links) {
                        if (lx.handler === ruleId) {
                            lx.handler = ""
                        }
                    }
                }
            }
        },
        actions: {
            ADD_SITE({ commit }, site) {
                commit("ADD_SITE", site)
                commit("LOAD_SITE", site)
            },
            REMOVE_SITE({ commit, state }, site) {
                commit("REMOVE_SITE", site)
                if (state.site === site) {
                    commit("LOAD_SITE", {})
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