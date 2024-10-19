import Loading from "@/components/bases/Loading";
import { useToastContext } from "@/providers/ToastProvider";
import { explorePdfsFromUrl } from "@/services/client/explore";
import { ExploreResult } from "@/types";
import {
  Button,
  ButtonGroup,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useState } from "react";

export default function Explore() {
  const [targetUrl, setTargetUrl] = useState<string>("");
  const [depth, setDepth] = useState<number>(1);
  const [pdfs, setPdfs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<string | undefined>(undefined);
  const { showToast } = useToastContext();

  const handleExplore = async () => {
    setIsLoading("explore");
    try {
      const depthArray = new Array(depth).fill("");
      await depthArray.reduce(
        async (prePromise: Promise<ExploreResult>, _, i) => {
          const pre = await prePromise;
          if (pre.targetUrls.length === 0) return Promise.resolve(pre);
          setIsLoading(() => `explore${i + 1}`);
          const currentLayerResult = await explorePdfsFromUrl(
            pre.targetUrls,
            pre.urlsExplored
          );
          setPdfs((currentPdfs) => {
            const newPdfs = currentLayerResult.pdfUrls.filter(
              (cur) => !currentPdfs.some((pdf) => cur === pdf)
            );
            return [...currentPdfs, ...newPdfs];
          });
          return currentLayerResult;
        },
        Promise.resolve({ targetUrls: [targetUrl], urlsExplored: [] })
      );

      showToast("success", "PDFファイルの探索を完了しました。");
    } catch (error) {
      console.error(error);
      console.error("Failed to explore.");
      showToast("error", "PDFファイルの探索に失敗しました。");
    }
    setIsLoading(undefined);
  };

  return (
    <>
      <TextField
        id="target-url"
        label="探索先URL"
        variant="standard"
        value={targetUrl}
        required
        onChange={(e) => setTargetUrl(e.target.value)}
      />
      <FormControl fullWidth>
        <InputLabel id="layer-depth">探索階層</InputLabel>
        <Select
          labelId="layer-label"
          id="layer-depth"
          value={depth}
          label="探索階層"
          onChange={(e) => {
            if (typeof e.target.value === "number") setDepth(e.target.value);
          }}
        >
          <MenuItem value={1}>1階層</MenuItem>
          <MenuItem value={2}>2階層</MenuItem>
          <MenuItem value={3}>3階層</MenuItem>
        </Select>
      </FormControl>
      <ButtonGroup>
        <Button
          disabled={!targetUrl}
          variant="contained"
          onClick={handleExplore}
        >
          PDFファイルの探索
        </Button>
      </ButtonGroup>
      <>
        {isLoading === "explore" && (
          <Loading label="PDFファイルを探索中です..." />
        )}
        {isLoading === "explore1" && <Loading label="1階層目を探索中です..." />}
        {isLoading === "explore2" && <Loading label="2階層目を探索中です..." />}
        {isLoading === "explore3" && <Loading label="3階層目を探索中です..." />}
      </>
      <List>
        {Array.from(pdfs).map((pdf, index) => (
          <ListItem key={`pdf-${index}`}>
            <ListItemText>{pdf}</ListItemText>
          </ListItem>
        ))}
      </List>
    </>
  );
}
