import gql from "graphql-tag";
import Vue from "vue";
import { DocumentNode } from "graphql";
import { OperationVariables, ApolloQueryResult } from "apollo-boost";
import { BaseInput, LoginInput, UserInfo, UserInfoResult } from "@/struct";
import { Snack } from './snack';
import { server } from "@/plugins/vue-apollo"

const gqlSubscription = {
  chat: gql`
  subscription($groupIds: [String]) {
    chat(groupIds: $groupIds) {
      groupId
      msgs {
        type
        msg
        senderId
      }
    }
  }
  `
};

const gqlMutation = {
  register: gql`
    mutation($input: RegisterInput!) {
      register(input: $input) {
        userId
        role
      }
    }
  `,

  login: gql`
    mutation($input: LoginInput!) {
      login(input: $input) {
        userId
        role
      }
    }
  `,

  logout: gql`
    mutation {
      logout {
        message
      }
    }
  `,

  sendMsg: gql`
    mutation($input: ChatMsgInput!) {
      sendMsg(input: $input) {
        message
      }
    }
  `,

  comment: gql`
    mutation($input: CommentInput!) {
      commentChange(input: $input) {
        message
      }
    }
  `
};

const gqlQuery = {
  departmentsDetails: gql`
    query {
      departments {
        departId
        name
        majors {
          majorId
          name
        }
      }
    }
  `,

  user: gql`
    query($userId: String!) {
      user(id: $userId) {
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
  `,

  group: gql`
    query($groupId: String!) {
      group(id: $groupId) {
        groupId
        name
        users {
          userId
          avatar
          name
        }
      }
    }
  `,

  groupsDetailed: gql`
    query($userId: String) {
      groups(userId: $userId) {
        groupId
        name
      }
    }
  `,

  groups: gql`
    query($userId: String) {
      groups(userId: $userId) {
        groupId
        name
        users {
          userId
          avatar
          name
        }
      }
    }
  `,

  course: gql`
    query($courseId: String!) {
      course(id: $courseId) {
        courseId
        liveId
        timeOpen
        timeClose
        state
        cover
        title
        description
        organize
        coursewares {
          coursewareId
          name
          type
          timeCreate
          timeModified
        }
        teachers {
          userId
          name
          avatar
        }
        assistants {
          userId
          name
          avatar
        }
        tags {
          tagId
          name
        }
        teach
        joined
        comments {
          commentId
          user {
            userId
            name
            avatar
          }
          details
          timeCreate
          timeModified
          replyTo
        }
        userCount
        sentiGood
        sentiAvg
      }
    }
  `,

  courses: gql`
    query {
      courses {
        courseId
        title
        cover
        description
        state
        timeOpen
        timeClose
        teach
      }
    }
  `,

  comments: gql`
    query($courseId: String!) {
      comments(courseId: $courseId) {
        commentId
        user {
          userId
          name
          avatar
        }
        details
        timeCreate
        timeModified
        replyTo
      }
    }
  `
};


Vue.prototype.apolloQuery = function<R = any, T = OperationVariables>(
  query: DocumentNode,
  data?: T,
  call_after?: (res: R) => void,
  snack?: Snack,
  disableCache: boolean = false 
) {
  let vue: Vue = this;
  if(call_after && snack) {
    snack.loading = true;
    vue.$apollo
      .query<R, T>({
        query: query,
        variables: data!,
        fetchPolicy: disableCache ? 'no-cache' : 'cache-first'
      })
      .then((res) => call_after(res.data))
      .catch((err) => snack.showInfo(err))
      .finally(() => snack.loading = false)
  } 
  else
    return vue.$apollo
      .query<R, T>({
        query: query,
        variables: data
      });
};

Vue.prototype.apolloMutate = function<R = any, T = OperationVariables>(
  mutation: DocumentNode,
  data?: T,
  call_after?: (res: R | null | undefined) => void,
  snack?: Snack
) {
  let vue: Vue = this;
  if(call_after && snack){
    vue.$apollo
      .mutate<R, BaseInput<T>>({
        mutation: mutation,
        variables: { input: data! }
      })
      .then((res) => { 
        call_after(res.data)
      })
      .catch((err) => snack.showInfo(err))
      .finally(() => snack.loading = false)
  }
  else
    return vue.$apollo
      .mutate<R, BaseInput<T>>({
        mutation: mutation,
        variables: { input: data! }
      });
};

Vue.prototype.getUserInfo = function (
  call_after?: (data: UserInfo)=>void, 
  snack?: Snack,
  userId?: string
) {
  let vue: Vue = this;
  vue.apolloQuery<UserInfoResult>(
    gqlQuery.user, 
    { userId: userId || "" }, 
    (data) => {
      this.$store.commit("global/setUserInfo", { userInfo: data.user });
      call_after!(data.user);
    }, 
    snack!);
}

function img(fileName: string) {
  return "http://" + server + "/img/" + fileName;
}

function video(fileName: string) {
  return "http://" + server + "/video/" + fileName;
}

function doc(fileName: string) {
  return "http://" + server + "/doc/" + fileName;
}

export { gqlQuery, gqlMutation, gqlSubscription, img, video, doc};
