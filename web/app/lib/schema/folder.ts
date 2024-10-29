import { co, CoList, ImageDefinition } from "jazz-tools"
import { BaseModel } from "./base"
import { PersonalPage } from "./personal-page"

export class Image extends BaseModel {
  page = co.optional.ref(PersonalPage)
  referenceId = co.optional.string
  fileName = co.optional.string
  fileSize = co.optional.number
  width = co.optional.number
  height = co.optional.number
  aspectRatio = co.optional.number
  mimeType = co.optional.string
  lastModified = co.optional.string
  url = co.optional.string
  content = co.optional.ref(ImageDefinition)
}

export class ImageLists extends CoList.Of(co.ref(Image)) {}

export class Folder extends BaseModel {
  name = co.string
  description = co.optional.string
  icon = co.optional.string
  images = co.optional.ref(ImageLists)
  parent = co.optional.ref(Folder)
}

export class FolderLists extends CoList.Of(co.ref(Folder)) {}
