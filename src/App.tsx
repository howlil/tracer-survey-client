import { Provider } from "react-redux"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import AboutUs from "./pages/AboutUs"
import FAQ from "./pages/FAQ"
import Home from "./pages/Home"
import LoginAdmin from "./pages/admin/LoginAdmin"
import LoginTracerStudy from "./pages/tracerStudy/LoginTracerStudy"
import TracerStudy from "./pages/tracerStudy/TracerStudy"
import TracerStudySuccess from "./pages/tracerStudy/TracerStudySuccess"
import TracerStudySurvey from "./pages/tracerStudy/TracerStudySurvey"
import LoginUserSurvey from "./pages/userSurvey/LoginUserSurvey"
import UserSurvey from "./pages/userSurvey/UserSurvey"
import { store } from "./store/index"

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginAdmin />} />
                <Route path="/tracer-study" element={<TracerStudy />} />
                <Route path="/tracer-study/login" element={<LoginTracerStudy />} />
                <Route path="/tracer-study/survey/:page" element={<TracerStudySurvey />} />
                <Route path="/tracer-study/success" element={<TracerStudySuccess />} />
          <Route path="/user-survey" element={<UserSurvey />} />
          <Route path="/user-survey/login" element={<LoginUserSurvey />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/about-us" element={<AboutUs />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App
