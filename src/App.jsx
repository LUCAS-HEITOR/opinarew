import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { OpiniaoProvider } from './context/OpiniaoContext';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Live from './pages/Live';
import './styles/global.css';

function App() {
  return (
    <OpiniaoProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/live" element={<Live />} />
        </Routes>
      </Router>
    </OpiniaoProvider>
  );
}

export default App;
