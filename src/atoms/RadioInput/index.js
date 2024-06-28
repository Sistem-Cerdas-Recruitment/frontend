import propTypes from "prop-types";
import { FormControl, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import MKTypography from "components/MKTypography";

const RadioInput = (props) => {
  const { title, options, selected, setSelected, error, helperText } = props;
  return (
    <FormControl component="fieldset">
      <MKTypography variant="body2" gutterBottom sx={{ fontWeight: "bold" }}>
        {title}
      </MKTypography>
      <RadioGroup
        aria-label="mode"
        name="mode"
        row
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
      >
        {options.map((option) => (
          <FormControlLabel
            key={option}
            value={option}
            control={<Radio />}
            label={<MKTypography variant="body2">{option}</MKTypography>}
          />
        ))}
      </RadioGroup>
      {error && (
        <MKTypography variant="caption" color="error" pl={2} sx={{ fontWeight: "bold" }}>
          {helperText}
        </MKTypography>
      )}
    </FormControl>
  );
};

export default RadioInput;

RadioInput.propTypes = {
  title: propTypes.string.isRequired,
  options: propTypes.arrayOf(propTypes.string).isRequired,
  selected: propTypes.string.isRequired,
  setSelected: propTypes.func.isRequired,
  error: propTypes.bool,
  helperText: propTypes.string,
};
