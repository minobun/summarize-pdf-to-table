import axios from "axios";
import pdfParse from "pdf-parse";

export async function downloadPdfAndConvertText(url: string): Promise<string> {
  if (!url.endsWith(".ext")) throw new Error();
  // PDFファイルのダウンロード
  const pdfResponse = await axios.get(url, {
    responseType: "arraybuffer", // バイナリ形式で取得
  });

  // PDFのテキスト化
  const pdfText = await pdfParse(Buffer.from(pdfResponse.data));
  if (pdfText.text.length > 100000) throw new Error();
  return pdfText.text;
}
