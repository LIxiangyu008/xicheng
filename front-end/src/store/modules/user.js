import { apiGetUserInfo,getModules } from './../../apis/api'

const state = {
    userInfo: null,
    modules: null
}

const mutations = {
    addUser(state, userInfo) {
        state.userInfo = userInfo;
    },
    addModules(state, modules) {
      state.modules = modules;
    }
}

const actions = {
    getUserInfo({ commit }, userInfo) {
        return new Promise(async (resolve, reject) => {
            const { data } = await apiGetUserInfo();
            if (typeof data === 'object') {
                commit('addUser', data.resultInfo.data);
                let url = 'module/permis/'+data.resultInfo.data.pkid+'.json'
                getModules(url).then((res) => {
                  if(res.data && res.data.success){
                    let modules = res.data.data.modules[0].children[0].children
                    commit('addModules', modules);
                  }
                })
                resolve(data.resultInfo.data);
            }
        })
    },

}

export default {
    state,
    mutations,
    actions
}
