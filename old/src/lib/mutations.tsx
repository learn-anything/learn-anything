import gql from "graphql-tag"

export const createLinkMutation = gql`
  mutation($object: links_insert_input!) {
    insert_links_one(object: $object) {
      id
      name
      url
      comment
      attached_links
      tags
    }
  }
`

export const deleteLinkMutation = gql`
  mutation($id: uuid!) {
    delete_links_by_pk(id: $id) {
      id
    }
  }
`
