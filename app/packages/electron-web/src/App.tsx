import Sidebar from "./components/Sidebar"
import TopicEditor from "./components/TopicEditor"

export default function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }} class="flex items-center">
      <Sidebar />
      <TopicEditor />
    </div>
  )
}
