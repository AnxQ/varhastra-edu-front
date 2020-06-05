<template>
  <v-app id="app">
    <v-navigation-drawer app clipped permanent :mini-variant="drawer" :expand-on-hover="drawer">
      <nav-list :isLogin="!!$store.state.global.userId"></nav-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left clipped-right class="higher pr-2">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Varhastra Edu</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu
        offset-y
        v-if="!!$store.state.global.userInfo"
        nudge-bottom="19"
        transition="slide-y-transition"
        :close-on-content-click="false"
      >
        <template v-slot:activator="{ on }">
          <v-avatar
            class="hoverable"
            :color="false ? 'grey' : 'blue'"
            size="48"
            v-on="on"
          >
            <user-avatar
              class="white--text"
              :url="$store.state.global.userInfo.avatar"
              :size="64"
              :name="$store.state.global.userInfo.name"
              :key="$store.state.global.userInfo.avatar"
            ></user-avatar>
          </v-avatar>
        </template>
        <v-card>
          <v-list>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>{{
                  $store.state.global.userInfo.name
                }}</v-list-item-title>
                <v-list-item-subtitle class="grey--text"
                  >学工号:
                  {{
                    $store.state.global.userInfo.number
                  }}</v-list-item-subtitle
                >
              </v-list-item-content>

              <v-list-item-action>
                <v-btn :class="fav ? 'red--text' : ''" icon @click="fav = !fav">
                  <v-icon>mdi-heart</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>

          <v-divider></v-divider>

          <v-list>
            <v-list-item>
              <v-list-item-action>
                <v-switch color="purple"></v-switch>
              </v-list-item-action>
              <v-list-item-title>群组消息通知</v-list-item-title>
            </v-list-item>
          </v-list>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="logout">注销</v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </v-app-bar>

    <v-content>
      <router-view :key="$route.query.time" />
      <v-snackbar v-model="hasInfo" top :timeout="3000">
        {{ infoTitle }}
        <br />
        {{ infoText }}
        <v-spacer></v-spacer>
        <v-btn icon>
          <v-icon @click="hasInfo = false">close</v-icon>
        </v-btn>
      </v-snackbar>
    </v-content>

    <v-footer app padless class="higher">
      <v-col class="text-center pa-1">
        <span> <strong>Varhastra Edu</strong> &copy; 2019 </span>
      </v-col>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import gql from "graphql-tag";
import NavList from "@/components/NavList.vue";
import UserAvatar from "@/components/UserAvatar.vue";
import { gqlQuery } from "@/fetch"
import { LogoutResult, UserInfoResult } from "@/struct";

@Component({
  components: {
    NavList,
    UserAvatar
  }
})
export default class App extends Vue {
  private drawer: boolean | null = null;
  private permissioned: boolean = false;
  private fav: boolean = false;

  private infoTitle: string = "";
  private infoText: string = "";
  private hasInfo: boolean = false;

  mounted() {
    let userId = sessionStorage.getItem("user_id") || null;
    let role = sessionStorage.getItem("role") || null;
    if (!userId || !role) {
      userId = null;
      role = null;
    }
    gqlQuery.user
    this.$store.commit("global/setUserIdAndRole", { userId, role });
    if (userId && role)
      this.getUserInfo()
  }

  async logout() {
    try {
      let res = await this.$apollo.mutate<LogoutResult, {}>({
        mutation: gql`
          mutation {
            logout {
              message
            }
          }
        `
      });
      this.$store.commit("global/resetUserIdAndRole");
      this.$store.commit("global/resetUserInfo");
      sessionStorage.removeItem("user_id");
      sessionStorage.removeItem("role");
      this.$router.push("/");
      // must logout success
      if (res.errors) throw res.errors.map(v => v.message).join(",");
      if (res.data!.logout.message) throw res.data!.logout.message;
    } catch (e) {
      console.log(e.toString());
    }
  }
}
</script>

<style lang="scss">
html {
  overflow: hidden;
}

.higher {
  z-index: 3;
}

.hoverable:hover {
  cursor: pointer;
}

.bar-menu {
  top: 75px;
}
</style>
