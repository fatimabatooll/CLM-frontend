import React, { useState, useEffect, useCallback, memo } from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import TimelineDot from "@mui/lab/TimelineDot";
import Chip from "@mui/material-next/Chip";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Divider from "@mui/joy/Divider";
import axios from "axios";
import PrintIcon from "@mui/icons-material/Print";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import {
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  CircularProgress,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const CustomizedPaper1 = styled(Paper)(({ theme }) => ({
  width: 425,
  // height: 85,
  padding: theme.spacing(2),
}));

const CustomizedPaper2 = styled(Paper)(({ theme }) => ({
  width: 425,
  // height: 105,
  padding: theme.spacing(2),
}));

const CustomizedPaper3 = styled(Paper)(({ theme }) => ({
  width: 425,
  // height: 85,
  padding: theme.spacing(2),
}));

const Root = styled("div")(({ theme }) => ({
  width: "100%",
  ...theme.typography.body2,
  color: theme.palette.text.secondary,
  "& > :not(style) ~ :not(style)": {
    marginTop: theme.spacing(2),
  },
}));

const TimelineItemComponent = memo(
  ({ data, userData, handleExpand, expanded }) => (
    <TimelineItem>
      <TimelineOppositeContent
        sx={{ m: "auto 0", my: 3, mx: -2 }}
        align="right"
        variant="body2"
      >
        <Typography variant="h7" component="span" color="text.secondary">
          {console.log("userData", userData)}
          {console.log("data", data)}
          {userData.sentTime &&
            new Date(userData.sentTime.replace(" at ", ",")).getFullYear()}
        </Typography>
        <Typography>
          {userData.sentTime &&
            new Date(userData.sentTime.replace(" at ", ",")).toLocaleDateString(
              undefined,
              {
                day: "numeric",
              }
            )}
        </Typography>
        <Typography>
          {userData.sentTime &&
            new Date(userData.sentTime.replace(" at ", ",")).toLocaleDateString(
              undefined,
              {
                month: "long",
              }
            )}
        </Typography>
      </TimelineOppositeContent>
      <TimelineSeparator>
        <TimelineDot
          color={
            userData.status === "Approved" ||
            userData.status === "Signed" ||
            userData.status === "Prepare for Signing"
              ? "success"
              : userData.status === "Pending"
              ? "info"
              : "error"
          }
        />
        <TimelineConnector />
      </TimelineSeparator>

      <TimelineContent>
        <CustomizedPaper2 elevation={3}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Chip
              color={
                userData.status === "Approved" ||
                userData.status === "Signed" ||
                userData.status === "Prepare for Signing"
                  ? "success"
                  : userData.status === "Pending"
                  ? "info"
                  : "error"
              }
              size="small"
              variant="elevated"
              sx={{ mb: 1.5 }}
              label={userData.status}
            />

            <Typography sx={{ mb: 1.5 }} color="text.secondary" variant="body2">
              <AccessTimeIcon
                sx={{
                  verticalAlign: "middle",
                  marginRight: 0.5,
                  marginTop: -0.7,
                  fontSize: "1rem",
                }}
              />
              {userData.status === "Approved" && userData.approveTime && (
                <>
                  {new Date(
                    userData.approveTime.replace(" at ", ",")
                  ).toLocaleDateString(undefined, {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}{" "}
                  {new Date(
                    userData.approveTime.replace(" at ", ",")
                  ).toLocaleTimeString()}
                </>
              )}

              {userData.status === "Suggest Changes" &&
                userData.suggestChangesTime && (
                  <>
                    {new Date(
                      userData.suggestChangesTime.replace(" at ", ",")
                    ).toLocaleDateString(undefined, {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}{" "}
                    {new Date(
                      userData.suggestChangesTime.replace(" at ", ",")
                    ).toLocaleTimeString()}
                  </>
                )}

              {userData.status === "Pending" && userData.sentTime && (
                <>
                  {new Date(
                    userData.sentTime.replace(" at ", ",")
                  ).toLocaleDateString(undefined, {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}{" "}
                  {new Date(
                    userData.sentTime.replace(" at ", ",")
                  ).toLocaleTimeString()}
                </>
              )}
              {userData.status === "Signed" && userData.signedTime && (
                <>
                  {new Date(
                    userData.signedTime.replace(" at ", ",")
                  ).toLocaleDateString(undefined, {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}{" "}
                  {new Date(
                    userData.signedTime.replace(" at ", ",")
                  ).toLocaleTimeString()}
                </>
              )}
            </Typography>
          </Stack>
          <Typography sx={{ mt: 0.4 }} color="text.secondary" variant="body2">
            Sent to {userData.name}
          </Typography>
          <Typography sx={{ mt: 0.4 }} color="text.secondary" variant="body2">
            {userData.email}
          </Typography>

          <Typography>
            <Button
              onClick={handleExpand}
              variant="text"
              sx={{
                color: "#6254B6",
                fontSize: "0.6rem",
                display: "block",
                margin: "0 auto",
              }}
            >
              Show more <ExpandMoreIcon />
            </Button>
            {expanded && (
              <Box
                sx={{
                  backgroundColor: "#E4E1FA",
                  p: 2,
                  mt: 2,
                  textAlign: "center",
                  boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                }}
              >
                {userData.status === "Approved" && userData.approveTime && (
                  <Typography variant="body2" sx={{ mb: 1, textAlign: "left" }}>
                    <Chip
                      color="success"
                      size="small"
                      variant="elevated"
                      label="Approved Time: "
                      sx={{ mr: 1 }}
                    />
                    <AccessTimeIcon sx={{ mr: 0.5, fontSize: "1rem", ml: 3 }} />
                    {new Date(
                      userData.approveTime.replace(" at ", ",")
                    ).toLocaleDateString(undefined, {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }) +
                      " " +
                      new Date(
                        userData.approveTime.replace(" at ", ",")
                      ).toLocaleTimeString()}
                  </Typography>
                )}
                {userData.status === "Approved" && userData.sentTime && (
                  <Typography variant="body2" sx={{ mb: 1, textAlign: "left" }}>
                    <Chip
                      color="info"
                      size="small"
                      variant="elevated"
                      label="Sent Time: "
                      sx={{ mr: 1 }}
                    />
                    <AccessTimeIcon
                      sx={{ verticalAlign: "middle", fontSize: "1rem", ml: 7 }}
                    />
                    {new Date(
                      userData.sentTime.replace(" at ", ",")
                    ).toLocaleDateString(undefined, {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }) +
                      " " +
                      new Date(
                        userData.sentTime.replace(" at ", ",")
                      ).toLocaleTimeString()}
                  </Typography>
                )}

                {userData.status === "Pending" && userData.sentTime && (
                  <Typography variant="body2" sx={{ mb: 1, textAlign: "left" }}>
                    <Chip
                      color="info"
                      size="small"
                      variant="elevated"
                      label="Sent Time: "
                      sx={{ mr: 1 }}
                    />
                    <AccessTimeIcon
                      sx={{
                        verticalAlign: "middle",
                        mr: 0.5,
                        fontSize: "1rem",
                        ml: 5,
                      }}
                    />
                    {new Date(
                      userData.sentTime.replace(" at ", ",")
                    ).toLocaleDateString(undefined, {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }) +
                      " " +
                      new Date(
                        userData.sentTime.replace(" at ", ",")
                      ).toLocaleTimeString()}
                  </Typography>
                )}
                {userData.status === "Approved" &&
                  userData.suggestChangesTime && (
                    <Typography
                      variant="body2"
                      sx={{ mb: 1, textAlign: "left" }}
                    >
                      <Chip
                        color="info"
                        size="small"
                        variant="elevated"
                        label="Modifying Time: "
                        sx={{ mr: 1 }}
                      />
                      <AccessTimeIcon
                        sx={{
                          verticalAlign: "middle",
                          mr: 0.5,
                          fontSize: "1rem",
                          ml: 2.5,
                        }}
                      />
                      {new Date(
                        userData.suggestChangesTime.replace(" at ", ",")
                      ).toLocaleDateString(undefined, {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }) +
                        " " +
                        new Date(
                          userData.suggestChangesTime.replace(" at ", ",")
                        ).toLocaleTimeString()}
                    </Typography>
                  )}

                {userData.status === "Pending" &&
                  userData.suggestChangesTime && (
                    <Typography
                      variant="body2"
                      sx={{ mb: 1, textAlign: "left" }}
                    >
                      <Chip
                        color="warning"
                        size="small"
                        variant="elevated"
                        label="Modify Request: "
                        sx={{ mr: 1 }}
                      />
                      <AccessTimeIcon
                        sx={{
                          verticalAlign: "middle",
                          mr: 0.5,
                          fontSize: "1rem",
                          ml: 2,
                        }}
                      />
                      {new Date(
                        userData.suggestChangesTime.replace(" at ", ",")
                      ).toLocaleDateString(undefined, {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }) +
                        " " +
                        new Date(
                          userData.suggestChangesTime.replace(" at ", ",")
                        ).toLocaleTimeString()}
                    </Typography>
                  )}
                {userData.status === "Suggest Changes" &&
                  userData.suggestChangesTime && (
                    <Typography
                      variant="body2"
                      sx={{ mb: 1, textAlign: "left" }}
                    >
                      <Chip
                        color="warning"
                        size="small"
                        variant="elevated"
                        label="Modifying Request: "
                        sx={{ mr: 1 }}
                      />
                      <AccessTimeIcon
                        sx={{ mr: 0.5, fontSize: "1rem", ml: 1 }}
                      />
                      {new Date(
                        userData.suggestChangesTime.replace(" at ", ",")
                      ).toLocaleDateString(undefined, {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }) +
                        " " +
                        new Date(
                          userData.suggestChangesTime.replace(" at ", ",")
                        ).toLocaleTimeString()}
                    </Typography>
                  )}

                {userData.status === "Suggest Changes" && userData.sentTime && (
                  <Typography variant="body2" sx={{ mb: 1, textAlign: "left" }}>
                    <Chip
                      color="warning"
                      size="small"
                      variant="elevated"
                      label="Sent Time:  "
                      sx={{ mr: 1 }}
                    />
                    <AccessTimeIcon sx={{ mr: 0.5, fontSize: "1rem", ml: 6 }} />
                    {new Date(
                      userData.sentTime.replace(" at ", ",")
                    ).toLocaleDateString(undefined, {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }) +
                      " " +
                      new Date(
                        userData.sentTime.replace(" at ", ",")
                      ).toLocaleTimeString()}
                  </Typography>
                )}

                {userData.status === "Prepare for signing" &&
                  userData.sentTime && (
                    <Typography
                      variant="body2"
                      sx={{ mb: 1, textAlign: "left" }}
                    >
                      <Chip
                        color="success"
                        size="small"
                        variant="elevated"
                        label="Sent Time"
                        sx={{ mr: 1 }}
                      />
                      <AccessTimeIcon
                        sx={{ mr: 0.5, fontSize: "1rem", ml: 3 }}
                      />
                      {new Date(
                        userData.sentTime.replace(" at ", ",")
                      ).toLocaleDateString(undefined, {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }) +
                        " " +
                        new Date(
                          userData.sentTime.replace(" at ", ",")
                        ).toLocaleTimeString()}
                    </Typography>
                  )}
                {userData.status === "Signed" && userData.signedTime && (
                  <Typography variant="body2" sx={{ mb: 1, textAlign: "left" }}>
                    <Chip
                      color="success"
                      size="small"
                      variant="elevated"
                      label="Signed Time:"
                      sx={{ mr: 1 }}
                    />
                    <AccessTimeIcon sx={{ mr: 0.5, fontSize: "1rem", ml: 3 }} />
                    {new Date(
                      userData.signedTime.replace(" at ", ",")
                    ).toLocaleDateString(undefined, {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }) +
                      " " +
                      new Date(
                        userData.signedTime.replace(" at ", ",")
                      ).toLocaleTimeString()}
                  </Typography>
                )}
                {userData.status === "Signed" && userData.sentTime && (
                  <Typography variant="body2" sx={{ mb: 1, textAlign: "left" }}>
                    <Chip
                      color="info"
                      size="small"
                      variant="elevated"
                      label="Sent Time: "
                      sx={{ mr: 1 }}
                    />
                    <AccessTimeIcon sx={{ mr: 0.5, fontSize: "1rem", ml: 5 }} />
                    {new Date(
                      userData.sentTime.replace(" at ", ",")
                    ).toLocaleDateString(undefined, {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }) +
                      " " +
                      new Date(
                        userData.sentTime.replace(" at ", ",")
                      ).toLocaleTimeString()}
                  </Typography>
                )}

                {((userData.status === "Approved" && !userData.approveTime) ||
                  (userData.status === "Not Sent" && !userData.sentTime) ||
                  (userData.status === "Prepare for signing" &&
                    !userData.sentTime) ||
                  (userData.status === "Pending" && !userData.sentTime) ||
                  (userData.status === "Signed" && !userData.signedTime) ||
                  (userData.status === "Suggest Changes" &&
                    !userData.suggestChangesTime)) && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    No more information found.
                  </Typography>
                )}
              </Box>
            )}
          </Typography>
        </CustomizedPaper2>
      </TimelineContent>
    </TimelineItem>
  )
);

const AuditTrail = ({ open, onClose, data }) => {
  const [auditData, setAuditData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});
  const [expandedAllDepartments, setExpandedAllDepartments] = useState(false);

  const handleExpand = useCallback((index) => {
    setExpanded((prevExpanded) => (prevExpanded === index ? null : index));
  }, []);

  const handleExpandItem = useCallback((index) => {
    setExpandedItems((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  }, []);

  const handleExpands = () => {
    setExpanded(!expanded); // Toggle the expanded state
  };

  const handleExpandAllDepartments = () => {
    setExpandedAllDepartments((prevState) => !prevState);
  };

  useEffect(() => {
    const fetchAuditTrailData = async () => {
      if (!data || !data.fileId || !data.recipient || !data.recipient.name) {
        console.error("Invalid data for fetching audit trail");
        return;
      }

      setIsLoading(true);
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/file/get_user_activity/`,
          {
            documentId: data.fileId,
            userName: data.recipient.name,
          }
        );
        setAuditData(response.data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching audit trail data", err);
        setIsLoading(false);
      }
    };

    fetchAuditTrailData();
  }, [data]);

  if (!data || !data.recipient) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <div className="flex items-center justify-between p-5">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-black">
          Audit Trail -{" "}
          <span style={{ color: "#6254B6" }}>{data.fileName}</span>
        </h3>
        <button
          type="button"
          className="text-gray-400 hover:text-gray-900 dark:hover:text-gray"
          onClick={onClose}
        >
          <span className="sr-only">Close</span>
          <svg
            className="w-6 h-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <DialogContent
        sx={{
          height: 500,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {isLoading ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <CircularProgress />
          </div>
        ) : (
          <Timeline align="alternate">
            {/* Other TimelineItems */}

            <TimelineItem>
              <TimelineOppositeContent
                sx={{ m: "auto 0", my: 3, mx: -2 }}
                align="right"
                variant="body2"
              >
                <Typography
                  variant="h7"
                  component="span"
                  color="text.secondary"
                >
                  {data.requestedTime &&
                    new Date(data.requestedTime.toDate()).getFullYear()}
                </Typography>
                <Typography>
                  {data.requestedTime &&
                    new Date(data.requestedTime.toDate()).toLocaleDateString(
                      undefined,
                      {
                        day: "numeric",
                      }
                    )}
                </Typography>
                <Typography>
                  {data.requestedTime &&
                    new Date(data.requestedTime.toDate()).toLocaleDateString(
                      undefined,
                      {
                        month: "long",
                      }
                    )}
                </Typography>
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot color="success" />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Root>
                  <Divider sx={{ mb: 2 }}>
                    Earlier in{" "}
                    {data.requestedTime &&
                      new Date(data.requestedTime.toDate()).toLocaleDateString(
                        undefined,
                        {
                          day: "numeric",
                          month: "long",
                        }
                      )}
                    ,{" "}
                    {data.requestedTime &&
                      new Date(data.requestedTime.toDate()).getFullYear()}
                  </Divider>
                </Root>
                <CustomizedPaper1 elevation={3}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Chip
                      color="info"
                      size="small"
                      variant="elevated"
                      label="Created"
                      sx={{ mb: 1.5 }}
                    />
                    <Typography
                      sx={{ mb: 2 }}
                      color="text.secondary"
                      variant="body2"
                    >
                      <AccessTimeIcon
                        sx={{
                          verticalAlign: "middle",
                          marginRight: 0.5,
                          marginTop: -0.7,
                          fontSize: "1rem",
                        }}
                      />
                      {data.requestedTime &&
                        new Date(
                          data.requestedTime.toDate()
                        ).toLocaleDateString(undefined, {
                          day: "numeric",
                          month: "short",
                          weekday: "short",
                          month: "short",
                          year: "numeric",
                        })}
                      ,{" "}
                      {data.requestedTime &&
                        new Date(
                          data.requestedTime.toDate()
                        ).toLocaleTimeString()}
                    </Typography>
                  </Stack>
                  <Typography
                    sx={{ mt: 0.3 }}
                    color="text.secondary"
                    variant="body2"
                  >
                    Created by {data.owner}
                  </Typography>
                  <Typography
                    sx={{ mt: 0.3 }}
                    color="text.secondary"
                    variant="body2"
                  >
                    Email: {data.senderemail}
                  </Typography>
                </CustomizedPaper1>
              </TimelineContent>
            </TimelineItem>

            <TimelineItem>
              <TimelineOppositeContent
                sx={{ m: "auto 0", my: 3, mx: -2 }}
                align="right"
                variant="body2"
              >
                <Typography
                  variant="h7"
                  component="span"
                  color="text.secondary"
                >
                  {data.requestedTime &&
                    new Date(data.requestedTime.toDate()).getFullYear()}
                </Typography>
                <Typography>
                  {data.requestedTime &&
                    new Date(data.requestedTime.toDate()).toLocaleDateString(
                      undefined,
                      {
                        day: "numeric",
                      }
                    )}
                </Typography>
                <Typography>
                  {data.requestedTime &&
                    new Date(data.requestedTime.toDate()).toLocaleDateString(
                      undefined,
                      {
                        month: "long",
                      }
                    )}
                </Typography>
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot color="success" />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <CustomizedPaper2 elevation={3}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Chip
                      color="info"
                      size="small"
                      variant="elevated"
                      label="Sent"
                      sx={{ mb: 1.5 }}
                    />
                    <Typography
                      sx={{ mb: 1.5 }}
                      color="text.secondary"
                      variant="body2"
                    >
                      <AccessTimeIcon
                        sx={{
                          verticalAlign: "middle",
                          marginRight: 0.5,
                          marginTop: -0.7,
                          fontSize: "1rem",
                        }}
                      />
                      {data.requestedTime &&
                        new Date(
                          data.requestedTime.toDate()
                        ).toLocaleDateString(undefined, {
                          day: "numeric",
                          month: "short",
                          weekday: "short",
                          month: "short",
                          year: "numeric",
                        })}
                      ,{" "}
                      {data.requestedTime &&
                        new Date(
                          data.requestedTime.toDate()
                        ).toLocaleTimeString()}
                    </Typography>
                  </Stack>
                  {/* <Typography
  sx={{ mt: 0.4 }}
  color="text.secondary"
  variant="body2"
>
  {data.department_hierarchy ? (
    <>
      Sent to Department Hierarchy:{" "}
      <span style={{ color: "#6254B6", fontWeight: "bold" }}>
        {data.department_hierarchy}
      </span>{" "}
      <Button
        onClick={handleExpand}
        variant="text"
        sx={{ color: "#6254B6", fontSize: "0.6rem", display: "block", margin: "0 auto" }}
        >
        {`Show All Departments under Hierarchy ${data.department_hierarchy}`}<ExpandMoreIcon />
      </Button>
    </>
  ) : (
    <>Sent to {data.recipient.name}</>
  )}
</Typography>
{expanded && (
  <Box sx={{ backgroundColor: "#E4E1FA", p: 2, mt: 2, textAlign: "center", boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)" }}>
    <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
      {data.addUserEmails.map((user, index) => (
        <Typography key={index}>
          {user.name}
        </Typography>
      ))}
    </div>
  </Box>
)} */}

                  <Typography
                    sx={{ mt: 0.4 }}
                    color="text.secondary"
                    variant="body2"
                  >
                    {data.department_hierarchy ? (
                      <>
                        Sent to Department Hierarchy:{" "}
                        <span style={{ color: "#6254B6", fontWeight: "bold" }}>
                          {data.department_hierarchy}
                        </span>{" "}
                        <Button
                          onClick={handleExpandAllDepartments}
                          variant="text"
                          sx={{
                            color: "#6254B6",
                            fontSize: "0.6rem",
                            margin: "0 auto",
                            display: "block",
                          }}
                        >
                          Show All Departments under Hierarchy{" "}
                          <ExpandMoreIcon />
                        </Button>
                      </>
                    ) : (
                      <>Sent to {data.recipient.name}</>
                    )}
                  </Typography>
                  {expandedAllDepartments && (
                    <Box
                      sx={{
                        backgroundColor: "#E4E1FA",
                        p: 2,
                        mt: 2,
                        textAlign: "center",
                        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ mb: 1, textAlign: "left" }}
                      >
                        <Chip
                          color="primary"
                          size="small"
                          variant="elevated"
                          label="Departments Under Hierarchy: "
                          sx={{
                            mr: 1,
                            margin: "0  auto",
                            display: "block",
                            textAlign: "center",
                          }}
                        />
                      </Typography>

                      {/* <h3 style={{ color: "purple" }}>
      Departments under Hierarchy: {data.department_hierarchy}
    </h3> */}
                      <ul
                        style={{
                          listStyleType: "disc",
                          textAlign: "left",
                          padding: "5px",
                          margin: "5px",
                          display: "flex",
                          flexDirection: "row",
                          // justifyContent: "space-around"
                        }}
                      >
                        {data.addUserEmails.map((user, index) => (
                          <Typography
                            variant="body2"
                            sx={{ mb: 1, textAlign: "left" }}
                          >
                            <Chip
                              color="purple"
                              size="small"
                              variant="elevated"
                              label={`${user.name}`}
                              sx={{
                                mr: 1,
                                margin: "8px",
                                textAlign: "center",
                                padding: "20px 10px",
                              }}
                            />
                          </Typography>
                        ))}
                      </ul>
                    </Box>
                  )}
                </CustomizedPaper2>
              </TimelineContent>
            </TimelineItem>
            {data.addUserEmails
              ? data.addUserEmails.map((userData, index) => (
                  <TimelineItemComponent
                    key={index}
                    userData={userData}
                    handleExpand={() => handleExpandItem(index)}
                    expanded={!!expandedItems[index]}
                  />
                ))
              : data.recipient && typeof data.recipient === 'object'
              ? [data.recipient].map((userData, index) => (
                  <TimelineItemComponent
                    key={index}
                    userData={userData}
                    handleExpand={() => handleExpand(index)}
                    expanded={expanded === index}
                  />
                ))
              : null}
          </Timeline>
        )}
      </DialogContent>

      <DialogActions className="mt-4" sx={{ justifyContent: "center" }}>
        <Button
          onClick={() => window.print()}
          startIcon={<PrintIcon />}
          sx={{ mt: 4 }}
          className="no-print"
        >
          Print
        </Button>
      </DialogActions>
      <style>
        {`
          @media print {
              .no-print {
                  display: none !important;
              }
          }
      `}
      </style>
    </Dialog>
  );
};

export default AuditTrail;
