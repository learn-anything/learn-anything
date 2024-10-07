import * as React from "react"
import type { NavigateOptions } from "@tanstack/react-router"
import { useLocation, useNavigate } from "@tanstack/react-router"

type Resolve = (value?: unknown) => void

export const useAwaitableNavigate = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const resolveFunctionsRef = React.useRef<Resolve[]>([])
  const resolveAll = () => {
    resolveFunctionsRef.current.forEach((resolve) => resolve())
    resolveFunctionsRef.current.splice(0, resolveFunctionsRef.current.length)
  }
  const [, startTransition] = React.useTransition()

  React.useEffect(() => {
    resolveAll()
  }, [location])

  return (options: NavigateOptions) => {
    return new Promise((res) => {
      startTransition(() => {
        resolveFunctionsRef.current.push(res)
        res(navigate(options))
      })
    })
  }
}
