import getLinks from "app/auth/queries/links"
import getUser from "app/auth/queries/user"
import getUsers from "app/auth/queries/users"
import { Link } from "app/components/Link"

const User = ({ user, links }) => {
  return (
    <div>
      <h1>Hey, {user.username}!</h1>
      <div className="flex flex-col">{links && links.map((link) => <Link link={link} />)}</div>
    </div>
  )
}

export async function getStaticPaths() {
  const users = await getUsers()
  const paths = users.map((user) => ({
    params: { username: user.username },
  }))

  return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
  console.log("ran")
  const user = await getUser(params.username)
  // @ts-ignore
  const links = await getLinks(user?.id)

  return { props: { user, links }, revalidate: 1 }
}

export default User
