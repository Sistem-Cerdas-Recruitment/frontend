import { Icon } from "@mui/material";

import SignIn from "pages/Authentication/SignIn";

import SignUpApplicant from "pages/Authentication/SignUp/Applicant";
import HomeApplicant from "pages/Home/Applicant";
import DetailVacancy from "pages/Home/Applicant/DetailVacancy";
import ApplyCV from "pages/Application/Applicant/ApplyCV";
import HistoryApplicant from "pages/Application/Applicant/History";
import Interview from "pages/Application/Applicant/Interview";

import SignUpCompany from "pages/Authentication/SignUp/Company";
import HomeCompany from "pages/Home/Company";
import AddJob from "pages/Home/Company/AddJob";
import HistoryCompany from "pages/Application/Company/History";
import InterviewResult from "pages/Application/Company/InterviewResult";

const routes = [
  // init and all
  {
    name: "sign in",
    route: "/sign-in",
    component: <SignIn />,
    display: true,
    for: "init",
  },
  {
    name: "sign up applicant",
    route: "/applicant/sign-up",
    component: <SignUpApplicant />,
    display: true,
    for: "init",
  },
  {
    name: "sign up company",
    route: "/company/sign-up",
    component: <SignUpCompany />,
    display: true,
    for: "init",
  },
  {
    name: "detail vacancy",
    route: "/detail-vacancy/:id",
    component: <DetailVacancy />,
    display: false,
    for: "all",
  },

  // applicant only
  {
    name: "home applicant",
    route: "/applicant/home",
    component: <HomeApplicant />,
    display: true,
    for: "applicant",
  },
  {
    name: "apply cv",
    route: "/applicant/apply-cv/:id",
    component: <ApplyCV />,
    display: false,
    for: "applicant",
  },
  {
    name: "history applicant",
    route: "/applicant/history",
    component: <HistoryApplicant />,
    display: true,
    for: "applicant",
  },
  {
    name: "interview",
    route: "/applicant/interview/:id",
    component: <Interview />,
    display: false,
    for: "applicant",
  },

  // company only
  {
    name: "home company",
    route: "/company/home",
    component: <HomeCompany />,
    display: true,
    for: "company",
  },
  {
    name: "add job",
    route: "/company/add-job",
    component: <AddJob />,
    display: true,
    for: "company",
  },
  {
    name: "history company",
    route: "/company/history/:jobId",
    component: <HistoryCompany />,
    display: false,
    for: "company",
  },
  {
    name: "interview result",
    route: "/company/interview-result/:id",
    component: <InterviewResult />,
    display: false,
    for: "company",
  },
];

// based on the role the routes will be displayed
const getNavbarRoutes = () => {
  const routes = [];
  const role = localStorage.getItem("role");
  if (!role) {
    // push init routes
    routes.push({
      name: "Sign In",
      route: "/sign-in",
      icon: <Icon>login</Icon>,
    });
    routes.push({
      name: "Sign Up",
      route: "/applicant/sign-up",
      icon: <Icon>person</Icon>,
    });
  }
  console.log("role", role);
  if (role === "CANDIDATE") {
    routes.push({
      name: "Home",
      route: "/applicant/home",
      icon: <Icon>home</Icon>,
    });
    routes.push({
      name: "history",
      route: "/applicant/history",
      icon: <Icon>work</Icon>,
    });
  } else if (role === "RECRUITER") {
    routes.push({
      name: "Home",
      route: "/company/home",
      icon: <Icon>home</Icon>,
    });
    routes.push({
      name: "Add Job",
      route: "/company/add-job",
      icon: <Icon>add</Icon>,
    });
  }
  return routes;
};

export { routes, getNavbarRoutes };
