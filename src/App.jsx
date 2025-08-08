import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/signup";
import SignInPage from "./pages/Signin";
import { ThemeProvider } from "@emotion/react";
import theme from "./theme/theme";
import DashboardPage from "./pages/DashboardPage";
import OrganizationForm from "./components/OrganizationForm";
import OtpPage from "./pages/Otp";
import SignInByOtpPage from "./pages/SignInByOtpPage";
import NotFound404 from "./pages/NotFound404";
import OrganizationBranchPage from "./pages/OrganizationBranchPage";
import CategoryForm from "./components/CategoryForm";
import ModelPage from "./pages/ModelPage";
import ModelForm from "./components/ModelForm";
import DevicePage from "./pages/DevicePage";
import DeviceForm from "./components/DeviceForm";
import ColorForm from "./components/ColorForm";
import ColorPage from "./pages/ColorPage";
import UserPage from "./pages/UserPage";
import UserForm from "./components/UserForm";
import OrganizationBranchForm from "./components/OrganizationBranchForm";
import CapacityPage from "./pages/CapacityPage";
import CapacityForm from "./components/CapacityForm";
import StockForm from "./components/StockForm";
import CustomerPage from "./pages/CustomerPage";
import CustomerForm from "./components/CustomerForm";
import AccountPage from "./pages/AccountPage";
import AccountForm from "./components/AccountForm";
import StockPage from "./pages/StockPage";
import OrganizationPage from "./pages/OrganizationPage";
import MuiTable from "./pages/MuiTable copy";
import CategoryTable from "./tables/CategoryTable";
import ExpensePage from "./pages/ExpensePage";
import ExpenseForm from "./components/ExpenseForm";
import CustomerLedgerPage from "./pages/CustomerLedgerPage";
import RepairPage from "./pages/RepairPage";
import RepairForm from "./components/RepairForm";
import SellPage from "./pages/SellPage";
import SellForm from "./components/SellForm";
import ProfitLoseTable from "./tables/ProfitLoseTable";
import Layout from "./pages/Layout";
import ExpenseTable from "./tables/ExpenseTable";
import ActivityLogTable from "./tables/ActivityLogTable";

function App() {
  const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    return token ? <Layout>{children}</Layout> : <Navigate to="/signIn" />;
  };

  const PublicRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    return token ? <Navigate to="/dashboard" /> : children;
  };

  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path="/muiTable" element={<MuiTable />} />
        <Route
          path="/"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />
        <Route
          path="/signIn"
          element={
            <PublicRoute>
              <SignInPage />
            </PublicRoute>
          }
        />
        <Route
          path="/signInByOtp"
          element={
            <PublicRoute>
              <SignInByOtpPage />
            </PublicRoute>
          }
        />
        <Route
          path="/otpPage"
          element={
            <PublicRoute>
              <OtpPage />
            </PublicRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/organizationPage"
          element={
            <PrivateRoute>
              <OrganizationPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/organizationForm"
          element={
            <PrivateRoute>
              <OrganizationForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/organizationForm/:id"
          element={
            <PrivateRoute>
              <OrganizationForm />
            </PrivateRoute>
          }
        />

        <Route
          path="/organizationBranchPage"
          element={
            <PrivateRoute>
              <OrganizationBranchPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/category"
          element={
            <PrivateRoute>
              <CategoryTable />
            </PrivateRoute>
          }
        />
        <Route
          path="/organizationBranchForm"
          element={
            <PrivateRoute>
              <OrganizationBranchForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/organizationBranchForm/:id"
          element={
            <PrivateRoute>
              <OrganizationBranchForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/userPage"
          element={
            <PrivateRoute>
              <UserPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/userForm"
          element={
            <PrivateRoute>
              <UserForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/userForm/:id"
          element={
            <PrivateRoute>
              <UserForm />
            </PrivateRoute>
          }
        />

        <Route
          path="/categoryForm"
          element={
            <PrivateRoute>
              <CategoryForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/categoryForm/:id"
          element={
            <PrivateRoute>
              <CategoryForm />
            </PrivateRoute>
          }
        />

        <Route
          path="/modelPage"
          element={
            <PrivateRoute>
              <ModelPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/modelForm"
          element={
            <PrivateRoute>
              <ModelForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/modelForm/:id"
          element={
            <PrivateRoute>
              <ModelForm />
            </PrivateRoute>
          }
        />

        <Route
          path="/devicePage"
          element={
            <PrivateRoute>
              <DevicePage />
            </PrivateRoute>
          }
        />

        <Route
          path="/deviceForm"
          element={
            <PrivateRoute>
              <DeviceForm />
            </PrivateRoute>
          }
        />

        <Route
          path="/deviceForm/:id"
          element={
            <PrivateRoute>
              <DeviceForm />
            </PrivateRoute>
          }
        />

        <Route
          path="/colorPage"
          element={
            <PrivateRoute>
              <ColorPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/colorForm"
          element={
            <PrivateRoute>
              <ColorForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/colorForm/:id"
          element={
            <PrivateRoute>
              <ColorForm />
            </PrivateRoute>
          }
        />

        <Route
          path="/capacityPage"
          element={
            <PrivateRoute>
              <CapacityPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/capacityForm"
          element={
            <PrivateRoute>
              <CapacityForm />
            </PrivateRoute>
          }
        />

        <Route
          path="/capacityForm/:id"
          element={
            <PrivateRoute>
              <CapacityForm />
            </PrivateRoute>
          }
        />

        <Route
          path="/stockPage"
          element={
            <PrivateRoute>
              <StockPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/stockForm"
          element={
            <PrivateRoute>
              <StockForm />
            </PrivateRoute>
          }
        />

        <Route
          path="/stockForm/:id"
          element={
            <PrivateRoute>
              <StockForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/stockForm/stock/:id"
          element={
            <PrivateRoute>
              <StockForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/customerPage"
          element={
            <PrivateRoute>
              <CustomerPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/customerForm"
          element={
            <PrivateRoute>
              <CustomerForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/customerForm/:id"
          element={
            <PrivateRoute>
              <CustomerForm />
            </PrivateRoute>
          }
        />

        <Route
          path="/accountPage"
          element={
            <PrivateRoute>
              <AccountPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/accountForm"
          element={
            <PrivateRoute>
              <AccountForm />
            </PrivateRoute>
          }
        />

        <Route
          path="/accountForm/:id"
          element={
            <PrivateRoute>
              <AccountForm />
            </PrivateRoute>
          }
        />

        <Route
          path="/expensePage"
          element={
            <PrivateRoute>
              <ExpenseTable />
            </PrivateRoute>
          }
        />
        <Route
          path="/expenseForm"
          element={
            <PrivateRoute>
              <ExpenseForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/expenseForm/:id"
          element={
            <PrivateRoute>
              <ExpenseForm />
            </PrivateRoute>
          }
        />
        <Route
          path="stockPage/expenseForm/:id"
          element={
            <PrivateRoute>
              <ExpenseForm stockId="stockId" />
            </PrivateRoute>
          }
        />

        <Route
          path="/customerLedgerPage"
          element={
            <PrivateRoute>
              <CustomerLedgerPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/repairPage"
          element={
            <PrivateRoute>
              <RepairPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/repairForm"
          element={
            <PrivateRoute>
              <RepairForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/repairForm/:id"
          element={
            <PrivateRoute>
              <RepairForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/sellPage"
          element={
            <PrivateRoute>
              <SellPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/sellForm"
          element={
            <PrivateRoute>
              <SellForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/sellForm/:id"
          element={
            <PrivateRoute>
              <SellForm />
            </PrivateRoute>
          }
        />

        <Route
          path="stockPage/sellForm/:id"
          element={
            <PrivateRoute>
              <SellForm stock="stock" />
            </PrivateRoute>
          }
        />

        <Route
          path="/plTable"
          element={
            <PrivateRoute>
              <ProfitLoseTable />
            </PrivateRoute>
          }
        />

        <Route
          path="/activityLog"
          element={
            <PrivateRoute>
              <ActivityLogTable />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<NotFound404 />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
