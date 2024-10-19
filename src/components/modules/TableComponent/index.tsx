import { ColumnHeader, TableRow } from "@/types";
import { Dispatch, ReactElement, useMemo } from "react";
import { DynamicDataSheetGrid, keyColumn, textColumn } from "react-datasheet-grid";

import 'react-datasheet-grid/dist/style.css';

export default function TableComponent(props: {
  tableTitle: string;
  columnHeaders: string[];
  data: TableRow[];
  setData: Dispatch<TableRow[]>;
}): ReactElement {
  const { tableTitle, columnHeaders, data, setData } = props;
  const columns = useMemo(() => {
    if (columnHeaders && tableTitle) {
      return [{ ...keyColumn('title', textColumn), title: tableTitle },
      ...columnHeaders.map((columnHeader, i) => ({
        ...keyColumn(`column-${i + 1}` as ColumnHeader, textColumn),
        title: columnHeader
      }))
      ];
    }
    return [];
  }, [columnHeaders, tableTitle]);

  return (
    <DynamicDataSheetGrid value={data} onChange={setData} columns={columns} lockRows />
  );
}
