import { Module } from "vuex";
import { DepartmentInfo, UserInfo } from "@/struct";

interface GlobalState {
  userId: string | null;
  role: string | null;
  departments: DepartmentInfo[] | null;
  userInfo: UserInfo[] | null;
}

const GlobalStateStore: Module<GlobalState, {}> = {
  namespaced: true,
  state: {
    userId: null,
    role: null,
    userInfo: null,
    departments: null
  },
  mutations: {
    setUserIdAndRole(state, { userId, role }) {
      state.userId = userId;
      state.role = role;
    },
    resetUserIdAndRole(state) {
      state.userId = null;
      state.role = null;
    },

    setDepartments(state, { departments }) {
      state.departments = departments;
    },
    setUserInfo(state, { userInfo }) {
      state.userInfo = userInfo
    },
    resetUserInfo(state) {
      state.userInfo = null
    }
  },
  actions: {}
};

export default GlobalStateStore;
