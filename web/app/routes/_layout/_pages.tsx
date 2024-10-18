import { Outlet, createFileRoute } from "@tanstack/react-router"
import { Provider as JotaiProvider } from "jotai"
import { Toaster } from "sonner"
import { ConfirmDialogProvider } from "@omit/react-confirm-dialog"

import { Sidebar } from "~/components/sidebar/sidebar"
import { TooltipProvider } from "~/components/ui/tooltip"
import { JazzAndAuth } from "~/lib/providers/jazz-provider"
import { Shortcut } from "~/components/shortcut/shortcut"
import { Onboarding } from "~/components/Onboarding"
import { GlobalKeyboardHandler } from "~/components/GlobalKeyboardHandler"
import { CommandPalette } from "~/components/command-palette/command-palette"

export const Route = createFileRoute("/_layout/_pages")({
  component: PagesLayout,
})

function PagesLayout() {
  return (
    <JotaiProvider>
      <TooltipProvider>
        <ConfirmDialogProvider>
          <JazzAndAuth>
            <LayoutContent />
          </JazzAndAuth>
        </ConfirmDialogProvider>
      </TooltipProvider>
    </JotaiProvider>
  )
}

function LayoutContent() {
  return (
    <>
      <Toaster expand={false} />
      <div className="flex size-full min-h-full flex-row items-stretch overflow-hidden">
        <Sidebar />
        <Shortcut />
        <GlobalKeyboardHandler />
        <CommandPalette />
        <Onboarding />

        <MainContent />
      </div>
    </>
  )
}

function MainContent() {
  return (
    <div className="relative flex min-w-0 flex-1 flex-col">
      <main className="relative flex flex-auto flex-col place-items-stretch overflow-auto bg-[var(--container-background)] lg:my-2 lg:mr-2 lg:rounded-md lg:border">
        <Outlet />
      </main>
    </div>
  )
}
