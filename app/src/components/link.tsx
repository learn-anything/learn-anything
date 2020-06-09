import React, { useState } from "react"
import gql from "graphql-tag"
import { useQuery, useMutation } from "urql"
import { deleteLinkMutation } from "../lib/mutations"
import { Bookmark } from "./icons"
import { Button, Stack } from "@chakra-ui/core"

const linkQuery = gql`
  query($id: uuid!) {
    links_by_pk(id: $id) {
      name
      comment
      url
    }
  }
`

const Link = ({ id }) => {
  const [result] = useQuery({
    query: linkQuery,
    variables: { id },
  })
  const link = result?.data?.links_by_pk

  // TODO: Grab state from user query
  const [saved, setSaved] = useState(false)

  const [removeLinkResult, removeLink] = useMutation(deleteLinkMutation)

  return (
    <Stack marginBottom="4px">
      <div style={{ display: "flex" }}>
        <a href={link.url}>{link.name}</a>
        {/* TODO: Only show for users with correct permissions */}
        <div
          style={{
            display: "flex",
            flex: 1,
            justifyContent: "flex-end",
          }}
        >
          <Button onClick={(e) => removeLink({ id })}>Delete</Button>
        </div>
      </div>
      <blockquote>{link.comment}</blockquote>
      <div style={{ display: "flex", marginTop: "var(--small-gap)" }}>
        <span onClick={(e) => setSaved(!saved)} style={{ cursor: "pointer" }}>
          <Bookmark fill={`${saved ? "currentColor" : "none"}`} />
        </span>
        {/* {` / `} */}
        <span style={{ fontStyle: "italic", color: "var(--gray)" }}>
          {link.url.split("/")[2]}
        </span>
      </div>
    </Stack>
  )
}

export default Link
