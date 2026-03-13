import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';

function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
        <Sidebar />
        <div style={{
          flex: 1,
          marginLeft: '80px',
          backgroundColor: '#F9FAFB',
          minHeight: '100vh'
        }}>
          <TopBar 
            title="Pharmacy CRM"
            subtitle="Manage inventory, sales, and purchase orders"
          />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/settings" element={
              <div style={{ padding: '24px' }}>
                <h2>Settings</h2>
                <p>Settings page coming soon...</p>
              </div>
            } />
            <Route path="*" element={
              <div style={{ padding: '24px' }}>
                <h2>Page Not Found</h2>
                <p>This page is under construction.</p>
              </div>
            } />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
