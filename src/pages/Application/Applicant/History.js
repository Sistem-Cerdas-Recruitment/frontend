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
  FormControl,
  MenuItem,
  InputLabel,
  Select,
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
  width: "10%",
});

const statusMap = {
  PENDING: "info",
  AWAITING_INTERVIEW: "warning",
  INTERVIEW: "text",
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
  // eslint-disable-next-line no-undef
  const onDevelopment = process.env.REACT_APP_ONDEV === "true";
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [titleQuery, setTitleQuery] = useState("");
  const [companyQuery, setCompanyQuery] = useState("");
  const [statusQuery, setStatusQuery] = useState("All");
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
        setFilteredApplications(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    let filtered = applications.filter((application) => {
      if (!application.jobTitle.toLowerCase().includes(titleQuery.toLowerCase())) return false;
      if (!application.recruiterName.toLowerCase().includes(companyQuery.toLowerCase()))
        return false;
      if (statusQuery !== "All" && convertStatusApplicant(application.status) !== statusQuery)
        return false;
      return true;
    });
    setFilteredApplications(filtered);
  }, [titleQuery, companyQuery, statusQuery]);

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
                <MKBox
                  display="flex"
                  flexDirection="column"
                  bgColor="white"
                  py={2}
                  px={4}
                  borderRadius={15}
                  gap={3}
                >
                  <MKTypography variant="h3">Application History</MKTypography>
                  <MKBox display="flex" justifyContent="space-between" alignItems="center" gap={2}>
                    <MKBox flexGrow={1}>
                      <MKInput
                        fullWidth
                        label="Title"
                        placeholder="Search by job title"
                        value={titleQuery}
                        onChange={(e) => setTitleQuery(e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SvgIcon
                                component={MagnifyingGlassIcon}
                                sx={{ width: 24, height: 24 }}
                              />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </MKBox>
                    <MKBox minWidth="30%">
                      <MKInput
                        fullWidth
                        label="Company"
                        placeholder="Search by company name"
                        value={companyQuery}
                        onChange={(e) => setCompanyQuery(e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SvgIcon
                                component={MagnifyingGlassIcon}
                                sx={{ width: 24, height: 24 }}
                              />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </MKBox>
                    <FormControl sx={{ minWidth: "20%" }}>
                      <InputLabel id="status">Status</InputLabel>
                      <Select
                        labelId="status"
                        label="Status"
                        value={statusQuery}
                        onChange={(e) => setStatusQuery(e.target.value)}
                      >
                        <MenuItem value="All">All</MenuItem>
                        <MenuItem value="CV on Review">CV on Review</MenuItem>
                        <MenuItem value="Need Interview">Need Interview</MenuItem>
                        <MenuItem value="Interviewing">Interviewing</MenuItem>
                        <MenuItem value="Interview Done">Interview Done</MenuItem>
                        <MenuItem value="Accepted">Accepted</MenuItem>
                        <MenuItem value="Rejected">Rejected</MenuItem>
                      </Select>
                    </FormControl>
                  </MKBox>
                </MKBox>
              </Grid>
              <Grid item xs={12}>
                <TableContainer component={Paper} sx={{ padding: "10px 30px 25px 20px" }}>
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
                      {!loading &&
                        (applications.length === 0 || filteredApplications.length === 0) && (
                          <TableRow>
                            <TableCell colSpan={6}>
                              {/* items at center center */}
                              <MKBox
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                minHeight="30vh"
                                pb={3}
                              >
                                <MKTypography variant="h4">
                                  {applications.length === 0 ? "No job applied" : "No Result"}
                                </MKTypography>
                              </MKBox>
                            </TableCell>
                          </TableRow>
                        )}
                      {filteredApplications.map((application) => (
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
                                  width: "100%",
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
                            {application.status === "AWAITING_INTERVIEW" ||
                            (application.status === "INTERVIEW" && onDevelopment) ? (
                              <MKButton
                                onClick={() => {
                                  window.open(
                                    `/applicant/interview-intro/${application.id}`,
                                    "_blank"
                                  );
                                }}
                                variant="contained"
                                color="primary"
                                fullWidth
                              >
                                {application.status === "AWAITING_INTERVIEW" ? "START" : "RESUME"}
                              </MKButton>
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
