import { useEffect, useState } from "react";
import propsTypes from "prop-types";
import MKTypography from "components/MKTypography";

const RunningText = ({ isAnimated, isByWord, text, delay, ...others }) => {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    if (!isAnimated) {
      setDisplayText(text);
      return;
    }

    let interval;
    if (isByWord) {
      animateByWord(delay || 50);
    } else {
      animateByCharacter(delay || 14);
    }
    window.scrollTo(0, document.body.scrollHeight + 50);

    return () => clearInterval(interval);

    function animateByWord(wordDelay) {
      const words = text.split(" ");
      let currentWordIndex = 0;
      interval = setInterval(() => {
        if (currentWordIndex <= words.length) {
          setDisplayText(words.slice(0, currentWordIndex).join(" "));
          currentWordIndex++;
        } else {
          clearInterval(interval);
        }
      }, wordDelay);
    }

    function animateByCharacter(charDelay) {
      let currentCharIndex = 0;
      interval = setInterval(() => {
        if (currentCharIndex <= text.length) {
          setDisplayText(text.slice(0, currentCharIndex));
          currentCharIndex++;
        } else {
          clearInterval(interval);
        }
      }, charDelay);
    }
  }, [text, delay]);

  return <MKTypography {...others}>{displayText}</MKTypography>;
};

RunningText.propTypes = {
  isAnimated: propsTypes.bool,
  isByWord: propsTypes.bool,
  text: propsTypes.string.isRequired,
  delay: propsTypes.number,
  others: propsTypes.object,
};

RunningText.defaultProps = {
  isAnimated: true,
  isByWord: false,
};

export default RunningText;
