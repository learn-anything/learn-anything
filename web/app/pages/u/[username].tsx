import getUsers from "app/auth/queries/users"
import getUser from "app/auth/queries/user"
import getLinks from "app/auth/queries/links"

const User = ({ user, links }) => {
  return (
    <div>
      <h1>Hey, {user.username}!</h1>
      <ul>
        {links &&
          links.map((link) => (
            <li>
              <a href={link.url} className="bg-blue-100">
                {link.title}
              </a>
            </li>
          ))}
      </ul>
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
  const user = await getUser(params.username)
  // @ts-ignore
  const links = await getLinks(user?.id)

  return { props: { user, links } }
}

export default User
