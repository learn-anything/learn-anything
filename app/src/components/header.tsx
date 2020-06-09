import { useRouter } from "next/router"
import AddLinkModal from "./AddLinkModal"
import { Bookmark, User, Link } from "../components/icons"

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
} from "@chakra-ui/core"

const Header = () => {
  const router = useRouter()

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <h1 onClick={(e) => router.push("/")} style={{ cursor: "pointer" }}>
          Learn Anything
        </h1>
        <div
          style={{
            display: "flex",
            flex: 1,
            justifyContent: "flex-end",
          }}
        >
          <AddLinkModal />
          {/* Only show these icons when authenticated */}
          <span
            onClick={(e) => router.push("/bookmarks")}
            style={{ cursor: "pointer" }}
          >
            <Bookmark size={28} />
          </span>
          <Popover placement="left-start">
            <PopoverTrigger>
              {/* Placeholder, show user avatar once authenticated */}
              <div style={{ cursor: "pointer" }}>
                <User size={28} />
              </div>
            </PopoverTrigger>
            <PopoverContent zIndex={4}>
              <PopoverBody>
                <Link size={20} />
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </>
  )
}

export default Header
