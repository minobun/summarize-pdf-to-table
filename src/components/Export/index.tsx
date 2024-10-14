import React from "react";
import * as XLSX from "xlsx";
import { stringify } from "csv-stringify/sync";
import { Info } from "@/types";
import { Button, ButtonGroup } from "@mui/material";

export default function Export(props: {
  tableTitle: string;
  rowHeaders: string[];
  columnHeaders: string[];
  result: Info;
}) {
  const { tableTitle, rowHeaders, columnHeaders, result } = props;

  // CSVエクスポート用関数
  const exportToCSV = () => {
    // 配列に変換
    const csvContent = [
      [tableTitle, ...rowHeaders],
      ...columnHeaders.map((column) => [
        column,
        ...rowHeaders.map((row) =>
          result[column][row] ? result[column][row] : ""
        ),
      ]),
    ];
    const blob = new Blob([stringify(csvContent)], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.csv";
    a.click();
    URL.revokeObjectURL(url); // リソースを解放
  };

  // Excelエクスポート用関数
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(Object.keys(result));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.xlsx";
    a.click();
    URL.revokeObjectURL(url); // リソースを解放
  };

  return (
    <ButtonGroup>
      <Button onClick={exportToCSV}>CSV形式で出力</Button>
      <Button onClick={exportToExcel}>Excel形式で出力</Button>
    </ButtonGroup>
  );
}
