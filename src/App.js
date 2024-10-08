import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminLayout from "./components/admin/layout/AdminLayout";
import StudentLayout from "./components/student/layout/StudentLayout";
import Users from "./pages/admin/dashboard/users";
import Students from "./pages/admin/dashboard/students";
import Home from "./pages/admin/dashboard/home";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/common/login";
import PrivateRoute from "./components/common/auth/PrivateRoute";
import Groups from "./pages/admin/dashboard/groups";
import StudentRegistrationPage from "./pages/student/auth/StudentRegistrationPage";
import InstitutionsPage from "./pages/admin/dashboard/institutions";
import InstitutionDetailPage from "./pages/admin/dashboard/institutions/details";
import TasksPage from "./pages/admin/dashboard/tasks";
import GroupDetailsPage from "./pages/admin/dashboard/groups/details";
import TaskFiles from "./pages/admin/dashboard/tasks/files";
import HomeStudents from "./pages/student/home";
import StudentGroup from "./pages/student/groups";
import TaskDetails from "./pages/student/groups/taskDetails";
import InstitutionsStudents from "./pages/student/institutions";
import InstitutionDetailPageStudent from "./pages/student/institutions/details";
import PrivateRouteSudent from "./components/student/auth/privateRoutes";
import SubmissionsPage from "./pages/admin/dashboard/tasks/submissions";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route path="/admin/dashboard" element={<AdminLayout />}>
              <Route path="students" element={<Students />} />
              <Route path="groups" element={<Groups />} />
              <Route path="group/:groupId" element={<GroupDetailsPage />} />
              <Route path="tasks" element={<TasksPage />} />
              <Route path="task/:taskId" element={<TaskFiles />} />
              <Route path="task/:taskId/submissions" element={<SubmissionsPage />} />
              <Route path="institutions" element={<InstitutionsPage />} />
              <Route
                path="institutions/:id"
                element={<InstitutionDetailPage />}
              />
              <Route path="users" element={<Users />} />
              <Route path="" element={<Home />} />
            </Route>
          </Route>
          <Route element={<PrivateRouteSudent />}>
            <Route path="/" element={<StudentLayout />}>
              <Route path="" element={<HomeStudents />} />
              <Route path="group" element={<StudentGroup />} />
              <Route path="group/task/:taskId" element={<TaskDetails />} />
              <Route path="institutions" element={<InstitutionsStudents />} />
              <Route
                path="institution/:institutionId"
                element={<InstitutionDetailPageStudent />}
              />
            </Route>
          </Route>
          <Route path="/login" element={<Login />} />
          <Route
            path="/auth/register/student"
            element={<StudentRegistrationPage />}
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
