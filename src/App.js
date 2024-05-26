import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminLayout from "./components/admin/layout/AdminLayout";
import StudentLayout from "./components/student/layout/StudentLayout";
import Users from "./pages/admin/dashboard/users";
import Home from "./pages/admin/dashboard/home";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/admin/dashboard" element={<AdminLayout />}>
          <Route index element={<Home />} />
          <Route path="users" element={<Users />} />
        </Route>
        <Route path="/" element={<StudentLayout />}></Route>
      </Routes>
    </Router>
  );
};

export default App;
