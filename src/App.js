import { useState, useEffect } from "react";

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
import { ToastContainer } from "react-toastify";

import { convertRole } from "utils/functions";
import MKBox from "components/MKBox";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";

import { routes, getNavbarRoutes } from "utils/enums/routes";
import axios from "axios";

export default function App() {
  // eslint-disable-next-line no-undef
  const url = process.env.REACT_APP_API_URL;
  const [navbarRoutes, setNavbarRoutes] = useState([]);
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

  function checkToken() {
    axios
      .get(`${url}/api/user/get`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .catch((err) => {
        console.log(err);
        // if 401, check localStorage rememberMe, if true, login again with email and password from localStorage
        if (err.response.status === 401) {
          if (localStorage.getItem("rememberMe") === "true") {
            axios
              .post(`${url}/api/auth/login`, {
                email: localStorage.getItem("email"),
                password: localStorage.getItem("password"),
              })
              .then((res) => {
                localStorage.setItem("token", res.data.token);
              })
              .catch((err) => {
                console.log(err);
              });
          }
        }
      });
    if (localStorage.getItem("token")) {
      return true;
    }
    return false;
  }

  function convertPathname(pathname) {
    const splitPathname = pathname
      .split("/")
      .slice(1)
      .map((i) => i.charAt(0).toUpperCase() + i.slice(1));
    if (pathname.includes("sign-up")) return splitPathname.join(" "); // Sign Up
    if (splitPathname.length > 1) return splitPathname[1]; // except Home
    return splitPathname[0]; // Home
  }

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  // Setting the navbar routes when reload
  useEffect(() => {
    const currentNavbarRoutes = getNavbarRoutes(routes);
    setNavbarRoutes(currentNavbarRoutes);
  }, [pathname]);

  // Check if token is still valid
  useEffect(() => {
    document.title = `< Ask AI | Automate Hiring > ${convertPathname(pathname)}`;
    if (pathname !== "/sign-in" && !pathname.includes("sign-up")) {
      checkToken();
    }
  }, [pathname]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastContainer />
      <MKBox bgColor="#dddeea" minHeight="100vh">
        <MKBox bgColor="white" shadow="sm">
          <DefaultNavbar routes={navbarRoutes} sticky relative transparent />
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
              <Route path="*" element={<Navigate to="/sign-in" />} />
            </>
          )}
        </Routes>
      </MKBox>
    </ThemeProvider>
  );
}
