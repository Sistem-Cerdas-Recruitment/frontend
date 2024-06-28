/** 
  All of the routes for the Project are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Navbar.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `name` key is used for the name of the route on the Navbar.
  2. The `icon` key is used for the icon of the route on the Navbar.
  3. The `collapse` key is used for making a collapsible item on the Navbar that contains other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  4. The `route` key is used to store the route location which is used for the react router.
  5. The `href` key is used to store the external links location.
  6. The `component` key is used to store the component of its route.
  7. The `dropdown` key is used to define that the item should open a dropdown for its collapse items .
  8. The `description` key is used to define the description of
          a route under its name.
  9. The `columns` key is used to define that how the content should look inside the dropdown menu as columns,
          you can set the columns amount based on this key.
  10. The `rowsPerColumn` key is used to define that how many rows should be in a column.
*/

// @mui material components
import Icon from "@mui/material/Icon";

import SignIn from "pages/Authentication/SignIn";

import SignUpApplicant from "pages/Authentication/SignUp/Applicant";
import HomeApplicant from "pages/Home/Applicant";
import HistoryApplicant from "pages/Application/Applicant/History";
import Interview from "pages/Application/Applicant/Interview";

import SignUpCompany from "pages/Authentication/SignUp/Company";
import HomeCompany from "pages/Home/Company";
import AddJob from "pages/Home/Company/AddJob";
import HistoryCompany from "pages/Application/Company/History";
import InterviewResult from "pages/Application/Company/InterviewResult";

const routes = [
  // {
  //   name: "Home",
  //   icon: <Icon>home</Icon>,
  //   route: "/applicant/home",
  //   component: <HomeApplicant />,
  // },
  {
    name: "pages",
    icon: <Icon>dashboard</Icon>,
    columns: 1,
    rowsPerColumn: 2,
    collapse: [
      {
        name: "applicant",
        collapse: [
          {
            name: "sign in",
            route: "/sign-in",
            component: <SignIn />,
            for: "all",
          },
          {
            name: "sign up applicant",
            route: "/applicant/sign-up",
            component: <SignUpApplicant />,
            for: "all",
          },
          {
            name: "home applicant",
            route: "/applicant/home",
            component: <HomeApplicant />,
            for: "applicant",
          },
          {
            name: "history applicant",
            route: "/applicant/history",
            component: <HistoryApplicant />,
            for: "applicant",
          },
          {
            name: "interview",
            route: "/applicant/interview/:id",
            component: <Interview />,
            for: "applicant",
          },
        ],
      },
      {
        name: "company",
        collapse: [
          {
            name: "sign up company",
            route: "/company/sign-up",
            component: <SignUpCompany />,
            for: "all",
          },
          {
            name: "home company",
            route: "/company/home",
            component: <HomeCompany />,
            for: "company",
          },
          {
            name: "add job",
            route: "/company/add-job",
            component: <AddJob />,
            for: "company",
          },
          {
            name: "history company",
            route: "/company/history",
            component: <HistoryCompany />,
            for: "company",
          },
          {
            name: "interview result",
            route: "/company/interview-result/:id",
            component: <InterviewResult />,
            for: "company",
          },
        ],
      },
    ],
  },
];

export default routes;
