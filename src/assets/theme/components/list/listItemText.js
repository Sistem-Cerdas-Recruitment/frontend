/**
=========================================================
* Material Kit 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-kit-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import typography from "assets/theme/base/typography";

const { size } = typography;

export default {
  styleOverrides: {
    root: {
      marginTop: 0,
      marginBottom: 0,

      "& .MuiListItemText-primary": {
        fontSize: size.lg,
      },
    },
  },
};
