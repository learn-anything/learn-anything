// flag to show full, only host url
export const Link = ({ link }) => {
  console.log(link)
  return (
    <div className="flex flex-col">
      <span>{link.title}</span>
      <span className="text-gray-600">{link.url}</span>
    </div>
  )
}
