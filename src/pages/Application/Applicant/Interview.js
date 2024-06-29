import axios from "axios";
import { useState, useEffect } from "react";
import propTypes from "prop-types";
import { useNavigate, useParams } from "react-router-dom";
import { Container, SvgIcon, TextField, IconButton } from "@mui/material";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import { toast } from "react-toastify";
import { CpuChipIcon, UserCircleIcon, ArrowUpCircleIcon } from "@heroicons/react/24/solid";
import SpinningBar from "atoms/SpinningBar";

const Interview = () => {
  // eslint-disable-next-line no-undef
  const url = process.env.REACT_APP_API_URL;
  // eslint-disable-next-line no-undef
  const onDevelopment = process.env.REACT_APP_ONDEV === "true";
  const navigate = useNavigate();
  const { id: applicationId } = useParams();
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]); // [ { question: "", answer: "" }
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [backspaceCounter, setBackspaceCounter] = useState(0);
  const [keyCounter, setKeyCounter] = useState({});
  const [nPressed, setNPressed] = useState(0);

  const preventEvent = (e) => {
    console.log("onDevelopment", onDevelopment);
    if (onDevelopment) return;
    e.preventDefault();
  };

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
          navigate(`/applicant/history`);
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

  // prevent the user from leaving the page, using special keys, or switching tabs during the interview
  useEffect(() => {
    console.log("onDevelopment", onDevelopment);
    if (onDevelopment) return;
    const handleVisibilityChange = () => {
      if (document.hidden) {
        showToast("error", "Suspicous activity detected.");
      }
    };
    const handleBlur = () => {
      showToast("error", "Suspicous activity detected.");
    };
    const handleFocus = () => {
      toast.dismiss();
    };
    const handleMouseLeave = () => {
      showToast("error", "Suspicous activity detected.");
    };
    const handleKeyDown = (e) => {
      const isAlphanumeric = e.key.length === 1 && e.key.match(/[a-z0-9]/i);
      const availableKeys = [
        // eslint-disable-next-line prettier/prettier
        "!",
        "@",
        "#",
        "$",
        "%",
        "^",
        "&",
        "*",
        "(",
        ")",
        "_",
        "+",
        "-",
        "=",
        "[",
        "]",
        // eslint-disable-next-line prettier/prettier
        "{",
        "}",
        "\\",
        "|",
        ";",
        ":",
        "'",
        '"',
        ",",
        ".",
        "/",
        "<",
        ">",
        "?",
        "`",
        "~",
        // eslint-disable-next-line prettier/prettier
        "Control",
        "Alt",
        "Shift",
        "Enter",
        "Backspace",
        "Delete",
        "Home",
        "End",
        // eslint-disable-next-line prettier/prettier
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "CapsLock",
        "Tab",
        " ",
      ];
      if (isAlphanumeric || availableKeys.includes(e.key)) return;
      e.preventDefault();
      showToast("warn", "Forbidden key pressed.");
    };

    const showToast = (type, message) => {
      toast[type](message || "You are not allowed to perform this action.", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "colored",
      });
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

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
                    <MKTypography variant="body2" sx={{ fontWeight: 500 }} onCopy={preventEvent}>
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
                      <MKTypography variant="body2" sx={{ fontWeight: 400 }} onCopy={preventEvent}>
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
                <SpinningBar />
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
                onPaste={preventEvent}
                onKeyDown={handleKeyPress}
                onChange={(e) => setAnswer(e.target.value)}
              />
              <IconButton onClick={() => console.log("onDev", onDevelopment)}>
                <SvgIcon
                  // component={ChevronDoubleUpIcon}
                  // sx={{ height: 30, width: 30 }}
                  component={ArrowUpCircleIcon}
                  sx={{ height: 40, width: 40 }}
                  color="black"
                />
              </IconButton>
            </MKBox>
            {/* Disclaimer that enter are use to send, and shift + enter are use to new line */}
            <MKBox display="flex" justifyContent="flex-start" pt={1} pl={6}>
              <MKTypography variant="caption" color="grey" sx={{ fontWeight: 500 }}>
                Press Enter to send, Shift + Enter for new line
              </MKTypography>
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
