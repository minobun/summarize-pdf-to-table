export type Info = {
  [key in string]: {
    [key in string]: string;
  };
};

export type Header = {
  title: string;
  key: string;
};

export type Mode = "guide" | "rule" | "release";
