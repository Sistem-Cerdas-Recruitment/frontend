import React, { useState, useEffect } from "react";
import propTypes from "prop-types";
import MKBox from "components/MKBox";
import MKInput from "components/MKInput";
import MKButton from "components/MKButton";
import MKTypography from "components/MKTypography";
import { Grid } from "@mui/material";
import { IconButton } from "@mui/material";
import { Add as AddIcon, Remove as RemoveIcon, Edit as EditIcon } from "@mui/icons-material";

const SkillForm = (props) => {
  const { data, setData, onEditIndex, setOnEditIndex, onEdit } = props;
  const [currentItem, setCurrentItem] = useState("");

  useEffect(() => {
    console.log("onEdit", onEdit);
  }, [onEdit]);

  return (
    <MKBox>
      <MKTypography variant="body2" gutterBottom sx={{ fontWeight: "bold" }}>
        Skills
      </MKTypography>
      <MKBox display="flex" flexDirection="column" width="100%" gap={1}>
        <Grid container spacing={0}>
          {data.map((item, index) => (
            <Grid item xs={4} key={index}>
              <MKBox key={index} display="flex" flexDirection="column" pl={1}>
                <MKBox display="flex" flexDirection="row" pl={2.5} width="100%" gap={0} pb={1}>
                  <MKBox display="flex" flexDirection="column" gap={1} flexGrow={1}>
                    <MKBox
                      display="flex"
                      flexDirection="row"
                      width="100%"
                      gap={3}
                      alignItems="center"
                    >
                      {/* Skill Desc */}
                      <MKBox display="flex" flexDirection="column" gap={1} flexGrow={1}>
                        {/* Major */}
                        <MKInput
                          fullWidth
                          disabled={!onEditIndex.includes(index)}
                          label="Skill"
                          value={onEditIndex.includes(index) ? currentItem : item}
                          onChange={(e) => {
                            setCurrentItem(e.target.value);
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
            </Grid>
          ))}
        </Grid>
        <MKButton
          onClick={() => {
            setData([...data, ""]);
          }}
          startIcon={<AddIcon />}
          disabled={!onEdit}
        >
          Add Skill
        </MKButton>
      </MKBox>
    </MKBox>
  );
};

SkillForm.propTypes = {
  data: propTypes.array,
  setData: propTypes.func,
  onEditIndex: propTypes.array,
  setOnEditIndex: propTypes.func,
  onEdit: propTypes.bool,
};

export default SkillForm;
