import { ColumnHeader, TableRow } from "@/types";
import { Dispatch, ReactElement, useMemo } from "react";
import {
  DynamicDataSheetGrid,
  keyColumn,
  textColumn,
} from "react-datasheet-grid";

import "react-datasheet-grid/dist/style.css";

export default function TableComponent(props: {
  data: TableRow[];
  setData: Dispatch<TableRow[]>;
}): ReactElement {
  const { data, setData } = props;
  const columns = useMemo(() => {
    if (data && data.length > 0) {
      return [
        { ...keyColumn("title", textColumn), title: "タイトル" },
        ...Object.keys(data[0]).map((_, i) => ({
          ...keyColumn(`column-${i + 1}` as ColumnHeader, textColumn),
          title: `カラム${i + 1}`,
        })),
      ];
    }
    return [];
  }, [data]);

  return (
    <DynamicDataSheetGrid
      value={data}
      onChange={setData}
      columns={columns}
      lockRows
    />
  );
}
