import "../app.global.css"

import { useLocation } from "blade/hooks"
import SignupPage from "../components/auth/signup-page.client"

export default function Signup() {
  const location = useLocation()
  const token = location.searchParams.get("token")

  return <SignupPage token={token} />
}
