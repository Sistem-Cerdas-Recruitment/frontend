import propTypes from "prop-types";
import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import {
  Card,
  Grid,
  InputAdornment,
  OutlinedInput,
  SvgIcon,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  ListItemText,
  Checkbox,
} from "@mui/material";

import MKButton from "components/MKButton";

const JobFilter = (props) => {
  const typeOptions = ["Internship", "Full-time", "Part-time", "Contract"];
  const modeOptions = ["Remote", "Hybrid", "On-site"];
  const createdAtOptions = [
    "Any time",
    "Last 24 hours",
    "Last 3 days",
    "Last 7 days",
    "Last 14 days",
    "Last 30 days",
  ];
  const experienceLevelOptions = [
    "Internship",
    "Junior Level",
    "Associate",
    "Mid Level",
    "Senior Level",
    "Lead Level",
  ];

  const handleSearch = () => {
    console.log(localStorage.getItem("email"));
    console.log(localStorage.getItem("role"));
    console.log("Search");
  };

  return (
    <Card sx={{ px: 4, pt: 2.5, pb: 1.5 }}>
      <Grid alignItems="center" container spacing={2.5}>
        {/* Search Section */}
        <Grid item xs={5.3}>
          <OutlinedInput
            fullWidth
            placeholder="Find a job, role, or company"
            value={props.query}
            onChange={(event) => {
              props.setQuery(event.target.value);
            }}
            startAdornment={
              <InputAdornment position="start">
                <SvgIcon color="action" fontSize="small">
                  <MagnifyingGlassIcon />
                </SvgIcon>
              </InputAdornment>
            }
          />
        </Grid>
        <Grid item xs={5.5}>
          <OutlinedInput
            fullWidth
            placeholder="Find an exact location"
            value={props.location}
            onChange={(event) => {
              props.setLocation(event.target.value);
            }}
          />
        </Grid>
        <Grid item xs={1.2}>
          <MKButton variant="contained" color="primary" onClick={handleSearch}>
            Search
          </MKButton>
        </Grid>
        {/* Filter Section */}
        <Grid item xs={1.5}>
          <FormControl fullWidth required>
            <InputLabel id="date-posted">Date Posted</InputLabel>
            <Select
              labelId="date-posted"
              label="Date Posted"
              name="createdAt"
              onChange={(event) => {
                props.setCreatedAt(event.target.value);
              }}
              value={props.createdAt}
            >
              {createdAtOptions.map((createdAt) => (
                <MenuItem key={createdAt} value={createdAt}>
                  {createdAt}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={3}>
          <FormControl fullWidth required>
            <InputLabel id="mode">Modes</InputLabel>
            <Select
              multiple
              labelId="mode"
              label="Mode"
              name="mode"
              onChange={(event) => {
                props.setMode(event.target.value);
              }}
              value={props.mode}
              renderValue={(selected) => {
                // eslint-disable-next-line prettier/prettier
                return selected.length === modeOptions.length ? "All Modes" : selected.join(", ");
              }}
            >
              {modeOptions.map((mode) => (
                <MenuItem key={mode} value={mode}>
                  <Checkbox checked={props.mode.indexOf(mode) > -1} />
                  <ListItemText primary={mode} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={3}>
          <FormControl fullWidth required>
            <InputLabel id="type">Type</InputLabel>
            <Select
              multiple
              labelId="type"
              label="Type"
              name="type"
              onChange={(event) => {
                props.setType(event.target.value);
              }}
              value={props.type}
              renderValue={(selected) => {
                return selected.length === typeOptions.length ? "All Types" : selected.join(", ");
              }}
            >
              {typeOptions.map((type) => (
                <MenuItem key={type} value={type}>
                  <Checkbox checked={props.type.indexOf(type) > -1} />
                  <ListItemText primary={type} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={4.5}>
          <FormControl fullWidth required>
            <InputLabel id="experience-level">Experience Level</InputLabel>
            <Select
              multiple
              labelId="experience-level"
              label="Experience Level"
              name="experienceLevel"
              onChange={(event) => {
                props.setExperienceLevel(event.target.value);
              }}
              value={props.experienceLevel}
              renderValue={(selected) => {
                return selected.length === experienceLevelOptions.length
                  ? "All Experience Levels"
                  : selected.join(", ");
              }}
            >
              {experienceLevelOptions.map((experienceLevel) => (
                <MenuItem key={experienceLevel} value={experienceLevel}>
                  <Checkbox checked={props.experienceLevel.indexOf(experienceLevel) > -1} />
                  <ListItemText primary={experienceLevel} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Card>
  );
};

JobFilter.propTypes = {
  query: propTypes.string,
  setQuery: propTypes.func,
  location: propTypes.string,
  setLocation: propTypes.func,
  type: propTypes.arrayOf(propTypes.string),
  setType: propTypes.func,
  mode: propTypes.arrayOf(propTypes.string),
  setMode: propTypes.func,
  createdAt: propTypes.string,
  setCreatedAt: propTypes.func,
  experienceLevel: propTypes.arrayOf(propTypes.string),
  setExperienceLevel: propTypes.func,
};

export default JobFilter;
