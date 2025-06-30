import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Students } from './pages/Students/Students';
import { Guardians } from './pages/Students/Guardians';
import { StudentDetail } from './pages/Students/StudentDetail';
import { GuardianDetail } from './pages/Students/GuardianDetail';
import { Groups } from './pages/Groups/Groups';
import { GroupDetail } from './pages/Groups/GroupDetail';
import { Sessions } from './pages/Sessions/Sessions';
import { SessionDetail } from './pages/Sessions/SessionDetail';
import { Drills } from './pages/Drills/Drills';
import { DrillDetail } from './pages/Drills/DrillDetail';
import { Assessments } from './pages/Assessments/Assessments';
import { AssessmentDetail } from './pages/Assessments/AssessmentDetail';
import { Finance } from './pages/Finance/Finance';
import { GroupFeeDetail } from './pages/Finance/GroupFeeDetail';
import { Announcements } from './pages/Announcements/Announcements';
import { Events } from './pages/Events/Events';
import { Reports } from './pages/Reports/Reports';
import { Settings } from './pages/Settings/Settings';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/students" element={<Students />} />
          <Route path="/students/guardians" element={<Guardians />} />
          <Route path="/students/:id" element={<StudentDetail />} />
          <Route path="/guardians/:id" element={<GuardianDetail />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/groups/:id" element={<GroupDetail />} />
          <Route path="/sessions" element={<Sessions />} />
          <Route path="/sessions/:id" element={<SessionDetail />} />
          <Route path="/drills" element={<Drills />} />
          <Route path="/drills/:id" element={<DrillDetail />} />
          <Route path="/assessments" element={<Assessments />} />
          <Route path="/assessments/:id" element={<AssessmentDetail />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/finance/groups/:id" element={<GroupFeeDetail />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/events" element={<Events />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;