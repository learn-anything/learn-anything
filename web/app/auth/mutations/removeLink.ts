import db from "db"

export default async function removeLink({ id }: { id: number }) {
  await db.link.delete({
    where: { id },
  })
}
