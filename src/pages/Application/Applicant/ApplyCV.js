import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";

import { Container, Input, Stack } from "@mui/material";
import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import MKInput from "components/MKInput";
import MKTypography from "components/MKTypography";

import { useFormik } from "formik";
import * as Yup from "yup";

import { convertFullDateString } from "utils/functions";
import { toast } from "react-toastify";

import AddableForm from "atoms/AddableForm";
import SpinningBar from "atoms/SpinningBar";

const ApplyCV = () => {
  // eslint-disable-next-line no-undef
  const url = process.env.REACT_APP_API_URL;
  const { id: jobId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { job } = location.state || {};
  const inputRef = useRef();

  const [recentCV, setRecentCV] = useState([]);
  const [selectedCVId, setSelectedCVId] = useState(null);
  const [onExtract, setOnExtract] = useState(true);
  const [onEdit, setOnEdit] = useState(true);
  const [onEditIndex, setOnEditIndex] = useState([]);

  const [skills, setSkills] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [educations, setEducations] = useState([]);
  const formik = useFormik({
    initialValues: {
      name: localStorage.getItem("name"),
      email: localStorage.getItem("email"),
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string().email("Invalid email address").required("Email is required"),
    }),
    onSubmit: () => {
      const experience = {
        educations: educations,
        experiences: experiences,
        skills: skills,
      };
      const data = {
        job_id: jobId,
        cv_id: selectedCVId,
        experience: experience,
      };
      axios
        .post(`${url}/api/job/apply`, data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          toast.success("Application submitted successfully");
          // go to history page
          console.log(res);
        })
        .catch((error) => {
          toast.error("Failed to submit application");
          console.log(error);
        });
    },
  });

  const selectCV = (id) => {
    if (selectedCVId === id) return;
    setOnEdit(true);
    setOnExtract(true);
    setSelectedCVId(id);
    axios
      .post(
        `${url}/api/file/cv/extract`,
        {
          id: id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        setExperiences(
          res.data.experiences.map((e) => ({
            ...e,
            description: e.experience_description,
            position: e.designation,
          }))
        );
        setEducations(res.data.educations.map((e) => ({ GPA: e.GPA, major: e.major })));
        setSkills(res.data.skills);
        setOnExtract(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getRecentCVs = (newId) => {
    axios
      .get(`${url}/api/file/cv/get`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setRecentCV(res.data.files);
        newId ? selectCV(newId) : selectCV(res.data.files[0].id);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const uploadCV = (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    axios
      .post(`${url}/api/file/cv/upload`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        getRecentCVs(res.data.id);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const viewCV = (id) => {
    axios
      .get(`${url}/api/file/cv/get/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        window.open(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getRecentCVs();
  }, []);

  return (
    <Container>
      {!job.applied ? (
        <MKBox width="85%" mx="auto" mt={3} display="flex" flexDirection="column" gap={3}>
          {/* job short detail */}
          <MKBox
            display="flex"
            alignItems="center"
            gap={3}
            bgColor="white"
            px={3.75}
            pt={3.5}
            pb={4}
            sx={{ borderRadius: "20px" }}
          >
            {job.img ? (
              <img
                src={job.img}
                alt="company"
                style={{ width: "150px", height: "150px", borderRadius: "20px" }}
              />
            ) : (
              <MKBox
                sx={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "20px",
                  backgroundColor: "#f0f0f0",
                }}
              />
            )}
            <MKBox display="flex" flexDirection="column" gap={0.5}>
              <MKTypography variant="body2" sx={{ color: "grey" }} mb={0.5}>
                Apply to
              </MKTypography>
              <MKTypography variant="h3">{job.title}</MKTypography>
              <MKTypography variant="body2">{job.company}</MKTypography>
              <MKTypography variant="body2" sx={{ fontWeight: "bold" }}>
                {job.location}
              </MKTypography>
            </MKBox>
          </MKBox>
          {/* upload CV button with 3 button of recent CV */}
          <MKBox
            display="flex"
            flexDirection="column"
            gap={2}
            bgColor="white"
            pl={4.5}
            pr={2}
            pt={3}
            pb={4}
            sx={{ borderRadius: "20px" }}
          >
            <Input
              type="file"
              accept=".pdf"
              inputRef={inputRef}
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files[0];
                uploadCV(file);
              }}
            />
            <MKTypography variant="body1" sx={{ color: "black" }}>
              Use recent CV or upload new CV
              <br />
              <span style={{ color: "grey", fontSize: "15px" }}>
                (default CV automatically chosen while page load, you can choose another recent CV
                or upload new)
              </span>
            </MKTypography>
            <Stack spacing={2}>
              {recentCV.map((cv, index) => (
                <MKBox key={index}>
                  <MKBox display="flex" gap={1}>
                    <MKButton
                      key={index}
                      variant="outlined"
                      color="info"
                      sx={{ gap: 2, width: "83%" }}
                      onClick={() => selectCV(cv.id)}
                      disabled={onExtract}
                    >
                      {/* Red box with full height and full width consist white Typografy "PDF" */}
                      <MKBox
                        sx={{
                          padding: "5px",
                          borderRadius: "5px",
                          backgroundColor: cv.id === selectedCVId ? "green" : "red",
                          height: "100%",
                        }}
                      >
                        <MKTypography variant="body2" color="white">
                          PDF
                        </MKTypography>
                      </MKBox>
                      <MKBox
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{ width: "100%" }}
                      >
                        <MKBox
                          display="flex"
                          alignItems="flex-start"
                          gap={0.5}
                          flexDirection="column"
                        >
                          <MKTypography variant="body2" sx={{ fontWeight: "bold" }}>
                            {cv.fileName}
                          </MKTypography>
                          <MKTypography variant="body2">
                            Uploaded at {convertFullDateString(cv.uploadDate)}
                          </MKTypography>
                        </MKBox>
                        {cv.id === selectedCVId && (
                          <MKTypography variant="body2" sx={{ color: "green" }}>
                            Selected
                          </MKTypography>
                        )}
                      </MKBox>
                    </MKButton>
                    <MKButton
                      variant="text"
                      color="info"
                      size="large"
                      sx={{ width: "17%" }}
                      onClick={() => viewCV(cv.id)}
                    >
                      {index === 0 ? "View Default" : `View`}
                    </MKButton>
                  </MKBox>
                </MKBox>
              ))}
            </Stack>
            <MKBox display="flex" mt={3} justifyContent="flex-end" mr={2}>
              <MKButton
                variant="contained"
                color="primary"
                onClick={() => {
                  inputRef.current.click();
                }}
                size="large"
              >
                Upload New CV
              </MKButton>
            </MKBox>
          </MKBox>
          {/* user profile Checking */}
          <MKBox bgColor="white" px={4.5} pt={3} pb={4} sx={{ borderRadius: "20px" }}>
            {!onExtract ? (
              <MKBox display="flex" flexDirection="column" gap={2}>
                <MKTypography variant="body1" sx={{ color: "black", fontWeight: "bold" }}>
                  Profile Checking
                </MKTypography>
                <MKBox display="flex" flexDirection="row" gap={2} width="80%" pl={2}>
                  <MKInput
                    label="Full Name"
                    variant="outlined"
                    sx={{ width: "50%" }}
                    type="text"
                    disabled
                    {...formik.getFieldProps("name")}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                  />
                  {/* email only show and cannot be change */}
                  <MKInput
                    label="Email"
                    variant="outlined"
                    {...formik.getFieldProps("email")}
                    sx={{ width: "50%" }}
                    disabled
                  />
                </MKBox>
                <MKBox display="flex" flexDirection="column" gap={0}>
                  <MKTypography style={{ color: "grey", fontSize: "15px" }}>
                    (Please add experiences start date and end date)
                  </MKTypography>
                  <AddableForm
                    data={experiences}
                    setData={setExperiences}
                    label="Experience"
                    name="experiences"
                    onEdit={onEdit}
                    onEditIndex={onEditIndex}
                    setOnEditIndex={setOnEditIndex}
                  />
                  <MKTypography style={{ color: "grey", fontSize: "14.2px", padding: "0 30px" }}>
                    {onEdit
                      ? "(Please save each experience before confirm edit)"
                      : "(Please edit to add or remove experience)"}
                  </MKTypography>
                </MKBox>
                <MKBox display="flex" justifyContent="flex-start" mr={2} gap={2}>
                  <MKButton
                    variant="text"
                    color="info"
                    size="large"
                    sx={{ width: "17%" }}
                    disabled={onEdit}
                    onClick={() => setOnEdit(true)}
                  >
                    Edit Data
                  </MKButton>
                  <MKButton
                    variant="text"
                    color="success"
                    size="large"
                    sx={{ width: "20%" }}
                    disabled={!onEdit || (onEdit && onEditIndex.length > 0)}
                    onClick={() => setOnEdit(false)}
                  >
                    Confirm Edit
                  </MKButton>
                </MKBox>
              </MKBox>
            ) : (
              <MKBox display="flex" flexDirection="column" gap={2} alignItems="center">
                <MKTypography variant="body1" sx={{ color: "black", fontWeight: "bold" }}>
                  Extracting your CV data
                </MKTypography>
                <MKTypography variant="body2" sx={{ color: "grey" }}>
                  Please wait while we extract your CV data
                </MKTypography>
                <SpinningBar size={100} />
              </MKBox>
            )}
          </MKBox>
          {/* submit button */}
          <MKBox
            display={onExtract ? "none" : "flex"}
            mt={2}
            alignItems="center"
            mr={2}
            flexDirection="column"
            gap={2}
          >
            {onEdit ? (
              <MKTypography variant="body2" color="error">
                Finish editing your profile before submitting
              </MKTypography>
            ) : (
              <MKTypography variant="body2" sx={{ color: "grey", textAlign: "center" }}>
                By clicking submit application, you agree to the terms and conditions
                <br />
                Make sure your information is correct before submitting
              </MKTypography>
            )}
            <MKButton
              variant="contained"
              color="primary"
              onClick={formik.handleSubmit}
              size="large"
              sx={{ width: "50%" }}
              disabled={onEdit || onExtract}
            >
              Submit Application
            </MKButton>
          </MKBox>
          <MKBox mb={20} />
        </MKBox>
      ) : (
        <MKBox
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={3}
          mx="auto"
          minHeight="92vh"
          pt={10}
        >
          <MKTypography variant="h3">You have applied to this job</MKTypography>
          <MKTypography variant="body1">
            Job vacancy only can be applied once. You can view your application status on your
            history page.
          </MKTypography>
          <MKBox display="flex" justifyContent="center" gap={10} mt={2}>
            {/* onclick go to history page */}
            <MKButton
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate("/applicant/history")}
            >
              Go to history page
            </MKButton>
            <MKButton variant="contained" color="info" size="large" onClick={() => navigate(-1)}>
              Aplly to another job
            </MKButton>
          </MKBox>
        </MKBox>
      )}
    </Container>
  );
};

export default ApplyCV;
