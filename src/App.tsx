/** @format */

import {Toaster} from '@/components/ui/sonner';
import {QueryClientProvider} from '@tanstack/react-query';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import AboutUs from './pages/AboutUs';
import FAQ from './pages/FAQ';
import Home from './pages/Home';
import Dashboard from './pages/admin/Dashboard';
import LoginAdmin from './pages/admin/LoginAdmin';
import AlumniDatabase from './pages/admin/manajemenUser/AlumniDatabase';
import ManagerDatabase from './pages/admin/manajemenUser/ManagerDatabase';
import DetailManager from './pages/admin/manajemenUser/DetailManager';
import AdminManagement from './pages/admin/manajemenUser/AdminManagement';
import RoleManagement from './pages/admin/manajemenUser/RoleManagement';
import RekapTracerStudy from './pages/admin/laporanRekap/RekapTracerStudy';
import RekapUserSurvey from './pages/admin/laporanRekap/RekapUserSurvey';
import DetailResponseTracerStudy from './pages/admin/laporanRekap/DetailResponseTracerStudy';
import DetailResponseUserSurvey from './pages/admin/laporanRekap/DetailResponseUserSurvey';
import SurveyManagement from './pages/admin/manajemenSurvey/SurveyManagement';
import SurveyBuilder from './pages/admin/manajemenSurvey/SurveyBuilder';
import SurveySettings from './pages/admin/manajemenSurvey/SurveySettings';
import KelolaFAQ from './pages/admin/manajemenFAQ/KelolaFAQ';
import KirimEmail from './pages/admin/manajemenEmail/KirimEmail';
import KelolaTemplateEmail from './pages/admin/manajemenEmail/KelolaTemplateEmail';
import KelolaTemplateEmailEditor from './pages/admin/manajemenEmail/KelolaTemplateEmailEditor';
import LoginTracerStudy from './pages/tracerStudy/LoginTracerStudy';
import TracerStudy from './pages/tracerStudy/TracerStudy';
import TracerStudySuccess from './pages/tracerStudy/TracerStudySuccess';
import TracerStudySurvey from './pages/tracerStudy/TracerStudySurvey';
import LoginUserSurvey from './pages/userSurvey/LoginUserSurvey';
import UserSurvey from './pages/userSurvey/UserSurvey';
import UserSurveySuccess from './pages/userSurvey/UserSurveySuccess';
import UserSurveySurvey from './pages/userSurvey/UserSurveySurvey';
import {queryClient} from './lib/query-client';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route
            path='/'
            element={<Home />}
          />
          <Route
            path='/admin/login'
            element={<LoginAdmin />}
          />
          <Route
            path='/admin/dashboard'
            element={<Dashboard />}
          />
          <Route
            path='/admin/users/alumni'
            element={<AlumniDatabase />}
          />
          <Route
            path='/admin/users/manager'
            element={<ManagerDatabase />}
          />
          <Route
            path='/admin/users/manager/detail/:id'
            element={<DetailManager />}
          />
          <Route
            path='/admin/users/admin'
            element={<AdminManagement />}
          />
          <Route
            path='/admin/users/role'
            element={<RoleManagement />}
          />
          <Route
            path='/admin/reports/tracer-study'
            element={<RekapTracerStudy />}
          />
          <Route
            path='/admin/reports/tracer-study/detail/:id'
            element={<DetailResponseTracerStudy />}
          />
          <Route
            path='/admin/reports/user-survey'
            element={<RekapUserSurvey />}
          />
          <Route
            path='/admin/reports/user-survey/detail'
            element={<DetailResponseUserSurvey />}
          />
          <Route
            path='/admin/survey'
            element={<SurveyManagement />}
          />
          <Route
            path='/admin/survey/builder'
            element={<SurveyBuilder />}
          />
          <Route
            path='/admin/survey/settings'
            element={<SurveySettings />}
          />
          <Route
            path='/admin/faq'
            element={<KelolaFAQ />}
          />
          <Route
            path='/admin/email'
            element={<KirimEmail />}
          />
          <Route
            path='/admin/email/templates'
            element={<KelolaTemplateEmail />}
          />
          <Route
            path='/admin/email/templates/new'
            element={<KelolaTemplateEmailEditor />}
          />
          <Route
            path='/admin/email/templates/:id'
            element={<KelolaTemplateEmailEditor />}
          />
          <Route
            path='/tracer-study'
            element={<TracerStudy />}
          />
          <Route
            path='/tracer-study/login'
            element={<LoginTracerStudy />}
          />
          <Route
            path='/tracer-study/survey/:page'
            element={<TracerStudySurvey />}
          />
          <Route
            path='/tracer-study/success'
            element={<TracerStudySuccess />}
          />
          <Route
            path='/user-survey'
            element={<UserSurvey />}
          />
          <Route
            path='/user-survey/login'
            element={<LoginUserSurvey />}
          />
          <Route
            path='/user-survey/survey/:page'
            element={<UserSurveySurvey />}
          />
          <Route
            path='/user-survey/success'
            element={<UserSurveySuccess />}
          />
          <Route
            path='/faq'
            element={<FAQ />}
          />
          <Route
            path='/about-us'
            element={<AboutUs />}
          />
        </Routes>
        <Toaster
          position='top-right'
          richColors
          closeButton
        />
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
