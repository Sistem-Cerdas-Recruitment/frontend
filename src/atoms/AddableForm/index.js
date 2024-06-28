import React, { useState, useEffect } from "react";
import propTypes from "prop-types";
import MKBox from "components/MKBox";
import MKInput from "components/MKInput";
import MKButton from "components/MKButton";
import MKTypography from "components/MKTypography";
import { IconButton } from "@mui/material";
import { Add as AddIcon, Remove as RemoveIcon, Edit as EditIcon } from "@mui/icons-material";

const AddableForm = (props) => {
  const { data, setData, label, name, onEditIndex, setOnEditIndex, onEdit } = props;
  const [currentItem, setCurrentItem] = useState({
    position: "",
    company: "",
    start: "",
    end: "",
    description: "",
  });

  useEffect(() => {
    console.log("onEdit", onEdit);
  }, [onEdit]);

  return (
    <MKBox>
      <MKTypography variant="body2" gutterBottom sx={{ fontWeight: "bold" }}>
        {name.charAt(0).toUpperCase() + name.slice(1)}
      </MKTypography>
      {data.map((item, index) => (
        <MKBox key={index} display="flex" flexDirection="column" pl={1}>
          <MKTypography variant="body2" gutterBottom>
            <li>{`${label} ${index + 1}`}</li>
          </MKTypography>
          <MKBox display="flex" pl={2.5} width="100%" gap={1} pb={1}>
            <MKBox display="flex" flexDirection="row" width="100%" gap={3}>
              {/* Experience Desc */}
              <MKBox display="flex" flexDirection="column" gap={1} flexGrow={1}>
                {/* Position */}
                <MKInput
                  fullWidth
                  disabled={!onEditIndex.includes(index)}
                  label="Position"
                  value={onEditIndex.includes(index) ? currentItem.position : item.position}
                  onChange={(e) => {
                    setCurrentItem({ ...currentItem, position: e.target.value });
                  }}
                />
                {/* Company */}
                <MKInput
                  fullWidth
                  disabled={!onEditIndex.includes(index)}
                  label="Company"
                  value={onEditIndex.includes(index) ? currentItem.company : item.company}
                  onChange={(e) => {
                    setCurrentItem({ ...currentItem, company: e.target.value });
                  }}
                />
              </MKBox>
              {/* Date */}
              <MKBox display="flex" flexDirection="column" gap={1} width="30%">
                {/* Start Date */}
                <MKBox display="flex" flexDirection="row" gap={1} width="100%">
                  <MKTypography
                    variant="body2"
                    sx={{
                      fontSize: "12px",
                      width: "55px",
                      fontWeight: "bold",
                      color: "grey",
                    }}
                  >
                    Start Date
                  </MKTypography>
                  <MKInput
                    type="date"
                    disabled={!onEditIndex.includes(index)}
                    sx={{ flexGrow: 1 }}
                    value={onEditIndex.includes(index) ? currentItem.start : item.start || ""}
                    onChange={(e) => {
                      setCurrentItem({ ...currentItem, start: e.target.value });
                    }}
                  />
                </MKBox>
                {/* End Date */}
                <MKBox display="flex" flexDirection="row" gap={1} width="100%">
                  <MKTypography
                    variant="body2"
                    sx={{
                      fontSize: "12px",
                      width: "55px",
                      fontWeight: "bold",
                      color: "grey",
                    }}
                  >
                    End Date{" "}
                  </MKTypography>
                  <MKInput
                    type="date"
                    disabled={!onEditIndex.includes(index)}
                    sx={{ flexGrow: 1 }}
                    value={onEditIndex.includes(index) ? currentItem.end : item.end || ""}
                    onChange={(e) => {
                      setCurrentItem({ ...currentItem, end: e.target.value });
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
          setData([...data, { position: "", company: "", start: "", end: "", description: "" }]);
        }}
        startIcon={<AddIcon />}
        disabled={!onEdit}
      >
        Add {label}
      </MKButton>
    </MKBox>
  );
};

AddableForm.propTypes = {
  data: propTypes.array,
  setData: propTypes.func,
  label: propTypes.string,
  name: propTypes.string,
  onEditIndex: propTypes.array,
  setOnEditIndex: propTypes.func,
  onEdit: propTypes.bool,
};

export default AddableForm;
