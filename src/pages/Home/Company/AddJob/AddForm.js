/* eslint-disable react/prop-types */
// AddableForm.js
import React from "react";
import { FieldArray } from "formik";
import { IconButton } from "@mui/material";
import { Add as AddIcon, Remove as RemoveIcon } from "@mui/icons-material";
import MKBox from "components/MKBox";
import MKInput from "components/MKInput";
import MKButton from "components/MKButton";
import MKTypography from "components/MKTypography";

const AddableForm = (props) => {
  const { formik, name, label } = props;
  const required = ["requirements"];
  return (
    <FieldArray name={name}>
      {({ push, remove }) => (
        <MKBox display="flex" flexDirection="column" justifyContent="center">
          <MKTypography variant="body2" gutterBottom sx={{ fontWeight: "bold" }}>
            {name.charAt(0).toUpperCase() + name.slice(1)}
          </MKTypography>
          {formik.values[name].map((item, index) => (
            <MKBox key={index} mb={2} display="flex">
              <MKInput
                fullWidth
                id={`${name}.${index}`}
                name={`${name}.${index}`}
                label={`${label} ${index + 1}`}
                variant="outlined"
                value={item}
                onChange={formik.handleChange}
                error={
                  formik.touched[name] &&
                  formik.touched[name][index] &&
                  Boolean(formik.errors[name] && formik.errors[name][index])
                }
                helperText={
                  formik.touched[name] &&
                  formik.touched[name][index] &&
                  formik.errors[name] &&
                  formik.errors[name][index]
                }
              />
              <IconButton
                aria-label="remove"
                onClick={() => remove(index)}
                disabled={formik.values[name].length === 1 && required.includes(name)}
              >
                <RemoveIcon />
              </IconButton>
            </MKBox>
          ))}
          <MKButton
            variant="text"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => push("")}
            sx={{ alignSelf: "flex-end", width: "fit-content" }}
          >
            Add {label}
          </MKButton>
        </MKBox>
      )}
    </FieldArray>
  );
};

export default AddableForm;
