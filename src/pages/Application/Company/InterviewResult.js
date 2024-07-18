import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Container, SvgIcon, Stack, Slider } from "@mui/material";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

import { CpuChipIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { Person, SmartToy } from "@mui/icons-material";

const InterviewResult = () => {
  // eslint-disable-next-line no-undef
  const url = process.env.REACT_APP_API_URL;
  const { pathname, state } = useLocation();
  const { id: applicationId } = useParams();
  const [history, setHistory] = useState([]);

  // scroll to bottom when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    console.log();
  }, [pathname]);

  // fetch last interview chat logs
  useEffect(() => {
    axios
      .get(`${url}/api/interview/get/${applicationId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setHistory(res.data.chat_logs);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const checkIf25words = (text) => {
    if (!text) return false;
    return text.split(" ").length <= 25;
  };

  return (
    <Container>
      <MKBox>
        <MKBox minHeight="calc(100vh - 95px)" mt={3}>
          <MKBox
            bgColor="#FAFAFF"
            display="flex"
            flexDirection="column"
            py={4}
            borderRadius={15}
            width="75%"
            mx="auto"
            gap={3}
          >
            {/* Title Section */}
            <MKBox display="flex" flexDirection="column" sx={{ position: "relative" }} py={2}>
              <MKTypography variant="h3" sx={{ position: "absolute", top: 10, right: 50 }}>
                {state.score !== null ? (state.score != 0 ? state.score.toFixed(2) : "0.00") : "NA"}{" "}
                / 100
              </MKTypography>
              <MKTypography variant="h3" mb={3} align="center">
                Interview Result
              </MKTypography>
              {!state.score && (
                <MKTypography variant="h6" sx={{ fontWeight: 500, color: "grey" }} align="center">
                  This interview is on evaluation process <br /> Please wait for within 24 hours to
                  view score and anti cheat detection result
                </MKTypography>
              )}
            </MKBox>
            {/* History section */}
            {history.map((item, index) => (
              <MKBox
                key={index}
                display="flex"
                flexDirection="column"
                gap={3}
                pb={3}
                px={5}
                sx={{ borderBottom: "1px solid #000" }}
              >
                <MKBox display="flex" flexDirection="row" justifyContent="flex-start" gap={2}>
                  <SvgIcon component={CpuChipIcon} sx={{ height: 30, width: 30 }} />
                  <MKBox maxWidth="85%">
                    <MKTypography variant="body2" sx={{ fontWeight: 500 }}>
                      {item.question}
                    </MKTypography>
                  </MKBox>
                </MKBox>
                <MKBox display="flex" flexDirection="row" justifyContent="flex-end" gap={2}>
                  <MKBox
                    borderRadius={10}
                    py={2.2}
                    px={3}
                    maxWidth="85%"
                    border="3px solid #f2f2f2"
                    sx={{ backgroundColor: "#f7f7f7" }}
                  >
                    <MKTypography variant="body2" sx={{ fontWeight: 400 }}>
                      {item.answer}
                    </MKTypography>
                  </MKBox>
                  <SvgIcon component={UserCircleIcon} sx={{ height: 30, width: 30 }} />
                </MKBox>
                <MKBox
                  display="flex"
                  flexDirection="column"
                  justifyContent="flex-start"
                  gap={1}
                  pl={11}
                >
                  <MKTypography variant="h6">Anti Cheat Detection Result</MKTypography>
                  <MKTypography variant="body2">
                    This answer is made by{" "}
                    <span style={{ fontWeight: 600 }}>
                      {item.predicted_class || "No prediction"}
                    </span>{" "}
                    with{" "}
                    <span style={{ fontWeight: 600 }}>{item.confidence || "No confidence"}</span>{" "}
                  </MKTypography>
                  <MKBox
                    display="flex"
                    flexDirection="row"
                    justifyContent="space-between"
                    gap={2}
                    width="100%"
                  >
                    <Stack direction="column" flexGrow={1}>
                      <MKTypography variant="body2">Probability value,</MKTypography>
                      <Stack spacing={1} direction="row" alignItems="center" width="100%">
                        <Stack direction="column" width="max-width">
                          <MKTypography variant="body2">Main model:</MKTypography>
                          <MKTypography variant="body2">Second Model:</MKTypography>
                        </Stack>
                        <Stack direction="column" flexGrow={1} maxWidth="215px">
                          {item.main_model_probability ? (
                            <Stack spacing={1} direction="row" alignItems="center">
                              <Person />
                              <Slider
                                disabled
                                value={eval(item.main_model_probability)}
                                valueLabelDisplay="auto"
                                min={0}
                                max={1}
                              />
                              <SmartToy />
                            </Stack>
                          ) : (
                            <MKTypography variant="body2">No prediction</MKTypography>
                          )}
                          {item.secondary_model_prediction ? (
                            <Stack spacing={1} direction="row" alignItems="center">
                              <Person />
                              <Slider
                                disabled
                                value={Number(item.secondary_model_prediction)}
                                valueLabelDisplay="auto"
                                min={0}
                                max={1}
                              />
                              <SmartToy />
                            </Stack>
                          ) : (
                            <MKTypography variant="body2">No prediction</MKTypography>
                          )}
                        </Stack>
                      </Stack>
                    </Stack>
                    {checkIf25words(item.answer) && (
                      <MKTypography
                        variant="caption"
                        width="300px"
                        sx={{ whiteSpace: "pre-wrap", alignSelf: "center" }}
                        pt={1}
                      >
                        Disclaimer: This answer is{" "}
                        <span style={{ color: "red" }}> less than 25 words</span> Therefore, the
                        anti cheat detection result may not be accurate due to the lack of data
                        training.
                      </MKTypography>
                    )}
                  </MKBox>
                </MKBox>
              </MKBox>
            ))}
          </MKBox>
          <MKBox display="flex" justifyContent="center" mt={5} />
        </MKBox>
      </MKBox>
    </Container>
  );
};

export default InterviewResult;
