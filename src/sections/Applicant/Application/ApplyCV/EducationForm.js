import React, { useState, useEffect } from "react";
import propTypes from "prop-types";
import MKBox from "components/MKBox";
import MKInput from "components/MKInput";
import MKButton from "components/MKButton";
import MKTypography from "components/MKTypography";
import { IconButton } from "@mui/material";
import { Add as AddIcon, Remove as RemoveIcon, Edit as EditIcon } from "@mui/icons-material";

const EducationFrom = (props) => {
  const { data, setData, onEditIndex, setOnEditIndex, onEdit } = props;
  const [currentItem, setCurrentItem] = useState({
    major: "",
    campus: "",
    GPA: "",
  });

  useEffect(() => {
    console.log("onEdit", onEdit);
  }, [onEdit]);

  return (
    <MKBox>
      <MKTypography variant="body2" gutterBottom sx={{ fontWeight: "bold" }}>
        Educations
      </MKTypography>
      <MKBox display="flex" flexDirection="column" width="100%" gap={1}>
        {data.map((item, index) => (
          <MKBox key={index} display="flex" flexDirection="column" pl={1}>
            <MKTypography variant="body2" gutterBottom>
              <li>{`Education ${index + 1}`}</li>
            </MKTypography>
            <MKBox display="flex" flexDirection="row" pl={2.5} width="100%" gap={1} pb={1}>
              <MKBox display="flex" flexDirection="column" gap={1} flexGrow={1}>
                <MKBox display="flex" flexDirection="row" width="100%" gap={3} alignItems="center">
                  {/* Education Desc */}
                  <MKBox display="flex" flexDirection="column" gap={1} flexGrow={1}>
                    {/* Major */}
                    <MKInput
                      fullWidth
                      disabled={!onEditIndex.includes(index)}
                      label="Major"
                      value={onEditIndex.includes(index) ? currentItem.major : item.major}
                      onChange={(e) => {
                        setCurrentItem({ ...currentItem, major: e.target.value });
                      }}
                    />
                    {/* Campus */}
                    <MKInput
                      fullWidth
                      disabled={!onEditIndex.includes(index)}
                      label="Campus"
                      value={onEditIndex.includes(index) ? currentItem.campus : item.campus}
                      onChange={(e) => {
                        setCurrentItem({ ...currentItem, campus: e.target.value });
                      }}
                    />
                  </MKBox>
                  {/* GPA */}
                  {/* Start Date */}
                  <MKBox display="flex" flexDirection="row" gap={1} width="28%">
                    <MKTypography
                      variant="body2"
                      sx={{
                        fontSize: "12px",
                        width: "55px",
                        fontWeight: "bold",
                        color: "grey",
                      }}
                    >
                      GPA
                    </MKTypography>
                    <MKInput
                      type="number"
                      placeholder="GPA in 4.00 scale"
                      inputProps={{ step: "0.01", min: "1.00", max: "4.00" }}
                      disabled={!onEditIndex.includes(index)}
                      sx={{ flexGrow: 1 }}
                      value={onEditIndex.includes(index) ? currentItem.GPA : item.GPA}
                      onChange={(e) => {
                        setCurrentItem({ ...currentItem, GPA: e.target.value });
                      }}
                    />
                  </MKBox>
                </MKBox>
              </MKBox>
              <IconButton
                color={onEditIndex.includes(index) ? "success" : "info"}
                disabled={
                  !onEdit || (onEdit && onEditIndex.length > 0 && !onEditIndex.includes(index))
                }
                onClick={() => {
                  // to edit
                  if (!onEditIndex.includes(index)) {
                    setCurrentItem(item);
                    setOnEditIndex([...onEditIndex, index]);
                  } else {
                    // to save
                    const newData = [...data];
                    newData[index] = currentItem;
                    setData(newData);
                    setOnEditIndex(onEditIndex.filter((i) => i !== index));
                  }
                }}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                disabled={!onEdit || (onEdit && onEditIndex.includes(index))}
                color="error"
                onClick={() => {
                  const newData = data.filter((_, i) => i !== index);
                  setData(newData);
                }}
              >
                <RemoveIcon />
              </IconButton>
            </MKBox>
          </MKBox>
        ))}
        <MKButton
          onClick={() => {
            setData([...data, { major: "", campus: "", GPA: "" }]);
          }}
          startIcon={<AddIcon />}
          disabled={!onEdit}
        >
          Add Education
        </MKButton>
      </MKBox>
    </MKBox>
  );
};

EducationFrom.propTypes = {
  data: propTypes.array,
  setData: propTypes.func,
  onEditIndex: propTypes.array,
  setOnEditIndex: propTypes.func,
  onEdit: propTypes.bool,
};

export default EducationFrom;
