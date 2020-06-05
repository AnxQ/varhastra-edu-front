<template>
  <v-container fill-height>
    <!-- {{$route.params.user_id}} -->
    <v-row class="mt-5">
      <v-spacer></v-spacer>
      <v-col cols="6">
        <v-row>
          <v-card class="mx-auto outer">
            <v-card class="inner pa-4">
              <v-row class="avatar">
                <v-spacer></v-spacer>
                <v-tooltip right>
                  <template v-slot:activator="{ on }">
                    <v-avatar
                      class="hoverable"
                      :color="snack.loading ? 'grey' : 'blue'"
                      size="64"
                      v-on="on"
                    >
                      <user-avatar
                        class="white--text"
                        :v-if="!snack.loading"
                        :url="userInfo.avatar"
                        :size="64"
                        :name="userInfo.name"
                        :key="userInfo.avatar"
                      ></user-avatar>
                    </v-avatar>
                  </template>
                  <span>点击更换</span>
                </v-tooltip>
                <v-spacer></v-spacer>
              </v-row>
              <v-form>
                <v-row>
                  <v-col cols="6">
                    <v-text-field
                      :loading="snack.loading"
                      readonly
                      label="姓名"
                      :value="userInfo.name"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      :loading="snack.loading"
                      readonly
                      label="身份"
                      :value="role"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row
                  v-if="$store.state.global.userId == $route.params.user_id"
                >
                  <v-col cols="6">
                    <v-text-field
                      :loading="snack.loading"
                      readonly
                      :value="userInfo.department.name"
                      label="学院"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      :loading="snack.loading"
                      readonly
                      :value="userInfo.major.name"
                      label="专业"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="6">
                    <v-text-field
                      :loading="snack.loading"
                      readonly
                      label="账号状态"
                      :value="state"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      :loading="snack.loading"
                      readonly
                      label="注册时间"
                      :value="userInfo.joinDate"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row
                  v-if="$store.state.global.userId == $route.params.user_id"
                >
                  <v-col cols="6">
                    <v-text-field
                      :loading="snack.loading"
                      readonly
                      label="邮箱"
                      :value="userInfo.mail"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-form>
            </v-card>
          </v-card>
        </v-row>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
    <Log :snack="snack"></Log>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { Route } from "vue-router";
import constValue from "@/constValue";
import UserAvatar from "@/components/UserAvatar.vue";
import Log from "@/components/Log.vue";
import { UserInfo, UserInfoResult, DepartmentInfo, MajorInfo } from "@/struct";
import gql from "graphql-tag";
import { Snack } from '../snack';

@Component({
  components: {
    UserAvatar,
    Log
  }
})
export default class Profile extends Vue {
  private snack: Snack = new Snack();
  private userInfo: UserInfo = {
    userId: "",
    name: "",
    avatar: "",
    number: "",
    department: {
      departId: "",
      name: "",
      majors: []
    },
    major: {
      majorId: "",
      name: ""
    },
    mail: "",
    role: -1,
    motto: "",
    state: -1,
    gender: "",
    joinDate: ""
  };

  private get role() {
    return constValue.userRole[this.userInfo.role];
  }

  private get state() {
    return constValue.userState[this.userInfo.state];
  }

  mounted() {
    this.getUserInfo((userInfo) => this.userInfo = userInfo, this.snack);
  }

  @Watch("$route")  
  beforeRouteUpdate(to: Route) {
    this.getUserInfo((userInfo) => this.userInfo = userInfo, this.snack, to.params.user_id);
  }
}
</script>

<style lang="scss" scoped>
.avatar {
  width: 100%;
  margin-top: -48px;
}

.hoverable:hover {
  cursor: pointer;
}

.inner {
  background: transparent;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.4) inset;
}

.table {
  width: 100%;
}
</style>