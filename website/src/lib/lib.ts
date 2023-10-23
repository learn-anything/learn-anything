// TODO: there is maybe better way to do this, also avoid : any type (generic?)
export function getRandomItem(arr: any) {
  const randomIndex = Math.floor(Math.random() * arr.length)
  return arr[randomIndex]
}

export function toRelativeTime(dateInput: string) {
  const date = new Date(dateInput)
  const now = new Date()
  const diffInSeconds = (date.getTime() - now.getTime()) / 1000
  const diffInMinutes = diffInSeconds / 60
  const diffInHours = diffInMinutes / 60
  const diffInDays = diffInHours / 24

  if (diffInDays > 1) {
    return `in ${Math.round(diffInDays)} days`
  } else if (diffInHours > 1) {
    return `in ${Math.round(diffInHours)} hours`
  } else if (diffInMinutes > 1) {
    return `in ${Math.round(diffInMinutes)} minutes`
  } else if (diffInSeconds > 0) {
    return `in ${Math.round(diffInSeconds)} seconds`
  } else {
    return "just now"
  }
}
