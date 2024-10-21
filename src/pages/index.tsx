import Explore from "@/components/frames/Explore";
import ExploreAndExtract from "@/components/frames/ExploreAndExtract";
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
        <ToggleButton value="exploreAndExtract">
          <FindInPage />
          PDF探索
          +
          <CoffeeMaker />
          PDF抽出
        </ToggleButton>
      </ToggleButtonGroup>
      <>
        {mode === "extract" && <Extract />}
        {mode === "explore" && <Explore />}
        {mode === "exploreAndExtract" && <ExploreAndExtract />}
      </>
    </Layouts>
  );
}
