import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { FindItProvider } from './context/FindItContext';
import { RootLayout } from './layouts/RootLayout';
import {
  HomePage,
  BrowsePage,
  ReportPage,
  ItemDetailsPage,
  MatchesPage,
  MyActivityPage,
  NotificationsPage,
  AdminPage,
} from './pages';

export function App() {
  return (
    <FindItProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route index element={<HomePage />} />
            <Route path="browse" element={<BrowsePage />} />
            <Route path="report" element={<ReportPage />} />
            <Route path="item/:id" element={<ItemDetailsPage />} />
            <Route path="matches" element={<MatchesPage />} />
            <Route path="my-activity" element={<MyActivityPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="admin" element={<AdminPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </FindItProvider>
  );
}

export default App;
