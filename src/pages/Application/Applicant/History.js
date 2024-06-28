import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  Container,
  Grid,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableContainer,
  IconButton,
  SvgIcon,
  Paper,
  InputAdornment,
} from "@mui/material";
import { styled } from "@mui/system";

import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKInput from "components/MKInput";
import MKButton from "components/MKButton";

import { MagnifyingGlassIcon, EyeIcon } from "@heroicons/react/24/solid";
import SpinningBar from "atoms/SpinningBar";

const ActionTableCell = styled(TableCell)({
  textAlign: "center",
  padding: "0.75rem 0.5rem",
  width: "9%",
});

const statusMap = {
  PENDING: "warning",
  AWAITING_INTERVIEW: "info",
  INTERVIEW: "info",
  AWAITING_EVALUATION: "info",
  EVALUATED: "info",
  ACCEPTED: "success",
  REJECTED: "error",
};

function convertStatusApplicant(status) {
  if (status === "PENDING") return "CV on Review";
  if (status === "AWAITING_INTERVIEW") return "Need Interview";
  if (status === "INTERVIEW") return "Interviewing";
  if (["AWAITING_EVALUATION", "EVALUATED"].includes(status)) return "Interview Done";
  if (status === "ACCEPTED") return "Accepted";
  if (status === "REJECTED") return "Rejected";
  return status;
}

function HistoryApplicant() {
  const navigate = useNavigate();
  // eslint-disable-next-line no-undef
  const url = process.env.REACT_APP_API_URL;
  const [applications, setApplications] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchApplications = () => {
    axios
      .get(`${url}/api/job/applications`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setApplications(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const startInterview = (applicationId) => {
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
        window.open(`/applicant/interview/${applicationId}`, "_blank");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    setLoading(true);
    fetchApplications();
  }, []);

  return (
    <Container>
      <Grid container spacing={2} height="calc(100vh - 53px)">
        <Grid item xs={12}>
          <MKBox p={2}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <MKInput
                  fullWidth
                  placeholder="Search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SvgIcon component={MagnifyingGlassIcon} sx={{ width: 24, height: 24 }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TableContainer component={Paper} sx={{ padding: 2 }}>
                  <Table>
                    <TableHead sx={{ display: "table-header-group" }}>
                      <TableRow>
                        <TableCell align="center" sx={{ flexGrow: 1 }}>
                          Job Title
                        </TableCell>
                        <TableCell align="center" sx={{ width: "22%" }}>
                          Company
                        </TableCell>
                        <TableCell align="center" sx={{ width: "18%" }}>
                          Status
                        </TableCell>
                        <TableCell align="center" sx={{ width: "10%" }}>
                          View Vacancy
                        </TableCell>
                        <ActionTableCell>Start Interview</ActionTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody display={loading ? "none" : "table-row-group"}>
                      {applications.map((application) => (
                        <TableRow key={application.id}>
                          <TableCell>
                            <MKTypography
                              variant="body2"
                              color="info"
                              sx={{ fontWeight: "bold", fontDecoration: "underline" }}
                            >
                              {application.jobTitle}
                            </MKTypography>
                          </TableCell>
                          <TableCell>{application.recruiterName}</TableCell>
                          <TableCell>
                            <MKBox
                              sx={{ display: "flex", justifyContent: "center", width: "100%" }}
                            >
                              <MKBox
                                bgColor={statusMap[application.status]}
                                sx={{
                                  borderRadius: 20,
                                  padding: "0.5rem 2rem",
                                  width: "fit-content",
                                }}
                              >
                                <MKTypography
                                  variant="body2"
                                  color="white"
                                  sx={{ textTransform: "capitalize", textAlign: "center" }}
                                >
                                  {convertStatusApplicant(application.status)}
                                </MKTypography>
                              </MKBox>
                            </MKBox>
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              onClick={() => navigate(`/detail-vacancy/${application.jobId}`)}
                            >
                              <SvgIcon as={EyeIcon} />
                            </IconButton>
                          </TableCell>
                          <ActionTableCell>
                            {["AWAITING_INTERVIEW", "INTERVIEW"].includes(application.status) ? (
                              application.status === "AWAITING_INTERVIEW" ? (
                                <MKButton
                                  onClick={() => startInterview(application.id)}
                                  variant="contained"
                                  color="primary"
                                >
                                  GO
                                </MKButton>
                              ) : (
                                <MKButton
                                  onClick={() =>
                                    window.open(`/applicant/interview/${application.id}`, "_blank")
                                  }
                                  variant="contained"
                                  color="primary"
                                >
                                  CONTINUE
                                </MKButton>
                              )
                            ) : (
                              <MKTypography variant="body2" color="error">
                                Not Available
                              </MKTypography>
                            )}
                          </ActionTableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {loading && (
                    <MKBox
                      display="flex"
                      flexDirection="column"
                      justifyContent="center"
                      alignItems="center"
                      minHeight="30vh"
                      gap={2}
                    >
                      <SpinningBar />
                    </MKBox>
                  )}
                </TableContainer>
              </Grid>
            </Grid>
          </MKBox>
        </Grid>
      </Grid>
    </Container>
  );
}

export default HistoryApplicant;
