import propTypes from "prop-types";
import { ButtonBase, Card, Stack, SvgIcon } from "@mui/material";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import { convertSalaryRange, dateDifference } from "utils/functions";

import { MapPinIcon, BanknotesIcon } from "@heroicons/react/24/solid";

const JobCard = (props) => {
  const { job, setJobId } = props;
  return (
    <ButtonBase
      onClick={() => setJobId(job.id)}
      key={job.id}
      sx={{ width: "100%", textAlign: "left" }}
    >
      <Card key={job.id} sx={{ width: "100%" }}>
        <MKBox px={4.8} pt={3.5} pb={1.7}>
          {/* max height 20 */}
          {job.img && <img src={job.img} alt={job.title} style={{ maxHeight: "60px" }} />}
          <MKTypography variant="h4" sx={{ textDecoration: "underline" }}>
            {job.title}
          </MKTypography>
          <MKTypography variant="body1" color="dark">
            {job.company}
          </MKTypography>
          <Stack direction="row" spacing={1} alignItems="center">
            <SvgIcon component={MapPinIcon} />
            <MKTypography variant="body2" color="grey">
              {job.location}
            </MKTypography>
          </Stack>
          {job.minSalary && (
            <Stack direction="row" spacing={1} alignItems="center">
              <SvgIcon component={BanknotesIcon} />
              <MKTypography variant="body2">
                {convertSalaryRange(job.minSalary, job.maxSalary)}
              </MKTypography>
            </Stack>
          )}
          {/* if had advantages */}
          {job.advantages && (
            <MKTypography variant="body2" pl={1}>
              {job.advantages.map((advantage) => (
                <li key={advantage}>{advantage}</li>
              ))}
            </MKTypography>
          )}
          <MKTypography variant="body2" sx={{ fontWeight: 400, marginTop: "12px", color: "grey" }}>
            {dateDifference(job.createdAt)}
          </MKTypography>
        </MKBox>
      </Card>
    </ButtonBase>
  );
};

JobCard.propTypes = {
  job: propTypes.object.isRequired,
  setJobId: propTypes.func.isRequired,
};

export default JobCard;
