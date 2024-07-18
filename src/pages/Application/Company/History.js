import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";

import {
  Container,
  Grid,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableContainer,
  SvgIcon,
  Paper,
  InputAdornment,
  FormControl,
  FormControlLabel,
  Select,
  MenuItem,
  Checkbox,
  InputLabel,
} from "@mui/material";
import { styled } from "@mui/system";

import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKInput from "components/MKInput";

import { MagnifyingGlassIcon, XMarkIcon, CheckIcon } from "@heroicons/react/24/solid";

import { convertFloatToHundredBase } from "utils/functions";
import Ellipsis from "atoms/Ellipsis";
import SpinningBar from "atoms/SpinningBar";

const ActionTableCell = styled(TableCell)({
  textAlign: "center",
  padding: "0.75rem 0.5rem",
  width: "9%",
});

const StatusTableCell = styled(TableCell)({
  textAlign: "center",
  padding: "0.75rem 1rem",
  width: "12%",
});

const statusMap = {
  PENDING: "warning",
  AWAITING_INTERVIEW: "text",
  INTERVIEW: "info",
  AWAITING_EVALUATION: "info",
  EVALUATED: "warning",
  ACCEPTED: "success",
  REJECTED: "error",
};

function convertStatusCompany(status) {
  if (status === "PENDING") return "Need Review";
  if (status === "AWAITING_INTERVIEW") return "Interview Not Started";
  if (status === "INTERVIEW") return "Interviewing";
  if (status === "AWAITING_EVALUATION") return "Evaluating";
  if (status === "EVALUATED") return "Need Decision";
  if (status === "ACCEPTED") return "Accepted";
  if (status === "REJECTED") return "Rejected";
  return status;
}

function HistoryCompany() {
  const { jobId } = useParams();
  const location = useLocation();
  const title = location.state.title;
  // eslint-disable-next-line no-undef
  const url = process.env.REACT_APP_API_URL;
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [query, setQuery] = useState("");
  const [statusQuery, setStatusQuery] = useState("All");
  const [relevanceOnly, setRelevanceOnly] = useState(false);
  const [sortBy, setSortBy] = useState("None");
  const [loading, setLoading] = useState(false);

  const fetchApplications = () => {
    axios
      .get(`${url}/api/job/${jobId}/applications`, {
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
      if (relevanceOnly && !application.isRelevant) return false;
      if (!application.userName.toLowerCase().includes(query.toLowerCase())) return false;
      if (statusQuery !== "All" && convertStatusCompany(application.status) !== statusQuery)
        return false;
      return true;
    });

    if (sortBy === "CV Score") {
      filtered = filtered.sort((a, b) => b.relevanceScore - a.relevanceScore);
    } else if (sortBy === "Interview Score") {
      filtered = filtered.sort((a, b) => b.interviewScore - a.interviewScore);
    }

    setFilteredApplications(filtered);
  }, [query, statusQuery, relevanceOnly, sortBy]);

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
                  gap={2.5}
                >
                  <MKBox
                    display="flex"
                    flexDirection="row"
                    alignSelf="flex-start"
                    alignItems="center"
                    gap={2}
                  >
                    <MKTypography variant="h3">Application History</MKTypography>
                    <MKTypography variant="h4" color="grey">
                      :
                    </MKTypography>
                    <MKTypography variant="h4" color="primary">
                      {title}
                    </MKTypography>
                  </MKBox>
                  <MKBox display="flex" justifyContent="space-between" alignItems="center" gap={2}>
                    <MKBox flexGrow={1}>
                      <MKInput
                        fullWidth
                        label="Candidate Name"
                        placeholder="Search candidate name"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
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
                        <MenuItem value="Need Review">Need Review</MenuItem>
                        <MenuItem value="Interview Not Started">Interview Not Started</MenuItem>
                        <MenuItem value="Interviewing">Interviewing</MenuItem>
                        <MenuItem value="Evaluating">Evaluating</MenuItem>
                        <MenuItem value="Need Decision">Need Decision</MenuItem>
                        <MenuItem value="Accepted">Accepted</MenuItem>
                        <MenuItem value="Rejected">Rejected</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl sx={{ minWidth: "15%" }}>
                      <InputLabel id="sortBy">Sort By</InputLabel>
                      <Select
                        labelId="sortBy"
                        label="Sort By"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                      >
                        <MenuItem value="None">None</MenuItem>
                        <MenuItem value="CV Score">CV Score</MenuItem>
                        <MenuItem value="Interview Score">Interview Score</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControlLabel
                      label="Relevance Only"
                      control={
                        <Checkbox
                          checked={relevanceOnly}
                          onChange={(e) => setRelevanceOnly(e.target.checked)}
                        />
                      }
                    />
                  </MKBox>
                </MKBox>
              </Grid>
              <Grid item xs={12}>
                <TableContainer component={Paper} sx={{ padding: "10px 20px 25px" }}>
                  <Table>
                    <TableHead sx={{ display: "table-header-group" }}>
                      <TableRow>
                        <TableCell align="center" sx={{ flexGrow: 1 }}>
                          Candidate
                        </TableCell>
                        <StatusTableCell align="center">CV Relevance</StatusTableCell>
                        <StatusTableCell align="center">CV Score</StatusTableCell>
                        <StatusTableCell align="center">Interview Score</StatusTableCell>
                        <TableCell align="center" sx={{ width: "21%" }}>
                          Status
                        </TableCell>
                        <ActionTableCell>Actions</ActionTableCell>
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
                                  {applications.length === 0 ? "No applicant applied" : "No result"}{" "}
                                </MKTypography>
                              </MKBox>
                            </TableCell>
                          </TableRow>
                        )}
                      {filteredApplications.map((application) => (
                        <TableRow key={application.id}>
                          <TableCell>{application.userName}</TableCell>
                          <TableCell align="center">
                            <MKBox
                              display="flex"
                              justifyContent="center"
                              alignContent="center"
                              sx={{ width: "100%" }}
                            >
                              <SvgIcon
                                fontSize="normal"
                                color={application.isRelevant ? "success" : "error"}
                              >
                                {application.isRelevant ? <CheckIcon /> : <XMarkIcon />}
                              </SvgIcon>
                            </MKBox>
                          </TableCell>
                          <TableCell align="center">
                            <MKTypography variant="body2" color="info">
                              {convertFloatToHundredBase(application.relevanceScore)}
                            </MKTypography>
                          </TableCell>
                          <TableCell align="center">
                            <MKTypography variant="body2" color="info">
                              {application.interviewScore && application.interviewScore != 0
                                ? application.interviewScore.toFixed(2)
                                : "N/A"}
                            </MKTypography>
                          </TableCell>
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
                                  {/* split application.status */}
                                  {convertStatusCompany(application.status)}
                                </MKTypography>
                              </MKBox>
                            </MKBox>
                          </TableCell>
                          <ActionTableCell>
                            <Ellipsis application={application} />
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

export default HistoryCompany;
