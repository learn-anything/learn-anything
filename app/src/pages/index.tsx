import gql from "graphql-tag"
import { useQuery } from "urql"
import Header from "../components/header"
import Link from "../components/link"

const query = gql`
  query {
    links {
      id
    }
  }
`

const BookmarksPage = () => {
  const [result] = useQuery({ query })

  return (
    <div>
      <Header />
      {result?.data?.links.map((link) => (
        <Link id={link.id} key={link.id} />
      ))}
    </div>
  )
}

export default BookmarksPage
