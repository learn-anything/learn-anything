import { PageTransition, SharedTransition } from "@nativescript/core"
import { useRouter } from "../router"

export const Home = () => {
  const router = useRouter()
  const goToPage = (name: "Home" | "Settings") => {
    // just showing ios shared transition with platform spring built in
    router.navigate(
      name,
      global.isIOS
        ? {
            transition: SharedTransition.custom(new PageTransition())
          }
        : undefined
    )
  }
  return (
    <>
      <gridlayout rows="*,auto,auto,*" class="bg-[#06070e]">
        <button
          row="1"
          class="rounded-full bg-blue-500 text-white active:scale-[0.9] w-[300] p-3 text-2xl font-bold h-[60] text-center capitalize"
          iosOverflowSafeArea="false"
          sharedTransitionTag="button1"
          text="Settings"
          on:tap={() => {
            goToPage("Settings")
          }}
        />
      </gridlayout>
    </>
  )
}
