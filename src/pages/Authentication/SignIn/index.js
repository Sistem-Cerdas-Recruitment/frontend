import { useState } from "react";
import axios from "axios";

// react-router-dom components
import { Link, useLocation, useNavigate } from "react-router-dom";

// @mui material components
import { Card, Switch, Grid, InputAdornment, IconButton, SvgIcon, Container } from "@mui/material";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKInput from "components/MKInput";
import MKButton from "components/MKButton";

import { convertRole } from "utils/functions";

// other packages
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// icons
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

export default function SignInBasic() {
  const navigate = useNavigate();
  const location = useLocation();
  // eslint-disable-next-line no-undef
  const url = process.env.REACT_APP_API_URL;
  const [rememberMe, setRememberMe] = useState(false);
  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const [showPassword, setShowPassword] = useState(false);
  const handleShowPassword = () => setShowPassword(!showPassword);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      submit: null,
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Email is required"),
      password: Yup.string().max(255).required("Password is required"),
    }),
    onSubmit: async (values, helpers) => {
      axios
        .post(`${url}/api/auth/login`, values)
        .then((res) => {
          localStorage.setItem("token", res.data.token);
          axios
            .get(`${url}/api/user/get`, {
              headers: {
                Authorization: `Bearer ${res.data.token}`,
              },
            })
            .then((res) => {
              localStorage.setItem("name", res.data.name);
              localStorage.setItem("email", res.data.email);
              localStorage.setItem("role", res.data.role);
              toast.success("Login success");
              if (location.state?.next) {
                navigate(location.state.next, { state: { job: location.state.job } });
              } else {
                navigate(`/${convertRole(res.data.role)}/home`);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          helpers.setStatus({ success: false });
          helpers.setErrors({ submit: err.response.data.error });
          helpers.setSubmitting(false);
          toast.error("Login failed");
        });
    },
  });

  return (
    <Container>
      <MKBox
        px={1}
        width="100%"
        height="calc(100vh - 60px)"
        mx="auto"
        position="relative"
        zIndex={2}
        sx={{ maxWidth: "1720px" }}
      >
        <Grid
          container
          spacing={1}
          justifyContent="center"
          alignItems="center"
          height="100%"
          pb={6}
        >
          <Grid item xs={11} sm={9} md={6} xl={5}>
            <Card>
              <MKBox borderRadius="lg" mx={2} px={4} pt={3} pb={2} textAlign="center">
                <MKTypography variant="h3" fontWeight="medium" color="black" my={0.8}>
                  Sign In
                </MKTypography>
              </MKBox>
              <MKBox pt={0.5} pb={3} px={8}>
                <MKBox component="form" role="form" onSubmit={formik.handleSubmit}>
                  <MKBox mb={2.5}>
                    <MKInput
                      name="email"
                      type="email"
                      label="Email"
                      fullWidth
                      value={formik.values.email}
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      error={!!(formik.touched.email && formik.errors.email)}
                      success={formik.touched.email && !formik.errors.email}
                      helperText={formik.touched.email && formik.errors.email}
                    />
                  </MKBox>
                  <MKBox mb={2.5}>
                    <MKInput
                      name="password"
                      type={showPassword ? "text" : "password"}
                      label="Password"
                      fullWidth
                      value={formik.values.password}
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      error={!!(formik.touched.password && formik.errors.password)}
                      success={formik.touched.password && !formik.errors.password}
                      helperText={formik.touched.password && formik.errors.password}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={handleShowPassword} edge="end">
                              <SvgIcon color="action" fontSize="small">
                                {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                              </SvgIcon>
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </MKBox>
                  <MKBox display="flex" alignItems="center" ml={-1}>
                    <Switch checked={rememberMe} onChange={handleSetRememberMe} />
                    <MKTypography
                      variant="button"
                      fontWeight="regular"
                      color="text"
                      onClick={handleSetRememberMe}
                      sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
                    >
                      &nbsp;&nbsp;Remember me
                    </MKTypography>
                  </MKBox>
                  {formik.errors.submit && (
                    <MKTypography color="error" variant="body2" mt={0.5}>
                      {formik.errors.submit}
                    </MKTypography>
                  )}
                  <MKBox mt={4} mb={1}>
                    <MKButton
                      variant="contained"
                      color="primary"
                      fullWidth
                      type="submit"
                      size="large"
                    >
                      Continue
                    </MKButton>
                  </MKBox>
                  <MKBox mt={2} textAlign="center">
                    <MKTypography variant="button" color="text">
                      Don&apos;t have an account?{" "}
                      <MKTypography
                        component={Link}
                        to="/applicant/sign-up"
                        variant="button"
                        color="info"
                        fontWeight="medium"
                        textGradient
                      >
                        Sign up
                      </MKTypography>
                    </MKTypography>
                  </MKBox>
                </MKBox>
              </MKBox>
            </Card>
          </Grid>
        </Grid>
      </MKBox>
    </Container>
  );
}
