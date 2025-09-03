import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/layout/Layout';
import BookingList from './pages/BookingList';
import BookingDetail from './pages/BookingDetail';
import CheckIn from './pages/CheckIn';
import Admin from './pages/Admin';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<BookingList />} />
            <Route path="/book/:classId" element={<BookingDetail />} />
            <Route path="/checkin" element={<CheckIn />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;