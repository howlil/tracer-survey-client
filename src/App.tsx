import { BrowserRouter, Routes, Route } from "react-router-dom"
import ComponentsDemo from "./pages/ComponentsDemo"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/tes" element={<ComponentsDemo />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
