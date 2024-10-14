import Export from "@/components/Export";
import Guide from "@/components/Guide";
import Loading from "@/components/Loading";
import ModalContent from "@/components/ModalContent";
import Release from "@/components/Release";
import Rule from "@/components/Rule";
import TableComponent from "@/components/TableComponent";
import TopBar from "@/components/TopBar";
import { Info } from "@/types";
import { Button, Grid2, Modal, TextField } from "@mui/material";
import { useState } from "react";

export default function Home() {
  const [modal, setModal] = useState<"home" | "guide" | "rule">("home");
  const [pdfUrl, setPdfUrl] = useState("");

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
    if (!pdfUrl) return;
    setIsLoading("data");
    const responseCreateBody = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pdfUrl,
        type: "create",
        rowHeaders,
        columnHeaders,
      }),
    };

    try {
      const responseCreated = await fetch("/api/extract", responseCreateBody);
      if (responseCreated.ok) {
        const data = await responseCreated.json();
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
    if (!pdfUrl) return;
    setIsLoading("header");
    const responseInferBody = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pdfUrl, type: "infer" }),
    };
    console.log(responseInferBody);

    try {
      const responseInfered = await fetch("/api/extract", responseInferBody);
      if (responseInfered.ok) {
        const data = await responseInfered.json();
        setColumnHeaders(data.answer.columnHeaders);
        setRowHeaders(data.answer.rowHeaders);
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
      <Modal open={modal === "rule"} onClose={() => setModal("home")}>
        <ModalContent>
          <Rule />
        </ModalContent>
      </Modal>
      <Modal open={modal === "guide"} onClose={() => setModal("home")}>
        <ModalContent>
          <Guide />
        </ModalContent>
      </Modal>
      <Modal open={modal === "release"} onClose={() => setModal("home")}>
        <ModalContent>
          <Release />
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
        height={
          rowHeaders.length > 0 || columnHeaders.length > 0 ? "30vh" : "60vh"
        }
      >
        <TextField
          label="PDFファイルのURL"
          type="url"
          value={pdfUrl}
          onChange={(e) => setPdfUrl(e.target.value)}
          fullWidth
          required
        />
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
        {(rowHeaders.length > 0 || columnHeaders.length > 0) && (
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
