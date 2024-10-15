import Export from "@/components/Export";
import Guide from "@/components/Guide";
import Loading from "@/components/Loading";
import ModalContent from "@/components/ModalContent";
import Release from "@/components/Release";
import Rule from "@/components/Rule";
import TableComponent from "@/components/TableComponent";
import TopBar from "@/components/TopBar";
import { Info, Mode } from "@/types";
import {
  Button,
  FormControl,
  Grid2,
  IconButton,
  InputAdornment,
  InputLabel,
  Modal,
  OutlinedInput,
} from "@mui/material";
import { useState } from "react";

export default function Home() {
  const [modal, setModal] = useState<Mode | undefined>(undefined);
  const [pdfUrls, setPdfUrls] = useState<string[]>([""]);

  const [rowHeaders, setRowHeaders] = useState<string[]>([]);
  const [columnHeaders, setColumnHeaders] = useState<string[]>([]);
  const [tableTitle, setTableTitle] = useState<string>("");

  const [result, setResult] = useState<Info>();

  const [isLoading, setIsLoading] = useState<"header" | "data" | undefined>(
    undefined
  );

  const handleHeader = (
    value: string,
    index: number,
    direction: "row" | "column"
  ) => {
    if (direction === "row")
      setRowHeaders((cur) =>
        cur.map((item, i) => (i === index ? value : item))
      );
    if (direction === "column")
      setColumnHeaders((cur) =>
        cur.map((item, i) => (i === index ? value : item))
      );
  };

  const addLine = (direction: "row" | "column") => {
    if (direction === "row") setRowHeaders((cur) => [...cur, ""]);
    if (direction === "column") setColumnHeaders((cur) => [...cur, ""]);
  };
  const deleteLine = (direction: "row" | "column", index: number) => {
    if (direction === "row")
      setRowHeaders((cur) => cur.filter((_, i) => i != index));
    if (direction === "column")
      setColumnHeaders((cur) => cur.filter((_, i) => i != index));
  };

  const handleCreate = async (
    columnHeaders: string[],
    rowHeaders: string[]
  ) => {
    if (
      pdfUrls.length === 0 ||
      pdfUrls.some((pdfUrl) => !pdfUrl.endsWith("pdf"))
    )
      return;
    setIsLoading("data");
    const responseCreateBody = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pdfUrls,
        type: "create",
        rowHeaders,
        columnHeaders,
      }),
    };

    try {
      const responseCreated = await fetch("/api/extract", responseCreateBody);
      if (responseCreated.ok) {
        const data: { answer: Info } = await responseCreated.json();
        setResult(data.answer);
      } else {
        console.error("Failed to extract data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setIsLoading(undefined);
  };

  const handleExtract = async () => {
    if (
      pdfUrls.length === 0 ||
      pdfUrls.some((pdfUrl) => !pdfUrl.endsWith("pdf"))
    )
      return;
    setIsLoading("header");
    const responseInferBody = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pdfUrls, type: "infer" }),
    };
    console.log(responseInferBody);

    try {
      const responseInfered = await fetch("/api/extract", responseInferBody);
      if (responseInfered.ok) {
        const data: {
          answer: {
            columnHeaders: string[];
            rowHeaders: string[];
            tableTitle: string;
          };
        } = await responseInfered.json();
        setColumnHeaders(data.answer.columnHeaders.filter((_, i) => i < 10));
        setRowHeaders(data.answer.rowHeaders.filter((_, i) => i < 10));
        setTableTitle(data.answer.tableTitle);
        await handleCreate(data.answer.columnHeaders, data.answer.rowHeaders);
      } else {
        console.error("Failed to extract data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setIsLoading(undefined);
  };

  return (
    <>
      <TopBar setModal={setModal} />
      <Modal open={!!modal} onClose={() => setModal(undefined)}>
        <ModalContent>
          <>
            {modal === "guide" && <Guide />}
            {modal === "rule" && <Rule />}
            {modal === "release" && <Release />}
          </>
        </ModalContent>
      </Modal>
      <Grid2
        container
        alignItems="center"
        justifyContent="center"
        direction="column"
        spacing={3}
        margin="10px"
        padding="10px"
      >
        {pdfUrls.map((pdfUrl, index) => (
          <FormControl sx={{ m: 1 }} variant="outlined" fullWidth>
            <InputLabel htmlFor={`outlined-adornment-password-${index}`}>
              抽出したいPDFのURL
            </InputLabel>
            <OutlinedInput
              id={`outlined-adornment-password-${index}`}
              error={!pdfUrl.endsWith(".pdf")}
              value={pdfUrl}
              type="text"
              onChange={(e) =>
                setPdfUrls((cur) =>
                  cur.map((item, i) => (i === index ? e.target.value : item))
                )
              }
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() =>
                      setPdfUrls((cur) => cur.filter((_, i) => i !== index))
                    }
                    edge="end"
                  >
                    🗑️
                  </IconButton>
                </InputAdornment>
              }
              label="抽出したいPDFのURL"
            />
          </FormControl>
        ))}

        <Button
          variant="outlined"
          onClick={() => setPdfUrls((cur) => [...cur, ""])}
          disabled={pdfUrls.length > 10}
        >
          追加
        </Button>

        <Button
          variant="contained"
          disabled={!!isLoading}
          onClick={handleExtract}
        >
          PDFから抽出
        </Button>
        {isLoading === "header" && (
          <Loading label="見出し情報を作成中です..." />
        )}
      </Grid2>
      <Grid2
        container
        alignItems="center"
        justifyContent="center"
        direction="column"
        spacing={3}
        margin="10px"
      >
        {isLoading === "data" && (
          <Loading label="テーブル情報を作成中です..." />
        )}
        {(rowHeaders.length > 0 || columnHeaders.length > 0 || result) && (
          <TableComponent
            tableTitle={tableTitle}
            rowHeaders={rowHeaders}
            columnHeaders={columnHeaders}
            result={result}
            setTableTitle={setTableTitle}
            handleHeader={handleHeader}
            addLine={addLine}
            deleteLine={deleteLine}
          />
        )}
        {result && (
          <>
            <Export
              tableTitle={tableTitle}
              columnHeaders={columnHeaders}
              rowHeaders={rowHeaders}
              result={result}
            />
            <Button
              variant="contained"
              disabled={!!isLoading}
              onClick={() => handleCreate(columnHeaders, rowHeaders)}
            >
              指定した見出し情報でPDFから再抽出
            </Button>
          </>
        )}
      </Grid2>
    </>
  );
}
