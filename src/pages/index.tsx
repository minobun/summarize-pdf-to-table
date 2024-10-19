import Explore from "@/components/frames/Explore";
import Extract from "@/components/frames/Extract";
import Layouts from "@/components/layouts";
import { CoffeeMaker, FindInPage } from "@mui/icons-material";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useState } from "react";

export default function Home() {
  const [mode, setMode] = useState<string>("extract");
  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newMode: string
  ) => {
    setMode(newMode);
  };
  return (
    <Layouts>
      <ToggleButtonGroup
        value={mode}
        exclusive
        onChange={handleChange}
        aria-label="mode"
      >
        <ToggleButton value="extract">
          <CoffeeMaker />
          PDF抽出
        </ToggleButton>
        <ToggleButton value="explore">
          <FindInPage />
          PDF探索
        </ToggleButton>
      </ToggleButtonGroup>
      <>
        {mode === "extract" && <Extract />}
        {mode === "explore" && <Explore />}
      </>
    </Layouts>
  );
}
