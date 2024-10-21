import Loading from "@/components/bases/Loading";
import { useToastContext } from "@/providers/ToastProvider";
import { explorePdfsBasedOnQueryFromUrl, explorePdfsFromUrl } from "@/services/client/explore";
import { ExploreResult } from "@/types";
import {
    Button,
    ButtonGroup,
    FormControl,
    FormControlLabel,
    FormGroup,
    InputLabel,
    MenuItem,
    Select,
    Switch,
    TextField
} from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";

export default function ExplorePdfUrls(props: { pdfUrls: string[], setPdfUrls: Dispatch<SetStateAction<string[]>> }) {
    const { pdfUrls, setPdfUrls } = props;
    const [targetUrl, setTargetUrl] = useState<string>("");
    const [isQueryEnabled, setIsQueryEnabled] = useState<boolean>(false);
    const [query, setQuery] = useState<string>("");
    const [depth, setDepth] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<string | undefined>(undefined);
    const { showToast } = useToastContext();

    const handleQuery = () => {
        setIsQueryEnabled((current) => !current);
    }
    const handleExplore = async () => {
        setIsLoading("explore");
        try {
            const depthArray = new Array(depth).fill("");
            await depthArray.reduce(
                async (prePromise: Promise<ExploreResult>, _, i) => {
                    const pre = await prePromise;
                    if (pre.targetUrls.length === 0) return Promise.resolve(pre);
                    setIsLoading(() => `explore${i + 1}`);
                    const currentLayerResult = isQueryEnabled ? await explorePdfsBasedOnQueryFromUrl(
                        query,
                        pre.targetUrls,
                        pre.urlsExplored
                    ) : await explorePdfsFromUrl(
                        pre.targetUrls,
                        pre.urlsExplored
                    );
                    setPdfUrls((currentPdfUrls) => {
                        const newPdfUrls = currentLayerResult.pdfUrls.filter((cur) => !currentPdfUrls.includes(cur));
                        return [...currentPdfUrls, ...newPdfUrls];
                    }
                    );
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
            <FormGroup>
                <FormControlLabel control={<Switch checked={isQueryEnabled} onChange={handleQuery} />} label="探索キーワードを用いたAI探索" />
            </FormGroup>
            <TextField
                id="query"
                label="探索キーワード"
                variant="standard"
                value={query}
                disabled={!isQueryEnabled}
                required
                onChange={(e) => setQuery(e.target.value)}
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
                    disabled={!targetUrl || !query}
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
        </>
    );
}
