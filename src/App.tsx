import { BrowserRouter as Router, useRoutes } from "react-router";
import MainLayout from "./components/MainLayout/MainLayout";
import routes from "./router/routes";
import { ToastProvider } from "./providers/Toast";

const AppRoutes = () => {
  return useRoutes(routes);
};

function App() {
  return (
    <Router>
      <ToastProvider>
        <MainLayout>
          <AppRoutes />
        </MainLayout>
      </ToastProvider>
    </Router>
  );
}

export default App;
