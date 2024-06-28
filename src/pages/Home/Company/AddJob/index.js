import axios from "axios";

import {
  Container,
  Grid,
  Box,
  TextField,
  Autocomplete,
  Select,
  FormControl,
  MenuItem,
  InputLabel,
  Checkbox,
  ListItemText,
} from "@mui/material";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKButton from "components/MKButton";
import MKInput from "components/MKInput";
import AddableForm from "./AddForm";

import { toast } from "react-toastify";
import { Formik } from "formik";
import * as Yup from "yup";

import RadioInput from "atoms/RadioInput";
import { majors } from "utils/enums/majors";
import { cities } from "utils/enums/cities";
import { modes, types, experienceLevels } from "utils/enums/options";
import { convertFe2BeJob } from "utils/functions";

function AddJob() {
  // eslint-disable-next-line no-undef
  const url = process.env.REACT_APP_API_URL;
  const initialValues = {
    title: "",
    location: "",
    type: "",
    mode: "",
    experienceLevel: "",
    minSalary: "",
    maxSalary: "",
    minYearExperience: "",
    majors: [],
    requirements: [""],
    responsibilities: [],
    description: "",
    advantages: [],
    additionalInfo: "",
  };

  const validationSchema = Yup.object({
    title: Yup.string().required("Job title is required"),
    location: Yup.string().required("Location is required"),
    type: Yup.string().required("Job type is required"),
    mode: Yup.string().required("Job mode is required"),
    experienceLevel: Yup.string().required("Experience level is required"),
    minSalary: Yup.number().min(100000).required("Min salary is required"),
    maxSalary: Yup.number()
      .min(100000)
      .when("minSalary", (minSalary, schema) => {
        return schema.min(minSalary);
      })
      .required("Max salary is required"),
    minYearExperience: Yup.number().min(0).required("Min year experience is required"),
    majors: Yup.array()
      .of(Yup.string().required("Major is required"))
      .min(1, "At least one major is required"),
    requirements: Yup.array()
      .of(Yup.string().required("Requirement is required"))
      .min(1, "At least one requirement is required"),
    responsibilities: Yup.array().of(Yup.string()),
    description: Yup.string(),
    advantages: Yup.array().of(Yup.string()),
    additionalInfo: Yup.string(),
  });

  const postNewJob = (values) => {
    // adjust values, beacuse there are some missmatch between frontend and backend
    // 1. title on BE is consist of title
    // 2. description on BE is consist of description (string), location (string), salary (array), advantages (array), and additionalInfo (string)
    // 3. skills on BE is consist of mode (string), type (string), experienceLevel (string), requirements (array), responsibilities (array)
    // 4. majors on BE is consist of majors
    // 5. years_of_experience on BE is consist of minYearExperience
    // the way to adjust is by creating new object for each of them and use JSON.stringify to convert each of them to string
    // for Be skills, all of fe values will be element of Be skills array
    const newJob = convertFe2BeJob(values);
    axios
      .post(`${url}/api/job/post`, newJob, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(() => {
        toast.success("Job posted successfully");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Job posting failed");
      });
  };

  return (
    <Container>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          postNewJob(values);
        }}
      >
        {(formik) => (
          <MKBox
            mx="auto"
            mt={3}
            display="flex"
            flexDirection="column"
            gap={2}
            bgColor="white"
            pt={3}
            pb={7}
            px={5}
            sx={{ borderRadius: "20px", width: "70%" }}
          >
            <MKTypography variant="h3" mt={1.5} mb={3} align="center">
              Add a new job vacancy
            </MKTypography>
            <MKInput
              label="Title"
              value={formik.values.title}
              onChange={(e) => formik.setFieldValue("title", e.target.value)}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
            />
            <MKInput
              label="Description"
              value={formik.values.description}
              onChange={(e) => formik.setFieldValue("description", e.target.value)}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
              multiline
              rows={4}
            />
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <MKInput
                  fullWidth
                  label="Min Year Experience"
                  type="number"
                  value={formik.values.minYearExperience}
                  onChange={(e) => formik.setFieldValue("minYearExperience", e.target.value)}
                  error={
                    formik.touched.minYearExperience && Boolean(formik.errors.minYearExperience)
                  }
                  helperText={formik.touched.minYearExperience && formik.errors.minYearExperience}
                />
              </Grid>
              <Grid item xs={4}>
                <Autocomplete
                  fullWidth
                  autoHighlight
                  autoSelect
                  autoComplete
                  disableClearable
                  options={cities}
                  onChange={(_, value) => {
                    value
                      ? formik.setFieldValue("location", value)
                      : formik.setFieldValue("location", "");
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Location (City or Regency)"
                      variant="outlined"
                      fullWidth
                      value={formik.values.location}
                      error={formik.touched.location && Boolean(formik.errors.location)}
                      helperText={formik.touched.location && formik.errors.location}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth required>
                  <InputLabel id="majors">Majors</InputLabel>
                  <Select
                    multiple
                    labelId="majors"
                    label="Majors"
                    name="majors"
                    onChange={(event) => {
                      formik.setFieldValue("majors", event.target.value);
                    }}
                    value={formik.values.majors}
                    renderValue={(selected) => {
                      return `${selected.length} majors selected`;
                    }}
                  >
                    {majors.map((major) => (
                      <MenuItem key={major} value={major}>
                        <Box display="flex" alignItems="center">
                          <Checkbox checked={formik.values.majors.indexOf(major) > -1} />
                          <ListItemText primary={major} />
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={5}>
                <MKInput
                  fullWidth
                  label="Min Salary"
                  type="number"
                  value={formik.values.minSalary}
                  onChange={(e) => formik.setFieldValue("minSalary", e.target.value)}
                  error={formik.touched.minSalary && Boolean(formik.errors.minSalary)}
                  helperText={formik.touched.minSalary && formik.errors.minSalary}
                  inputProps={{ step: 100000, min: 100000 }}
                />
              </Grid>
              <Grid item xs={5}>
                <MKInput
                  fullWidth
                  label="Max Salary"
                  type="number"
                  value={formik.values.maxSalary}
                  onChange={(e) => formik.setFieldValue("maxSalary", e.target.value)}
                  error={formik.touched.maxSalary && Boolean(formik.errors.maxSalary)}
                  helperText={formik.touched.maxSalary && formik.errors.maxSalary}
                  inputProps={{ step: 100000, min: formik.values.minSalary || 100000 }}
                />
              </Grid>
              <Grid item xs={2} alignSelf="center">
                <MKTypography variant="body2">per month</MKTypography>
              </Grid>
            </Grid>
            <RadioInput
              title="Type"
              options={types}
              selected={formik.values.type}
              setSelected={(value) => formik.setFieldValue("type", value)}
              error={formik.touched.type && Boolean(formik.errors.type)}
              helperText={formik.touched.type && formik.errors.type}
            />
            <RadioInput
              title="Mode"
              options={modes}
              selected={formik.values.mode}
              setSelected={(value) => formik.setFieldValue("mode", value)}
              error={formik.touched.mode && Boolean(formik.errors.mode)}
              helperText={formik.touched.mode && formik.errors.mode}
            />
            <RadioInput
              title="Experience Level"
              options={experienceLevels}
              selected={formik.values.experienceLevel}
              setSelected={(value) => formik.setFieldValue("experienceLevel", value)}
              error={formik.touched.experienceLevel && Boolean(formik.errors.experienceLevel)}
              helperText={formik.touched.experienceLevel && formik.errors.experienceLevel}
            />
            {/* addableForm for requirements, responsibilities, and advantages */}
            <AddableForm formik={formik} name="requirements" label="Requirement" />
            <AddableForm formik={formik} name="responsibilities" label="Responsibility" />
            <AddableForm formik={formik} name="advantages" label="Advantage" />
            {/* Additional info multiple line input */}
            <MKInput
              label="Additional Information"
              value={formik.values.additionalInfo}
              onChange={(e) => formik.setFieldValue("additionalInfo", e.target.value)}
              error={formik.touched.additionalInfo && Boolean(formik.errors.additionalInfo)}
              helperText={formik.touched.additionalInfo && formik.errors.additionalInfo}
              multiline
              rows={4}
            />
            <MKButton
              variant="contained"
              color="primary"
              onClick={formik.handleSubmit}
              sx={{ width: "50%", alignSelf: "center", mt: 2 }}
            >
              Submit
            </MKButton>
          </MKBox>
        )}
      </Formik>
    </Container>
  );
}

export default AddJob;

// props
