import gql from "graphql-tag"
import React from "react"
import { useQuery } from "urql"

const query = gql`
  query {
    link {
      name
    }
  }
`

const IndexPage = () => {
  const [result] = useQuery({
    query: query,
  })

  if (result.fetching || !result.data) {
    return null
  }

  if (result.error) {
    return null
  }

  return (
    <div>
      <h1>Learn Anything</h1>
      <ul>
        {result.data.link.map((link) => (
          <li>{link.name}</li>
        ))}
      </ul>
    </div>
  )
}

export default IndexPage
