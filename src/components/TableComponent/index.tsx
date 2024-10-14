import { Info } from "@/types";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
} from "@mui/material";
import { ReactElement } from "react";

export default function TableComponent(props: {
  tableTitle: string;
  columnHeaders: string[];
  rowHeaders: string[];
  result?: Info;
  setTableTitle: (tableTitle: string) => void;
  handleHeader: (
    value: string,
    index: number,
    direction: "row" | "column"
  ) => void;
  addLine: (direction: "row" | "column") => void;
  deleteLine: (direction: "row" | "column", index: number) => void;
}): ReactElement {
  const {
    tableTitle,
    columnHeaders,
    rowHeaders,
    result,
    setTableTitle,
    handleHeader,
    addLine,
    deleteLine,
  } = props;

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <TextField
                variant="standard"
                error={tableTitle.length > 50}
                value={tableTitle}
                onChange={(e) => setTableTitle(e.target.value)}
                sx={{ width: `${tableTitle.length * 20 + 20}px` }}
              />
            </TableCell>
            {rowHeaders.map((rowHeader, index) => (
              <TableCell key={`TableHeader-${index}`}>
                <Box display="flex">
                  <TextField
                    variant="standard"
                    error={rowHeader.length > 20}
                    value={rowHeader}
                    onChange={(e) => handleHeader(e.target.value, index, "row")}
                    sx={{ width: `${rowHeader.length * 20 + 20}px` }}
                  />
                  <Tooltip title="列を削除">
                    <Button
                      variant="text"
                      onClick={() => deleteLine("row", index)}
                      style={{ padding: 0 }}
                    >
                      -
                    </Button>
                  </Tooltip>
                </Box>
              </TableCell>
            ))}
            <TableCell>
              <Tooltip title="列を追加">
                <Button variant="contained" onClick={() => addLine("row")}>
                  +
                </Button>
              </Tooltip>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {columnHeaders.map((columnHeader, index) => (
            <TableRow
              key={`TableRow-${index}`}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <Box display="flex">
                  <TextField
                    variant="standard"
                    value={columnHeader}
                    error={columnHeader.length > 20}
                    onChange={(e) =>
                      handleHeader(e.target.value, index, "column")
                    }
                    sx={{ width: `${columnHeader.length * 20 + 20}px` }}
                  />
                  <Tooltip title="行を削除">
                    <Button
                      variant="text"
                      onClick={() => deleteLine("column", index)}
                      style={{ padding: 0 }}
                    >
                      -
                    </Button>
                  </Tooltip>
                </Box>
              </TableCell>
              {rowHeaders.map((rowHeader) => (
                <TableCell key={`Cell-${index}-${index}`}>
                  {result &&
                  result[columnHeader] &&
                  result[columnHeader][rowHeader]
                    ? result[columnHeader][rowHeader]
                    : ""}
                </TableCell>
              ))}
            </TableRow>
          ))}
          <TableRow>
            <TableCell>
              <Tooltip title="行を追加">
                <Button variant="contained" onClick={() => addLine("column")}>
                  +
                </Button>
              </Tooltip>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
