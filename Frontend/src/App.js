import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import CreateTestPage from './pages/createTest';
import AddUser from './pages/addUser';
import AssignTest from './pages/assignTest';
import TestPage from './pages/test';
import ThanksPage from './pages/thanks';
import CheckResult from './pages/checkResult';
import HomePage from './pages/home';
import AdminHome from './pages/adminHome';
import UserHome from './pages/userHome';

function App() {
  return (
    <Router>
      <Routes>
          {/* <Route path="/" element={<Login />} /> */}
          <Route path="/admin/createtest" element={<CreateTestPage />} />
          <Route path="/admin/adduser" element={<AddUser />} />
          <Route path="/admin/assigntest" element={<AssignTest />} />
          <Route path="/user/testpage/:userId" element={<TestPage />} />
          <Route path="/user/home/:userId" element={<UserHome />} />
          <Route path="/thanks" element={<ThanksPage />} />
          <Route path="/admin/checkresult" element={<CheckResult />} />
          <Route path="/" element={<HomePage />} />
          <Route path='/admin/home' element={<AdminHome />} />
      </Routes>
    </Router>
  );
}

export default App;
