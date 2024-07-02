import axios from "axios";
import { useState, useEffect } from "react";
import propTypes from "prop-types";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Grid } from "@mui/material";
import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import MKTypography from "components/MKTypography";
import SpinningBar from "atoms/SpinningBar";
import { specialKeys, punctuationKeys } from "utils/enums/keys";

const Interview = () => {
  // eslint-disable-next-line no-undef
  const url = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const { id: applicationId } = useParams();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function checkFullscreen() {
    const fullscreenElement =
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement;

    setIsFullscreen(!!fullscreenElement);
  }

  useEffect(() => {
    document.addEventListener("fullscreenchange", checkFullscreen);
    document.addEventListener("webkitfullscreenchange", checkFullscreen);
    document.addEventListener("mozfullscreenchange", checkFullscreen);
    document.addEventListener("MSFullscreenChange", checkFullscreen);

    // Initial check
    checkFullscreen();

    return () => {
      document.removeEventListener("fullscreenchange", checkFullscreen);
      document.removeEventListener("webkitfullscreenchange", checkFullscreen);
      document.removeEventListener("mozfullscreenchange", checkFullscreen);
      document.removeEventListener("MSFullscreenChange", checkFullscreen);
    };
  }, []);

  function startInterview(applicationId) {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    setIsLoading(true);
    axios
      .get(`${url}/api/job/application/${applicationId}`, { headers })
      .then((res) => {
        if (res.data.status === "AWAITING_INTERVIEW") {
          console.log("Interview started");
          axios
            .post(
              `${url}/api/interview/start`,
              {
                job_application_id: applicationId,
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            )
            .then((res) => {
              console.log(res);
              setIsLoading(false);
              navigate(`/applicant/interview/${applicationId}`);
            })
            .catch((err) => {
              console.error(err);
            });
        } else {
          navigate(`/applicant/interview/${applicationId}`);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function requestFullscreen() {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      // Firefox
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      // Chrome, Safari and Opera
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      // IE/Edge
      elem.msRequestFullscreen();
    }
  }

  // eslint-disable-next-line react/prop-types
  const AvailableKeys = ({ children, ...others }) => (
    <MKBox
      width="fit-content"
      height={35}
      px={2}
      borderRadius="md"
      bgColor="#F5F5F5"
      display="flex"
      justifyContent="center"
      alignItems="center"
      {...others}
    >
      <MKTypography variant="caption" sx={{ fontWeight: 600 }}>
        {children}
      </MKTypography>
    </MKBox>
  );

  return (
    <Container>
      <MKBox display="flex" justifyContent="center" alignItems="center" height="90vh">
        <MKBox
          bgColor="#FAFAFF"
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          alignItems="center"
          pt={4}
          pb={3}
          px={10}
          borderRadius={15}
          mx="auto"
          width="80%"
          minHeight="70%"
        >
          <MKTypography variant="h2" textAlign="center">
            Interview Instructions
          </MKTypography>
          <MKBox
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap={1.5}
            maxWidth={600}
            my={3}
          >
            <MKTypography variant="body1" textAlign="center">
              You are about to start the interview. Please make sure you are in a quiet environment
              and have a stable internet connection.
            </MKTypography>
            <MKTypography variant="body1" textAlign="center">
              The interview will be conducted in fullscreen mode. Any{" "}
              <span style={{ color: "red" }}> suspicious activity </span> will be considered as a
              violation of the interview rules.
            </MKTypography>
          </MKBox>
          <MKBox display="flex" flexDirection="column" maxWidth={720} gap={1.5}>
            <MKTypography variant="body2" textAlign="center" mb={2} sx={{ fontWeight: 700 }}>
              You can only use the following keys during the interview:
            </MKTypography>
            <Grid container spacing={2} justifyContent="center">
              <Grid item>
                <AvailableKeys>Letters (A-Z | a-z))</AvailableKeys>
              </Grid>
              <Grid item>
                <AvailableKeys>Numbers (0-9)</AvailableKeys>
              </Grid>
              {specialKeys.map((key) => (
                <Grid item key={key}>
                  <AvailableKeys>{key}</AvailableKeys>
                </Grid>
              ))}
              {punctuationKeys.map((key) => (
                <Grid item key={key}>
                  <AvailableKeys width={35}>{key}</AvailableKeys>
                </Grid>
              ))}
            </Grid>
          </MKBox>
          <MKBox
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap={2}
            mt={3}
          >
            <MKTypography variant="body2" textAlign="center">
              Press the button below to go fullscreen and start the interview.
            </MKTypography>
            <MKBox
              display="flex"
              flexDirection="row"
              justifyContent="center"
              alignItems="center"
              gap={5}
            >
              <MKButton
                onClick={requestFullscreen}
                disabled={isFullscreen}
                variant="contained"
                color="warning"
                size="large"
              >
                Go Fullscreen
              </MKButton>
              <MKButton
                onClick={() => startInterview(applicationId)}
                disabled={!isFullscreen}
                variant="contained"
                color="primary"
                size="large"
              >
                Start Interview
              </MKButton>
            </MKBox>
            {isLoading && <SpinningBar size={40} />}
          </MKBox>
        </MKBox>
      </MKBox>
    </Container>
  );
};

Interview.propTypes = {
  applicationId: propTypes.string,
};

export default Interview;
