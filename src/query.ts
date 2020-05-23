import gql from "graphql-tag";
import { DocumentNode } from 'graphql';
import { OperationVariables } from 'apollo-boost';

const gqlQuery = {
    user: gql`
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
    }`,

    login: gql`
    `
}

function apolloQuery<R = any, T = OperationVariables>( vue: Vue, query: DocumentNode, data: T) {
    vue.$apollo.query<R, T>({
        query: query,
        variables: data
    }).then((res) => {
        if (res.errors) return res.errors.map(v => v.message).join(",");
        return res.data!;
    }).catch((err)=>{
        return err
    })
}

export default gqlQuery;