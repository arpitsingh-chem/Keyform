import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Shell } from './components/Shell';
import { StudyProvider } from './lib/store';
import Introduction from './pages/Introduction';
import Dashboard from './pages/Dashboard';
import Exams from './pages/Exams';
import Practice from './pages/Practice';
import PracticeTopic from './pages/PracticeTopic';
import Mocks from './pages/Mocks';
import MockSession from './pages/MockSession';
import PreviousYears from './pages/PreviousYears';
import Vocabulary from './pages/Vocabulary';
import Grammar from './pages/Grammar';
import Revision from './pages/Revision';
import Analytics from './pages/Analytics';
import SettingsPage from './pages/Settings';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <StudyProvider>
      <HashRouter>
        <Shell>
          <Routes>
            <Route path="/" element={<Introduction />} />
            <Route path="/workspace" element={<Dashboard />} />
            <Route path="/exams" element={<Exams />} />
            <Route path="/exams/:code" element={<Exams />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/practice/:code/:topic" element={<PracticeTopic />} />
            <Route path="/mocks" element={<Mocks />} />
            <Route path="/mocks/:code" element={<MockSession />} />
            <Route path="/previous-years" element={<PreviousYears />} />
            <Route path="/vocabulary" element={<Vocabulary />} />
            <Route path="/grammar" element={<Grammar />} />
            <Route path="/revision" element={<Revision />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/home" element={<Navigate to="/workspace" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Shell>
      </HashRouter>
    </StudyProvider>
  );
}
