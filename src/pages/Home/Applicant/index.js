import axios from "axios";
import { useEffect, useState } from "react";

import { Container, Grid } from "@mui/material";
import MKBox from "components/MKBox";

// Pages Section Components
import JobCard from "sections/Applicant/Home/JobCard";
import JobDetail from "sections/Applicant/Home/JobDetail";
import JobFilter from "sections/Applicant/Home/JobFilter";
import SpinningBar from "atoms/SpinningBar";

import { convertBe2FeJob } from "utils/functions";
import MKTypography from "components/MKTypography";

function HomeApplicant() {
  // eslint-disable-next-line no-undef
  const url = process.env.REACT_APP_API_URL;
  const [jobs, setJobs] = useState([]);
  const [jobId, setJobId] = useState(null);
  const [selectedJob, setSelectedJob] = useState({});
  // filter
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [createdAt, setCreatedAt] = useState("Any time");
  const [mode, setMode] = useState([]);
  const [type, setType] = useState([]);
  const [experienceLevel, setExperienceLevel] = useState([]);
  // loading
  const [loadingCard, setLoadingCard] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const fetchJobs = () => {
    axios
      .get(`${url}/api/job/all`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        const newJobs = res.data.data.map((job) => convertBe2FeJob(job));
        setJobs(newJobs);
        setLoadingCard(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const selectJob = (jobId) => {
    axios
      .get(`${url}/api/job/${jobId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setSelectedJob(convertBe2FeJob(res.data));
        setLoadingDetail(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (jobId) {
      setLoadingDetail(true);
      selectJob(jobId);
    }
  }, [jobId]);

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <Container>
      <MKBox minHeight="100vh" p={2}>
        <JobFilter
          query={query}
          setQuery={setQuery}
          location={location}
          setLocation={setLocation}
          type={type}
          setType={setType}
          mode={mode}
          setMode={setMode}
          createdAt={createdAt}
          setCreatedAt={setCreatedAt}
          experienceLevel={experienceLevel}
          setExperienceLevel={setExperienceLevel}
        />
        <MKBox>
          <Grid container mt={2}>
            {/* Job Card */}
            <Grid item xs={4.5}>
              <Grid container spacing={1} pr={1} sx={{ overflowY: "auto", maxHeight: "100vh" }}>
                {loadingCard && (
                  <Grid
                    item
                    xs={12}
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    minHeight="50vh"
                    gap={2}
                  >
                    <MKTypography variant="h5">Fetching Recent Job Vacancies</MKTypography>
                    <SpinningBar />
                  </Grid>
                )}
                {jobs.map((job) => (
                  <Grid item xs={12} key={job.id}>
                    <JobCard job={job} setJobId={setJobId} />
                  </Grid>
                ))}
              </Grid>
            </Grid>
            {/* Job Detail */}
            <Grid item xs={7.5} pl={1}>
              <JobDetail
                selectedJob={selectedJob}
                setSelectedJob={setSelectedJob}
                setJobId={setJobId}
                loadingDetail={loadingDetail}
              />
            </Grid>
          </Grid>
        </MKBox>
      </MKBox>
    </Container>
  );
}

export default HomeApplicant;
