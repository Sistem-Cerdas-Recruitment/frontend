import propTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { Card, IconButton, SvgIcon } from "@mui/material";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKButton from "components/MKButton";

import {
  XMarkIcon,
  ArrowLongLeftIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  ClockIcon,
  BanknotesIcon,
  UserGroupIcon,
} from "@heroicons/react/24/solid";

import { convertSalaryRange, dateDifference } from "utils/functions";
import SpinningBar from "atoms/SpinningBar";

const JobDetail = (props) => {
  const { selectedJob, setSelectedJob, setJobId, loadingDetail, isFull } = props;
  const navigate = useNavigate();

  const cardStyle = isFull ? { width: "55%" } : { overflowY: "auto", maxHeight: "100vh" };
  return (
    <>
      {selectedJob.id && !loadingDetail ? (
        <Card sx={cardStyle}>
          <MKBox px={7} py={4}>
            {!isFull ? (
              <IconButton
                onClick={() => {
                  setSelectedJob({});
                  setJobId(null);
                }}
                style={{ position: "absolute", right: 10, top: 10 }}
              >
                <SvgIcon component={XMarkIcon} />
              </IconButton>
            ) : (
              <IconButton
                onClick={() => navigate(-1)}
                size="large"
                style={{ position: "absolute", right: 25, top: 20 }}
              >
                <SvgIcon component={ArrowLongLeftIcon} />
              </IconButton>
            )}
            {selectedJob.img && (
              <img src={selectedJob.img} alt={selectedJob.title} style={{ maxHeight: "100px" }} />
            )}
            <MKTypography variant="h3">{selectedJob.title}</MKTypography>
            <MKTypography variant="body1">{selectedJob.company}</MKTypography>
            <MKBox display="flex" alignItems="center" gap={1.5} mt={2}>
              <SvgIcon component={MapPinIcon} />
              <MKTypography variant="body2">{selectedJob.location}</MKTypography>
            </MKBox>
            <MKBox display="flex" alignItems="center" gap={1.5}>
              <SvgIcon component={ClockIcon} />
              <MKTypography variant="body2">{selectedJob.type}</MKTypography>
            </MKBox>
            <MKBox display="flex" alignItems="center" gap={1.5}>
              <SvgIcon component={BuildingOfficeIcon} />
              <MKTypography variant="body2">{selectedJob.mode}</MKTypography>
            </MKBox>
            {selectedJob.minSalary && (
              <MKBox display="flex" alignItems="center" gap={1.5}>
                <SvgIcon component={BanknotesIcon} />
                <MKTypography variant="body2">
                  {convertSalaryRange(selectedJob.minSalary, selectedJob.maxSalary)} per month
                </MKTypography>
              </MKBox>
            )}
            <MKBox display="flex" alignItems="center" gap={1.5} mt={2}>
              <SvgIcon component={UserGroupIcon} />
              <MKTypography variant="body2">{selectedJob.experienceLevel}</MKTypography>
            </MKBox>
            <MKBox display="flex" alignItems="center" gap={1.5} mt={2}>
              <MKTypography variant="body2" sx={{ fontWeight: 400, color: "grey" }}>
                Posted {dateDifference(selectedJob.createdAt)}
              </MKTypography>
            </MKBox>
            {!isFull && (
              <MKBox display="flex" justifyContent="center" mt={1} mb={3}>
                <MKButton
                  variant="contained"
                  color="primary"
                  sx={{ width: "50%", marginTop: "5px" }}
                  size="large"
                  onClick={() => {
                    const token = localStorage.getItem("token");
                    if (token) {
                      navigate(`/applicant/apply-cv/${selectedJob.id}`, {
                        state: { job: selectedJob },
                      });
                    } else {
                      navigate(`/sign-in`, {
                        state: {
                          next: `/applicant/apply-cv/${selectedJob.id}`,
                          job: selectedJob,
                        },
                      });
                    }
                  }}
                >
                  Apply
                </MKButton>
              </MKBox>
            )}
            {selectedJob.description && (
              <MKBox mt={2} display="flex" flexDirection="column" gap={0.5}>
                <MKTypography variant="h6">Job Description</MKTypography>
                <MKTypography variant="body2" pl={3}>
                  {selectedJob.description}
                </MKTypography>
              </MKBox>
            )}
            <MKBox mt={2} display="flex" flexDirection="column" gap={0.5}>
              <MKTypography variant="h6">Requirements</MKTypography>
              <MKTypography variant="body2" pl={3}>
                <li key="minYearExperience">
                  Minimum{" "}
                  <span style={{ fontWeight: "bold" }}>{selectedJob.minYearExperience} years</span>{" "}
                  of experience in related field
                </li>
                <li key="majors">
                  Avaliable for{" "}
                  <span style={{ fontStyle: "italic", fontWeight: "bold" }}>
                    {selectedJob.majors.join(", ").toLowerCase()}
                  </span>{" "}
                  majors
                </li>
                {selectedJob.requirements.map((requirement, index) => (
                  <li key={index}>{requirement}</li>
                ))}
              </MKTypography>
            </MKBox>
            {selectedJob.responsibilities && (
              <MKBox mt={2} display="flex" flexDirection="column" gap={0.5}>
                <MKTypography variant="h6">Responsibilities</MKTypography>
                <MKTypography variant="body2" pl={3}>
                  {selectedJob.responsibilities.map((responsibility, index) => (
                    <li key={index}>{responsibility}</li>
                  ))}
                </MKTypography>
              </MKBox>
            )}
            {selectedJob.advantages && (
              <MKBox mt={2} display="flex" flexDirection="column" gap={0.5}>
                <MKTypography variant="h6">Advantages</MKTypography>
                <MKTypography variant="body2" pl={3}>
                  {selectedJob.advantages.map((advantage, index) => (
                    <li key={index}>{advantage}</li>
                  ))}
                </MKTypography>
              </MKBox>
            )}
            {selectedJob.additionalInfo && (
              <MKBox mt={2} display="flex" flexDirection="column" gap={0.5}>
                <MKTypography variant="h6">Additional Information</MKTypography>
                <MKTypography variant="body2" pl={3}>
                  {selectedJob.additionalInfo}
                </MKTypography>
              </MKBox>
            )}
          </MKBox>
        </Card>
      ) : (
        <>
          {(!isFull && loadingDetail) || isFull ? (
            <MKBox
              item
              xs={12}
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              minHeight="50vh"
              gap={2}
            >
              <MKTypography variant="h5">Fetching Selected Job</MKTypography>
              <SpinningBar />
            </MKBox>
          ) : (
            <MKBox p={3} display="flex" justifyContent="center">
              <MKTypography variant="h3">Choose a job vacancy</MKTypography>
            </MKBox>
          )}
        </>
      )}
    </>
  );
};

JobDetail.propTypes = {
  selectedJob: propTypes.object.isRequired,
  setSelectedJob: propTypes.func.isRequired,
  setJobId: propTypes.func.isRequired,
  loadingDetail: propTypes.bool,
  isFull: propTypes.bool,
};

JobDetail.defaultProps = {
  loadingDetail: false,
  isFull: false,
};

export default JobDetail;
