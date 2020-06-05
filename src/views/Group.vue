<template>
  <v-container fluid class="fill-height d-flex flex-row">
    
    <v-navigation-drawer
      app
      right
      permanent
      clipped
      expand-on-hover
    >
      <v-sheet
        id="scrolling-techniques"
        class="overflow-y-auto"
        :max-height="maxListHeight"
        :width="256"
      >
        <v-spacer/>
        <v-list-item class="px-2">
        <v-btn
          icon
          @click.stop="groupDrawer = !groupDrawer"
        >
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <v-subheader>全部群组</v-subheader>
        </v-list-item>
        <v-list avatar rounded dense nav expand>
          <v-list-item-group v-model="current" @change="changeGroup" color="primary">
            <v-list-item v-for="group in groups" :key="group.groupId">
              <v-list-item-icon>
                <v-icon>group</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="group.name"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-sheet>
    </v-navigation-drawer>

    <v-container>
      <v-app-bar>
        <v-toolbar-title v-if="currentGroup">{{ currentGroup.name }}</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-app-bar>
      <v-sheet
        id="scrolling-techniques"
        class="overflow-y-auto"
        :height="maxChatHeight"
      >
        <v-container v-if="currentGroup">
          <v-row  v-for="(msg, i) in currentGroup.msgs" :key="i">
              <v-list-item three-line>
                <v-list-item-avatar>
                  <v-avatar
                    class="hoverable"
                    :color="false ? 'grey' : 'blue'"
                    size="48"
                  >
                    <user-avatar
                      class="white--text"
                      :url="currentGroup.users[msg.senderId].avatar"
                      :size="64"
                      :name="currentGroup.users[msg.senderId].name"
                      :key="currentGroup.users[msg.senderId].avatar"
                    ></user-avatar>
                  </v-avatar>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{ currentGroup.users[msg.senderId].name }}</v-list-item-title>
                  <p class="font-weight-light" style="max-width: 384px">{{ msg.msg }}</p>
                </v-list-item-content>
              </v-list-item>
          </v-row>
          <v-divider id="chat-bottom"></v-divider>
        </v-container>
      </v-sheet>
      <v-container>
        <v-text-field
          v-model="message"
          label="即时消息"
          prepend-icon="message"
          append-outer-icon="mdi-send"
          clear-icon="mdi-close-circle"
          outlined
          clearable
          dense
          :disabled="!currentGroup"
          :loading="snack.loading"
          @click:append-outer="sendMessage"
          @keydown.enter="sendMessage"
        ></v-text-field>
      </v-container>
    </v-container>
    <Log :snack="snack"></Log>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { GroupInfo, ChatMsg, SendMsgResult, GroupChatMsgResult, ManyGroupInfoResult, UserInfo, ChatMsgInput } from "@/struct";
import { gqlMutation, gqlSubscription, gqlQuery } from "@/fetch";
import UserAvatar from "@/components/UserAvatar.vue";
import Log from "@/components/Log.vue"
import { subscribe } from 'graphql';
import snack, { Snack } from '../snack';

@Component({
  components: {
    UserAvatar,
    Log
  }
})
export default class Home extends Vue {
  private current: number | null = null;
  private currentGroup: { 
    name: string,
    users: {[key: string] : UserInfo },
    msgs: ChatMsg[]
  } | null = null;
  private currentGroupId: string = "";
  private expand: boolean = true;
  private groups: GroupInfo[] = [];
  private groupDrawer: boolean = true;
  private maxChatHeight: number = window.innerHeight - 184 - 110;
  private maxListHeight: number = window.innerHeight - 120;
  private message: string = "";
  private form = {
    bio: 0
  };
  private snack: Snack = new Snack();
  mounted() {
    window.onresize = () => {
      this.maxChatHeight = window.innerHeight - 184 - 110;
      this.maxListHeight = window.innerHeight - 120;
    };
    this.queryUserGroups()
  }

  changeGroup(i: number | undefined) {
    if (i || i == 0) {
      this.currentGroupId = this.groups[i!].groupId;
      this.currentGroup = this.$store.state.group[this.currentGroupId]
    }
  }

  queryUserGroups () {
    this.apolloQuery<ManyGroupInfoResult, { userId: string}>(
      gqlQuery.groups,
      { userId: this.$store.state.global.userId },
      (data) => {
        this.groups = data.groups
        this.groups.map(group => this.$store.commit('group/addGroupInfo',{ groupInfo: group }))
        this.subscribeGroup(data.groups.map(g => g.groupId))
      },
      this.snack
    )
  }

  sendMessage(event:KeyboardEvent) {
    // if (event.keyCode == 13)
      this.apolloMutate<SendMsgResult, ChatMsgInput>(
        gqlMutation.sendMsg,
        { groupId: this.currentGroupId, type: "text", msg: this.message },
        (data) => {
          this.message = "";
          this.$vuetify.goTo(10, { 
            container: "#scrolling-techniques", 
            duration: 500,
            easing: "easeInOutCubic", 
            offset: 0})
        },
        this.snack
      )
  }
  
  subscribeGroup(groupIds: string[]) {
    this.$apollo.subscribe<GroupChatMsgResult, { groupIds: string[] }>({
      query: gqlSubscription.chat,
      variables: { groupIds: groupIds }
    }).subscribe(
      (res) => { 
        if (res.data) {
          this.$store.commit("group/addMessage", { groupChatMsg: res.data.chat })
        }
        else if(res.errors)
          this.snack.showInfo(res.errors[0])
       }, 
      (err) => {}
    );
  }
}
</script>

<style lang="scss" scoped>
.sub-container {
  padding-left: 16px !important;
  padding-top: 0px !important;
  padding-bottom: 0px !important;
}

.hoverable:hover {
  cursor: pointer;
}

</style>
