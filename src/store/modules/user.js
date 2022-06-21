import { login, getInfo } from "@/api/login";
import { getToken, setToken, removeToken } from '@/utils/auth';

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    permissions: []
  };
};
const state = getDefaultState();
const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState());
  },
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles;
  },
  SET_PERMISSIONS: (state, permissions) => {
    state.permissions = permissions;
  }
};

const actions = {
  // 登录
  login ({ commit }, userInfo) {
    const username = userInfo.username.trim();
    const password = userInfo.password;
    const code = userInfo.code;
    const uuid = userInfo.uuid;
    return new Promise((resolve, reject) => {
      login(username, password, code, uuid)
        .then(res => {
          setToken(res.token);
          commit("SET_TOKEN", res.token);
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  // 获取用户信息
  getInfo ({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token)
        .then(res => {
          const user = res.user;
          const avatar =
            !user.avatar
              ? require("@/assets/image/profile.jpg")
              : process.env.VUE_APP_BASE_API + user.avatar;
          // 验证返回的roles是否是一个非空数组
          if (res.roles && res.roles.length > 0) {
            commit("SET_ROLES", res.roles);
            commit("SET_PERMISSIONS", res.permissions);
          } else {
            commit("SET_ROLES", ["ROLE_DEFAULT"]);
          }
          commit("SET_NAME", user.userName);
          commit("SET_AVATAR", avatar);
          resolve(res);
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // 退出登录
  logout ({ commit }) {
    return new Promise((resolve) => {
      commit("SET_TOKEN", "");
      commit("SET_ROLES", []);
      commit("SET_PERMISSIONS", []);
      removeToken();
      resolve();
    });
  },
  // 清除Token
  resetToken ({ commit }) {
    return new Promise(resolve => {
      removeToken(); // must remove  token  first
      commit('RESET_STATE');
      resolve();
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};

