import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  Container,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableContainer,
  IconButton,
  SvgIcon,
  Stack,
  Paper,
  Checkbox,
  InputAdornment,
  Tooltip,
  FormControlLabel,
} from "@mui/material";
import { styled } from "@mui/system";

import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKButton from "components/MKButton";
import MKInput from "components/MKInput";

import {
  MagnifyingGlassIcon,
  EyeIcon,
  PencilIcon,
  PlayIcon,
  StopIcon,
  PlusIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";

import { convertDateString } from "utils/functions";
import SpinningBar from "atoms/SpinningBar";

const NewTableCell = styled(TableCell)({
  textAlign: "center",
  padding: "0.75rem 0.5rem",
  width: "120px",
});

function HomeCompany() {
  const navigate = useNavigate();
  // eslint-disable-next-line no-undef
  const url = process.env.REACT_APP_API_URL;
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [query, setQuery] = useState("");
  const [openOnly, setOpenOnly] = useState(false);
  const [loading, setLoading] = useState(false);

  const editJob = (id) => {
    console.log("Edit job", id);
  };

  const updateStatus = (id, type) => {
    let status = true;
    switch (type) {
      case "open":
        status = true;
        break;
      case "close":
        status = false;
        break;
      default:
        status = true;
    }
    axios
      .patch(
        `${url}/api/job/status`,
        { jobId: id, status: status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        fetchJobs();
      })
      .catch((error) => {
        console.log(error);
      });
    console.log("Open job", id);
  };

  const fetchJobs = () => {
    axios
      .get(`${url}/api/job/posted`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setJobs(res.data.data);
        setFilteredJobs(res.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    setLoading(true);
    fetchJobs();
  }, []);

  useEffect(() => {
    let filtered = jobs.filter((job) => {
      if (openOnly && job.status !== "OPEN") return false;
      if (!job.title.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
    setFilteredJobs(filtered);
  }, [query, openOnly]);

  return (
    <Container>
      <Stack direction="column" spacing={2} mt={3} minHeight="calc(100vh - 98px)">
        {/* Search bar and add button */}
        <Stack
          direction="row"
          spacing={5}
          justifyContent="space-between"
          alignItems="center"
          px={1.2}
        >
          <MKTypography variant="h3" sx={{ width: "40%" }}>
            {jobs.length} Job Vancacies
          </MKTypography>
          <Stack direction="row" spacing={5} justifyContent="flex-end" sx={{ flexGrow: 1 }}>
            <MKBox
              display="flex"
              flexDirection="row"
              bgColor="white"
              py={1.5}
              px={1.5}
              borderRadius={15}
              sx={{ width: "100%" }}
              gap={3}
            >
              <MKInput
                sx={{ flexGrow: 1 }}
                label="Title"
                placeholder="Search job title"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    console.log("Query", query);
                  }
                }}
                startAdornment={
                  <InputAdornment position="start">
                    <SvgIcon color="action" fontSize="small">
                      <MagnifyingGlassIcon />
                    </SvgIcon>
                  </InputAdornment>
                }
              />
              <FormControlLabel
                label="Open only"
                control={
                  <Checkbox
                    checked={openOnly}
                    onChange={(event) => {
                      setOpenOnly(event.target.checked);
                    }}
                    name="openOnly"
                    color="primary"
                  />
                }
              />
            </MKBox>
            <MKButton
              variant="contained"
              color="primary"
              startIcon={<SvgIcon as={PlusIcon} size="normal" />}
              width="30%"
              onClick={() => {
                navigate("/company/add-job");
              }}
            >
              Add Job
            </MKButton>
          </Stack>
        </Stack>
        {/* Table */}
        <MKBox>
          <TableContainer
            compoment={Paper}
            style={{ paddingLeft: 0, paddingRight: 4, paddingTop: 10, paddingBottom: 15 }}
          >
            <Table>
              <TableHead sx={{ display: "table-header-group" }}>
                <TableRow>
                  <NewTableCell sx={{ width: "80px", paddingLeft: "20px" }}>
                    Open Status
                  </NewTableCell>
                  <TableCell align="center" sx={{ flexGrow: 1, minWidth: "450px" }}>
                    Job
                  </TableCell>
                  <NewTableCell>Applied</NewTableCell>
                  <NewTableCell>Interview Offered</NewTableCell>
                  <NewTableCell>Interviewed</NewTableCell>
                  <NewTableCell sx={{ width: "200px" }}>Actions</NewTableCell>
                </TableRow>
              </TableHead>
              <TableBody display={loading ? "none" : "table-row-group"}>
                {!loading && (jobs.length === 0 || filteredJobs.length === 0) && (
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
                          {jobs.length === 0 ? "No job posted" : "No Result"}
                        </MKTypography>
                      </MKBox>
                    </TableCell>
                  </TableRow>
                )}
                {filteredJobs.map((job, index) => (
                  <TableRow key={index}>
                    <NewTableCell sx={{ width: "50px", paddingLeft: "20px" }}>
                      {job.status === "OPEN" ? (
                        <Checkbox checked disabled />
                      ) : (
                        <Checkbox disabled />
                      )}
                    </NewTableCell>
                    <TableCell sx={{}}>
                      <MKTypography variant="h6">{job.title}</MKTypography>
                      <MKTypography variant="body2">{job.location}</MKTypography>
                      <Stack direction="row" spacing={10}>
                        <MKTypography variant="body2">
                          Created at {convertDateString(job.createdAt)}
                        </MKTypography>
                        {job.status === "OPEN" ? (
                          <MKTypography variant="body2">
                            Last updated: {convertDateString(job.updatedAt)}
                          </MKTypography>
                        ) : (
                          <MKTypography variant="body2">
                            <span style={{ color: "red" }}>Closed </span>at{" "}
                            {convertDateString(job.closedAt)}
                          </MKTypography>
                        )}
                      </Stack>
                    </TableCell>
                    <NewTableCell>{job.applicants}</NewTableCell>
                    <NewTableCell>{job.offeredInterview}</NewTableCell>
                    <NewTableCell>{job.interviewed}</NewTableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1.5} justifyContent="center">
                        <Tooltip title="View applicants">
                          <IconButton
                            onClick={() =>
                              navigate(`/company/history/${job.id}`, {
                                state: { title: job.title },
                              })
                            }
                          >
                            <SvgIcon as={UsersIcon} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="View job">
                          <IconButton onClick={() => navigate(`/detail-vacancy/${job.id}`)}>
                            <SvgIcon as={EyeIcon} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit job">
                          <IconButton onClick={() => editJob(job.id)}>
                            <SvgIcon as={PencilIcon} />
                          </IconButton>
                        </Tooltip>
                        {job.status === "OPEN" ? (
                          <Tooltip title="Close job">
                            <IconButton onClick={() => updateStatus(job.id, "close")}>
                              <SvgIcon as={StopIcon} />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Tooltip title="Open job">
                            <IconButton onClick={() => updateStatus(job.id, "open")}>
                              <SvgIcon as={PlayIcon} />
                            </IconButton>
                          </Tooltip>
                        )}
                        {/* Delete Job Not Needed Now */}
                        {/* <Tooltip title="Delete job">
                          <IconButton onClick={() => deleteJob(job.id)}>
                            <SvgIcon as={TrashIcon} />
                          </IconButton>
                        </Tooltip> */}
                      </Stack>
                    </TableCell>
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
        </MKBox>
      </Stack>
    </Container>
  );
}

export default HomeCompany;
