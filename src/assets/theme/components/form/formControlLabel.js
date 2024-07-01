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

// Material Kit 2 React base styles
import colors from "assets/theme/base/colors";
import typography from "assets/theme/base/typography";

// Material Kit 2 React helper functions
import pxToRem from "assets/theme/functions/pxToRem";

const { dark } = colors;
const { size, fontWeightMedium } = typography;

export default {
  styleOverrides: {
    root: {
      minHeight: pxToRem(24),
      margin: 0,
      "&.MuiFormControlLabel-labelPlacementStart": {
        "& .MuiFormControlLabel-label": {
          marginRight: "5px",
        },
      },
      "&.MuiFormControlLabel-labelPlacementEnd": {
        "& .MuiFormControlLabel-label": {
          marginLeft: "5px",
        },
      },
      "& .MuiSvgIcon-root": { width: 35, height: 35 },
    },

    label: {
      fontSize: size.sm,
      fontWeight: fontWeightMedium,
      color: dark.main,

      "&.Mui-disabled": {
        color: dark.main,
      },
    },
  },
};
