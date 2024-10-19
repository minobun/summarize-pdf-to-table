import { Mode } from "@/types";
import { Grid2 } from "@mui/material";
import { ReactElement, useState } from "react";
import Modal from "../bases/Modal";
import { GuideDescription } from "../descriptions/Guide";
import { ReleaseDescription } from "../descriptions/Release";
import { RuleDescription } from "../descriptions/Rule";
import Header from "./Header";

export default function Layouts(props: {
  children: ReactElement[] | ReactElement;
}): ReactElement {
  const { children } = props;
  const [mode, setMode] = useState<Mode | undefined>(undefined);
  return (
    <>
      <Header setMode={setMode} />
      <Modal isOpen={!!mode} onClose={() => setMode(undefined)}>
        <p style={{ whiteSpace: "pre-line" }}>
          {mode === "guide" && GuideDescription}
          {mode === "rule" && RuleDescription}
          {mode === "release" && ReleaseDescription}
        </p>
      </Modal>
      <Grid2
        container
        direction="column"
        margin="10px"
        padding="10px"
        spacing={3}
      >
        {children}
      </Grid2>
    </>
  );
}
