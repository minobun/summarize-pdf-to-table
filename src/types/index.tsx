export type ColumnHeader =
  | "column-1"
  | "column-2"
  | "column-3"
  | "column-4"
  | "column-5"
  | "column-6"
  | "column-7"
  | "column-8"
  | "column-9"
  | "column-10"
  | "column-11"
  | "column-12"
  | "column-13"
  | "column-14"
  | "column-15"
  | "column-16"
  | "column-17"
  | "column-18"
  | "column-19"
  | "column-20"
  | "title";

export type TableRow = {
  [key in ColumnHeader]?: string;
};

export type ExtractResult = TableRow[];

export type GuessResult = {
  tableTitle: string;
  rowHeaders: string[];
  columnHeaders: string[];
};

export type ExploreResult = {
  targetUrls: string[];
  urlsExplored: string[];
  pdfUrls: string[];
};

export type Mode = "guide" | "rule" | "release";
