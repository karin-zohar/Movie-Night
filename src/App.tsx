import { BrowserRouter as Router, useRoutes } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store } from "./store";
import MainLayout from "./components/MainLayout/MainLayout";
import routes from "./router/routes";
import { ToastProvider } from "./providers/Toast";

const queryClient = new QueryClient();

const AppRoutes = () => {
  return useRoutes(routes);
};

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <ToastProvider>
            <MainLayout>
              <AppRoutes />
            </MainLayout>
          </ToastProvider>
        </Router>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
