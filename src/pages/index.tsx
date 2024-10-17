import Loading from "@/components/bases/Loading";
import Layouts from "@/components/layouts";
import PdfUrlsImport from "@/components/modules/PdfUrlsImport";
import TableComponent from "@/components/modules/TableComponent";
import TableExport from "@/components/modules/TableExport";
import { extractInformationBasedOnHeadersFromPdfUrls } from "@/services/client/extract";
import { guessHeadersFromPdfUrls } from "@/services/client/guess";
import { TableRow } from "@/types";
import {
  Button,
  ButtonGroup,
  Divider,
  TextField
} from "@mui/material";
import { useEffect, useState } from "react";

export default function Home() {
  const [pdfUrls, setPdfUrls] = useState<string[]>([""]);
  const [rowHeaders, setRowHeaders] = useState<string[]>([]);
  const [columnHeaders, setColumnHeaders] = useState<string[]>([]);
  const [tableTitle, setTableTitle] = useState<string>("テーブル名");
  const [result, setResult] = useState<TableRow[]>([]);
  const [isEdditing, setIsEdditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<"guess" | "extract" | undefined>(
    undefined
  );

  useEffect(() => {
    const rowTitles = result.map((row) => row.title ?? "");
    setRowHeaders(rowTitles);
  }, [result])

  const handleGuess = async () => {
    setIsLoading("guess");
    try {
      const data = await guessHeadersFromPdfUrls(pdfUrls)
      setTableTitle(data.tableTitle);
      setColumnHeaders(data.columnHeaders);
      setResult(data.rowHeaders.map((rowHeader) => ({ title: rowHeader })))
    } catch (error) {
      console.error("Failed to guess headers.")
    }
    setIsLoading(undefined);
  }

  const handleExtract = async () => {
    setIsLoading("extract");
    try {
      const data = await extractInformationBasedOnHeadersFromPdfUrls(columnHeaders, rowHeaders, pdfUrls)
      setResult(data);
    } catch (error) {
      console.error("Failed to guess headers.")
    }
    setIsLoading(undefined);
  }

  const addColumn = () => {
    setColumnHeaders([...columnHeaders, "追加"])
  }

  const addRow = () => {
    const newRowHeaders = [...rowHeaders, ""]
    setRowHeaders(newRowHeaders)
    setResult((cur) => [...cur, { title: "追加" }])
  }


  return (
    <Layouts>
      <PdfUrlsImport pdfUrls={pdfUrls} setPdfUrls={setPdfUrls} />
      <Divider />
      <ButtonGroup>
        <Button
          variant="outlined"
          disabled={!!isLoading}
          onClick={handleGuess}
        >
          指定したPDFでカラムの作成
        </Button>

        <Button
          variant="outlined"
          disabled={!!isLoading || columnHeaders.length === 0 || rowHeaders.length === 0}
          onClick={handleExtract}
        >
          指定したカラム情報でPDFからデータを抽出
        </Button>
        <Button
          variant="outlined"
          disabled={!!isLoading || columnHeaders.length === 0 || isEdditing}
          onClick={() => setIsEdditing(true)}
        >
          カラム情報の編集
        </Button>
      </ButtonGroup>
      <>
        {isEdditing &&
          <>
            {columnHeaders.map((columnHeader, index) =>
              <TextField key={`column-${index}`} value={columnHeader} onChange={(e) => setColumnHeaders((cur) => cur.map((_, i) => i === index ? e.target.value : _))} />
            )}
            <ButtonGroup>
              <Button
                variant="contained"
                onClick={() => setIsEdditing(false)}
              >
                OK
              </Button>
            </ButtonGroup>
          </>
        }
      </>
      <>
        {
          isLoading === "guess" && (
            <Loading label="カラム情報を作成中です..." />
          )
        }
        {isLoading === "extract" && (
          <Loading label="テーブル情報を作成中です..." />
        )}
      </>
      <TableComponent
        tableTitle={tableTitle}
        columnHeaders={columnHeaders}
        data={result}
        setData={setResult}
      />
      <ButtonGroup>
        <Button
          variant="outlined"
          disabled={!!isLoading || columnHeaders.length >= 20}
          onClick={addColumn}
        >
          列を追加
        </Button>

        <Button
          variant="outlined"
          disabled={!!isLoading || rowHeaders.length >= 20}
          onClick={addRow}
        >
          行を追加
        </Button>
      </ButtonGroup>
      <Divider />
      <TableExport
        tableTitle={tableTitle}
        columnHeaders={columnHeaders}
        result={result}
      />
    </Layouts >
  );
}
