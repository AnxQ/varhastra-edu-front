import { Module } from "vuex";
import { GroupInfo, GroupChatMsg, ChatMsg, UserInfo } from '@/struct';

interface GroupState {
    [key: string]: { 
        name: string;
        users: {[key: string] : UserInfo }
        msgs: ChatMsg[] }
}

const GroupStateStore: Module<GroupState, {}> = {
    namespaced: true,
    state: {},
    mutations: {
        addGroupInfo(state, { groupInfo } : { groupInfo: GroupInfo }) {
            state[groupInfo.groupId] = {
                name: groupInfo.name,
                users: {},
                msgs: []
            };
            groupInfo.users.forEach((user) => {
                state[groupInfo.groupId].users[user.userId] = user
            })
        },
        addMessage(state, {groupChatMsg}: { groupChatMsg: GroupChatMsg }) {
            state[groupChatMsg.groupId].msgs = state[groupChatMsg.groupId].msgs.concat(groupChatMsg.msgs);
        },
        removeGroupInfo(state, {groupId}) {
            delete state[groupId]
        },
        updateGroupInfo(state, { groupInfo } : { groupInfo: GroupInfo }) {
            state[groupInfo.groupId].name = groupInfo.name;
            groupInfo.users.forEach((user) => {
                if (!!state[groupInfo.groupId].users[user.userId])
                    state[groupInfo.groupId].users[user.userId] = user
            })
        }
    }
}

export default GroupStateStore;