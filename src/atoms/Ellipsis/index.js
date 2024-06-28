import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import propTypes from "prop-types";
import { Box, Popper, SvgIcon, IconButton, ButtonBase, Grow } from "@mui/material";
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import { toast } from "react-toastify";

import {
  DocumentCheckIcon,
  ChatBubbleLeftRightIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  XCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";

const ActionDropdown = ({ application }) => {
  const [dropdown, setDropdown] = useState(false);
  const [dropdownEl, setDropdownEl] = useState("");
  const navigate = useNavigate();
  // eslint-disable-next-line no-undef
  const hurl = process.env.REACT_APP_API_URL;

  function inviteInterview() {
    if (application.status !== "PENDING") {
      return;
    }
    const data = {
      job_application_id: application.id,
      is_accepted: true,
    };
    axios
      .patch(`${hurl}/api/job/application/status`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        window.location.reload();
        toast.success("Interview invitation sent");
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const actionItems = [
    {
      name: "CV Details",
      description: "View CV and Matching Score",
      icon: <DocumentCheckIcon />,
      action: () => {
        console.log("CV Details");
      },
    },
    {
      name: "Invite Interview",
      description: "Invite the candidate for an interview",
      icon: <ChatBubbleOvalLeftEllipsisIcon />,
      action: inviteInterview,
    },
    {
      name: "Interview Details",
      description: "Interview Logs and Result Analysis",
      icon: <ChatBubbleLeftRightIcon />,
      action: () => {
        navigate(`/company/interview-result/${application.id}`);
      },
    },
    {
      name: "Accept",
      description: "Accept the candidate",
      icon: <CheckCircleIcon />,
      action: () => {
        console.log("Accept");
      },
    },
    {
      name: "Reject",
      description: "Reject the candidate",
      icon: <XCircleIcon />,
      action: () => {
        console.log("Reject");
      },
    },
  ];

  const filterActions = (status) => {
    // return actionItems;
    // eslint-disable-next-line no-unreachable
    if (status === "PENDING") {
      // index 0 and 1
      return [actionItems[0], actionItems[1]];
    } else if (status === "AWAITING_INTERVIEW") {
      // index 0 only
      return [actionItems[0]];
    } else if (status === "INTERVIEW") {
      // index 0, 2
      return [actionItems[0], actionItems[2]];
    } else if (status === "EVALUATED") {
      // index 0, 2, 3, 4
      return [actionItems[0], actionItems[2], actionItems[3], actionItems[4]];
    } else if (status === "AWAITING_EVALUATION" || status === "ACCEPTED" || status === "REJECTED") {
      // index 0, 2
      return [actionItems[0], actionItems[2]];
    } else {
      return [];
    }
  };

  return (
    <Box onMouseLeave={() => setDropdown(false)}>
      <IconButton onMouseEnter={() => setDropdown(true)} ref={setDropdownEl}>
        <SvgIcon component={EllipsisVerticalIcon} style={{ width: 24, height: 24 }} />
      </IconButton>
      <Popper
        anchorEl={dropdownEl}
        popperRef={null}
        open={dropdown}
        placement="bottom-start"
        transition
        style={{ zIndex: 10 }}
        onMouseEnter={() => setDropdown(true)}
        onMouseLeave={() => {
          setDropdown(false);
        }}
      >
        {({ TransitionProps }) => (
          <Grow
            {...TransitionProps}
            sx={{
              transformOrigin: "left top",
              background: ({ palette: { white } }) => white.main,
            }}
          >
            <MKBox shadow="lg" borderRadius="lg" p={2} mt={2} gap={2}>
              {filterActions(application.status).map((item, index) => (
                <MKBox key={index} display="flex" sx={{ width: "100%" }} py={0.5}>
                  <ButtonBase onClick={item.action} sx={{ width: "100%" }}>
                    {/* inside */}
                    <MKBox display="flex" alignItems="center" sx={{ width: "100%" }}>
                      <SvgIcon sx={{ height: 30, width: 30 }}>{item.icon}</SvgIcon>
                      <MKBox
                        ml={2}
                        display="flex"
                        flexDirection="column"
                        sx={{ width: "100%" }}
                        alignItems="flex-start"
                      >
                        <MKTypography variant="h6">{item.name}</MKTypography>
                        <MKTypography variant="body2" color="textSecondary">
                          {item.description}
                        </MKTypography>
                      </MKBox>
                    </MKBox>
                  </ButtonBase>
                </MKBox>
              ))}
            </MKBox>
          </Grow>
        )}
      </Popper>
    </Box>
  );
};

ActionDropdown.propTypes = {
  application: propTypes.object,
};

export default ActionDropdown;
