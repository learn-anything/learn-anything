export default function Explore() {
  return (
    <div class="flex flex-col gap-3 p-5">
      <div>Course</div>
      <div>10$</div>
      <div
        onClick={() => {
          console.log(import.meta.env.VITE_SPHEREPAY_KEY)
        }}
      >
        Buy
      </div>
    </div>
  )
}
