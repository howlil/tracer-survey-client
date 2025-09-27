import { BrowserRouter, Route, Routes } from "react-router-dom"
import AboutUs from "./pages/AboutUs"
import ComponentsDemo from "./pages/ComponentsDemo"
import FAQ from "./pages/FAQ"
import Home from "./pages/Home"
import LoginAdmin from "./pages/admin/LoginAdmin"
import LoginTracerStudy from "./pages/tracerStudy/LoginTracerStudy"
import TracerStudy from "./pages/tracerStudy/TracerStudy"
import LoginUserSurvey from "./pages/userSurvey/LoginUserSurvey"
import UserSurvey from "./pages/userSurvey/UserSurvey"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tes" element={<ComponentsDemo />} />
        <Route path="/login" element={<LoginAdmin />} />
        <Route path="/tracer-study" element={<TracerStudy />} />
        <Route path="/tracer-study/login" element={<LoginTracerStudy />} />
        <Route path="/user-survey" element={<UserSurvey />} />
        <Route path="/user-survey/login" element={<LoginUserSurvey />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/about-us" element={<AboutUs />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
