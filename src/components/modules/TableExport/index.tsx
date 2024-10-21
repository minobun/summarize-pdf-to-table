import { useToastContext } from "@/providers/ToastProvider";
import { TableRow } from "@/types";
import { Button, ButtonGroup } from "@mui/material";
import { stringify } from "csv-stringify/sync";
import * as XLSX from "xlsx";

export default function TableExport(props: { result: TableRow[] }) {
  const { result } = props;
  const { showToast } = useToastContext();

  // CSVエクスポート用関数
  const exportToCSV = () => {
    // 配列に変換
    const csvContent = result.map((tableRow: TableRow) =>
      Object.values(tableRow)
    );
    const blob = new Blob([stringify(csvContent)], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.csv";
    a.click();
    URL.revokeObjectURL(url); // リソースを解放
    showToast("success", "CSVファイルを出力しました。");
  };

  // Excelエクスポート用関数
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(result);
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
    showToast("success", "Excelファイルを出力しました。");
  };

  return (
    <ButtonGroup>
      <Button onClick={exportToCSV}>CSV形式で出力</Button>
      <Button onClick={exportToExcel}>Excel形式で出力</Button>
    </ButtonGroup>
  );
}
