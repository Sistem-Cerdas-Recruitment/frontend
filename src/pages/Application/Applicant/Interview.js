import axios from "axios";
import { useState, useEffect } from "react";
import propTypes from "prop-types";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Container, SvgIcon, TextField, IconButton } from "@mui/material";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

import { CpuChipIcon, UserCircleIcon, ArrowUpCircleIcon } from "@heroicons/react/24/solid";
import SpinningBar from "atoms/SpinningBar";

const Interview = () => {
  // eslint-disable-next-line no-undef
  const url = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { id: applicationId } = useParams();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("ON_GOING");
  const [history, setHistory] = useState([]); // [ { question: "", answer: "" }
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [backspaceCounter, setBackspaceCounter] = useState(0);
  const [keyCounter, setKeyCounter] = useState({});
  const [nPressed, setNPressed] = useState(0);

  const answerQuestion = () => {
    if (answer.trim() === "") {
      return;
    }
    setLoading(true);
    const newKeyCounter = fillCounter();
    const postData = {
      job_application_id: applicationId,
      chat: {
        question,
        answer,
        backspace_count: backspaceCounter,
        letter_click_counts: newKeyCounter,
      },
    };
    history[history.length - 1].answer = answer;
    setAnswer("");
    setNPressed(0);
    setKeyCounter({});
    setBackspaceCounter(0);
    localStorage.removeItem("keyCounter");
    localStorage.removeItem("backspaceCounter");

    axios
      .patch(`${url}/api/interview/answer`, postData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res.data.status === "COMPLETED") {
          navigate(`/application/${applicationId}/result`);
        } else {
          const newQuestion = res.data.response;
          history.push({ question: newQuestion, answer: null });
          setQuestion(newQuestion);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      answerQuestion();
    } else if (event.key === "Backspace") {
      setBackspaceCounter(backspaceCounter + 1);
    } else {
      const key = event.key.toLowerCase();
      if (key.length === 1 && key >= "a" && key <= "z") {
        setKeyCounter((prevCounts) => ({
          ...prevCounts,
          [key]: (prevCounts[key] || 0) + 1,
        }));
      }
    }
    setNPressed(nPressed + 1);
  };

  function fillCounter() {
    const newKeyCounter = { ...keyCounter };
    for (let i = 97; i < 123; i++) {
      const key = String.fromCharCode(i);
      newKeyCounter[key] = newKeyCounter[key] || 0;
    }
    return newKeyCounter;
  }

  function initCounter() {
    if (!localStorage.getItem("keyCounter")) {
      const defaultKeyCounter = {};
      for (let i = 97; i < 123; i++) {
        defaultKeyCounter[String.fromCharCode(i)] = 0;
      }
      localStorage.setItem("keyCounter", JSON.stringify(defaultKeyCounter));
    }
    setKeyCounter(JSON.parse(localStorage.getItem("keyCounter")));

    if (!localStorage.getItem("backspaceCounter")) {
      localStorage.setItem("backspaceCounter", 0);
    }
    setBackspaceCounter(parseInt(localStorage.getItem("backspaceCounter")));
  }

  // get the last key counter from local storage
  useEffect(() => {
    initCounter();
  }, []);

  // update the key counter in local storage after 10 key presses
  useEffect(() => {
    if (nPressed % 10 === 0) {
      localStorage.setItem("keyCounter", JSON.stringify(keyCounter));
      localStorage.setItem("backspaceCounter", backspaceCounter);
    }
    console.log("storage keyCounter", localStorage.getItem("keyCounter"));
    console.log("storage backspaceCounter", localStorage.getItem("backspaceCounter"));
  }, [nPressed]);

  // fetch last interview chat logs
  useEffect(() => {
    axios
      .get(`${url}/api/interview/get/${applicationId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        const simpleHistory = res.data.chat_logs.map((item) => ({
          question: item.question,
          answer: item.answer,
        }));
        setHistory(simpleHistory);
        setQuestion(simpleHistory[simpleHistory.length - 1].question);
        setStatus(res.data.status);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

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
          >
            {/* History section */}
            {history.map((item, index) => (
              <MKBox key={index} display="flex" flexDirection="column" gap={3} mb={3} px={5}>
                <MKBox display="flex" flexDirection="row" justifyContent="flex-start" gap={2}>
                  <SvgIcon component={CpuChipIcon} sx={{ height: 30, width: 30 }} />
                  <MKBox maxWidth="85%">
                    <MKTypography variant="body2" sx={{ fontWeight: 500 }}>
                      {item.question}
                    </MKTypography>
                  </MKBox>
                </MKBox>
                {item.answer && (
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
                )}
              </MKBox>
            ))}
            {/* spinning bar if isLoading */}
            {loading && (
              <MKBox display="flex" justifyContent="center" alignItems="center">
                <SpinningBar size={50} />
              </MKBox>
            )}
            {/* Input section */}
            <MKBox
              display="flex"
              flexDirection="row"
              alignItems="center"
              gap={0}
              mt={5}
              pl={5}
              pr={1.5}
            >
              <TextField
                label="Answer"
                multiline
                rows={5}
                fullWidth
                placeholder="Type your answer here"
                variant="outlined"
                value={answer}
                onKeyDown={handleKeyPress}
                onChange={(e) => setAnswer(e.target.value)}
              />
              <IconButton onClick={answerQuestion}>
                <SvgIcon
                  // component={ChevronDoubleUpIcon}
                  // sx={{ height: 30, width: 30 }}
                  component={ArrowUpCircleIcon}
                  sx={{ height: 40, width: 40 }}
                  color="black"
                />
              </IconButton>
            </MKBox>
          </MKBox>
          <MKBox display="flex" justifyContent="center" mt={5} />
        </MKBox>
      </MKBox>
    </Container>
  );
};

Interview.propTypes = {
  applicationId: propTypes.string,
};

export default Interview;
