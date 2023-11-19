import { onMount } from "solid-js"

// TODO: use param
// like learn-anything.xyz/get-api-key?target=cli
export default function GetApiKey() {
  // const navigate = useNavigate()

  onMount(async () => {
    // const cookieToken = getHankoCookie()
    // if (cookieToken) {
    //   const url = `learn-anything://open-in-desktop/login?hankoToken=${cookieToken}`
    //   window.open(url, "_blank")
    //   navigate("/")
    // } else {
    //   localStorage.setItem("pageBeforeSignIn", location.pathname)
    //   navigate("/auth")
    // }
  })
  return (
    <>
      <button
        onClick={() => {
          const apiToken = "secret"
          window.open(`http://localhost:3500?token=${apiToken}`)
        }}
      >
        Log in CLI
      </button>
    </>
  )
}
