import Vue from "vue";
import { Snack } from "@/snack";
import { DocumentNode } from "graphql";
import {
  OperationVariables,
  ApolloQueryResult,
  FetchResult
} from "apollo-boost";
import { UserInfo } from "./struct";

declare module "vue/types/vue" {
  interface Vue {
    apolloQuery<R = any, T = OperationVariables>(
      query: DocumentNode,
      data?: T,
      call_after?: (res: R) => void,
      snack?: Snack,
      disableCache?: boolean
    ): Promise<ApolloQueryResult<R>> | void,
    apolloMutate<R = any, T = OperationVariables>(
      mutation: DocumentNode,
      data?: T,
      call_after?: (res: R) => void,
      snack?: Snack,
    ): Promise<FetchResult<R>> | void,
    getUserInfo(
      call_after?: (data: UserInfo)=>void, 
      snack?: Snack,
      userId?: string
    ): Promise<UserInfo> | void;
  }
}
