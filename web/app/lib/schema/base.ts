import { co, CoMap, Encoders } from "jazz-tools"

export class BaseModel extends CoMap {
  createdAt = co.encoded(Encoders.Date)
  updatedAt = co.encoded(Encoders.Date)
}
