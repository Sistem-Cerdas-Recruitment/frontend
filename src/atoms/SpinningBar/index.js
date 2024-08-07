import propsTypes from "prop-types";
import { keyframes } from "@emotion/react";
import { SvgIcon } from "@mui/material";
import { ArrowPathIcon } from "@heroicons/react/24/solid";
const SpinningBar = (props) => {
  const { size, color } = props;

  const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
  `;

  return (
    <SvgIcon
      component={ArrowPathIcon}
      py={3}
      sx={{
        width: size,
        height: size,
        color: color,
        animation: `${spin} 3s linear infinite`,
      }}
    />
  );
};

SpinningBar.propTypes = {
  size: propsTypes.number,
  color: propsTypes.string,
};

SpinningBar.defaultProps = {
  size: 100,
  color: "grey",
};

export default SpinningBar;
