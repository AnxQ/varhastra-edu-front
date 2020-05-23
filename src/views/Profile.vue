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
                      :color="loading ? 'grey' : 'blue'"
                      size="64"
                      v-on="on"
                    >
                      <user-avatar
                        class="white--text"
                        :url="userInfo.avatar"
                        :size="64"
                        :name="userInfo.name"
                        :key="userInfo.avatar"
                      ></user-avatar>
                    </v-avatar>
                  </template>
                  <span>avatar service based on Gravatar</span>
                </v-tooltip>
                <v-spacer></v-spacer>
              </v-row>
              <v-form>
                <v-row>
                  <v-col cols="6">
                    <v-text-field
                      :loading="loading"
                      readonly
                      label="姓名"
                      :value="userInfo.name"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      :loading="loading"
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
                      :loading="loading"
                      readonly
                      :value="userInfo.department.name"
                      label="学院"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      :loading="loading"
                      readonly
                      :value="userInfo.major.name"
                      label="专业"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="6">
                    <v-text-field
                      :loading="loading"
                      readonly
                      label="账号状态"
                      :value="state"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      :loading="loading"
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
                      :loading="loading"
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
    <v-snackbar v-model="hasInfo" right bottom :timeout="3000">
      {{ infoText }}
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon @click="hasInfo = false">close</v-icon>
      </v-btn>
    </v-snackbar>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { Route } from "vue-router";
import constValue from "@/constValue";
import UserAvatar from "@/components/UserAvatar.vue";
import {
  UserInfo,
  UserInfoResult,
  DepartmentInfo,
  MajorInfo,
} from "@/struct";
import gql from "graphql-tag";

@Component({
  components: {
    UserAvatar
  }
})
export default class Profile extends Vue {
  private loading: boolean = false;
  private userInfo: UserInfo = {
    userId: "",
    name: "",
    avatar: "",
    number: "",
    department: { 
      departId: "", 
      name: "",
      majors: [] },
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


  private infoText: string = "";
  private hasInfo: boolean = false;

  private get role() {
    return constValue.userRole[this.userInfo.role]
  }

  private get state() {
    return constValue.userState[this.userInfo.state]
  }

  async mounted() {
    await this.load(this.$route.params.user_id);
  }

  @Watch("$route")
  async beforeRouteUpdate(to: Route) {
    await this.load(to.params.user_id);
  }

  async load(userId: string) {
    try {
      let res = await this.$apollo.query<UserInfoResult, { userId: string }>({
        query: gql`
          query($userId: String!) {
            user(id: $userId) {
              message
              user {
                userId
                name
                avatar
                number
                department {
                  departId
                  name
                }
                major {
                  majorId
                  name
                }
                mail
                role
                motto
                state
                gender
                joinDate
              }
            }
          }
        `,
        variables: {
          userId: userId
        },
        fetchPolicy: "no-cache"
      });
      if (res.errors) throw res.errors.map(v => v.message).join(",");
      if (res.data!.user.message) throw res.data!.user.message;
      this.userInfo = res.data!.user.user;
      this.loading = false;
    } catch (e) {
      this.loading = false;
      this.infoText = e.toString();
      this.hasInfo = true;
    }
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
