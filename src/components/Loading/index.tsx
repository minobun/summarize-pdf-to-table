import React, { ReactElement } from "react";
import { CircularProgress, Typography, Box } from "@mui/material";

export default function Loading(props: { label: string }): ReactElement {
  const { label } = props;
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <CircularProgress />
      <Typography variant="h6" mt={2}>
        {label}
      </Typography>
    </Box>
  );
}
