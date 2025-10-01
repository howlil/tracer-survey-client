import { Toaster } from "@/components/ui/sonner"
import { Provider } from "react-redux"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { PersistGate } from "redux-persist/integration/react"
import AboutUs from "./pages/AboutUs"
import FAQ from "./pages/FAQ"
import Home from "./pages/Home"
import Dashboard from "./pages/admin/Dashboard"
import LoginAdmin from "./pages/admin/LoginAdmin"
import PaketSoalTracerStudy from "./pages/admin/PaketSoalTracerStudy"
import LoginTracerStudy from "./pages/tracerStudy/LoginTracerStudy"
import TracerStudy from "./pages/tracerStudy/TracerStudy"
import TracerStudySuccess from "./pages/tracerStudy/TracerStudySuccess"
import TracerStudySurvey from "./pages/tracerStudy/TracerStudySurvey"
import LoginUserSurvey from "./pages/userSurvey/LoginUserSurvey"
import UserSurvey from "./pages/userSurvey/UserSurvey"
import UserSurveySuccess from "./pages/userSurvey/UserSurveySuccess"
import UserSurveySurvey from "./pages/userSurvey/UserSurveySurvey"
import { persistor, store } from "./store/index"

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin/login" element={<LoginAdmin />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/packages/tracer-study" element={<PaketSoalTracerStudy />} />
            <Route path="/tracer-study" element={<TracerStudy />} />
            <Route path="/tracer-study/login" element={<LoginTracerStudy />} />
            <Route path="/tracer-study/survey/:page" element={<TracerStudySurvey />} />
            <Route path="/tracer-study/success" element={<TracerStudySuccess />} />
            <Route path="/user-survey" element={<UserSurvey />} />
            <Route path="/user-survey/login" element={<LoginUserSurvey />} />
            <Route path="/user-survey/survey/:page" element={<UserSurveySurvey />} />
            <Route path="/user-survey/success" element={<UserSurveySuccess />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/about-us" element={<AboutUs />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  )
}

export default App
