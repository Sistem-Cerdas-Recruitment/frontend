import { useEffect } from "react";

// react-router components
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// Material Kit 2 React themes
import theme from "assets/theme";
import SignInBasic from "pages/Authentication/SignIn";
import SignUpApplicant from "pages/Authentication/SignUp/Applicant";
import SignUpCompany from "pages/Authentication/SignUp/Company";
import HomeApplicant from "pages/Home/Applicant";
import { ToastContainer } from "react-toastify";

import { convertRole } from "utils/functions";
import MKBox from "components/MKBox";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";

import routes from "utils/enums/routes";
import routes2 from "routes";

export default function App() {
  const { pathname } = useLocation();

  const getFilteredRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.for === "all") {
        return <Route exact path={route.route} element={route.component} key={route.name} />;
      }

      if (route.for === convertRole(localStorage.getItem("role"))) {
        return <Route exact path={route.route} element={route.component} key={route.name} />;
      }

      return null;
    });

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastContainer />
      <MKBox bgColor="#dddeea">
        <MKBox bgColor="white" shadow="sm">
          <DefaultNavbar routes={routes2} sticky relative transparent />
        </MKBox>
        <Routes>
          {localStorage.getItem("token") ? (
            <>
              {getFilteredRoutes(routes)}
              <Route
                path="*"
                element={<Navigate to={`/${convertRole(localStorage.getItem("role"))}/home`} />}
              />
            </>
          ) : (
            <>
              <Route path="/sign-in" element={<SignInBasic />} />
              <Route path="/applicant/sign-up" element={<SignUpApplicant />} />
              <Route path="/company/sign-up" element={<SignUpCompany />} />
              <Route path="/applicant/home" element={<HomeApplicant />} />
              <Route path="*" element={<Navigate to="/sign-in" />} />
            </>
          )}
        </Routes>
      </MKBox>
    </ThemeProvider>
  );
}
