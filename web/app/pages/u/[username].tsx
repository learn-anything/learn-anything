import getLinks from "app/auth/queries/links"
import getUser from "app/auth/queries/user"
import { Link } from "app/components/Link"

const User = ({ user, links }) => {
  if (!user) {
    return <h1>user not found!</h1>
  }

  return (
    <div>
      <h1>Hey, {user.username}!</h1>
      <div className="flex flex-col">{links && links.map((link) => <Link link={link} />)}</div>
    </div>
  )
}

export async function getServerSideProps(context) {
  const { username } = context.query
  const user = await getUser(username)
  // @ts-ignore
  const links = await getLinks(user?.id)

  return { props: { user, links } }
}

export default User
