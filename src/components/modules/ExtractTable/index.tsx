import Loading from "@/components/bases/Loading";
import TableComponent from "@/components/modules/TableComponent";
import TableExport from "@/components/modules/TableExport";
import { useToastContext } from "@/providers/ToastProvider";
import { extractInformationBasedOnHeadersFromPdfUrls } from "@/services/client/extract";
import { guessHeadersFromPdfUrls } from "@/services/client/guess";
import { TableRow } from "@/types";
import { Button, ButtonGroup, Divider } from "@mui/material";
import { useCallback, useState } from "react";

export default function ExtractTable(props: { pdfUrls: string[] }) {
    const { pdfUrls } = props;
    const [result, setResult] = useState<TableRow[]>([]);
    const [isLoading, setIsLoading] = useState<"guess" | "extract" | undefined>(
        undefined
    );
    const { showToast } = useToastContext();

    const handleGuess = async () => {
        setIsLoading("guess");
        try {
            const data = await guessHeadersFromPdfUrls(pdfUrls);
            setResult([
                { title: data.tableTitle, ...data.columnHeaders },
                ...data.rowHeaders.map((rowHeader) => ({ title: rowHeader })),
            ]);
            showToast("success", "カラムを作成しました。");
        } catch (error) {
            console.error("Failed to guess headers.");
            showToast("error", "カラム作成に失敗しました。");
        }
        setIsLoading(undefined);
    };

    const handleExtract = async () => {
        setIsLoading("extract");
        try {
            const data = await extractInformationBasedOnHeadersFromPdfUrls(
                result,
                pdfUrls
            );
            setResult((cur) => [cur[0], ...data]);
            showToast("success", "データを抽出しました。");
        } catch (error) {
            console.error("Failed to guess headers.");
            showToast("error", "データの抽出に失敗しました。");
        }
        setIsLoading(undefined);
    };

    const addRow = useCallback(() => {
        setResult((cur) => [...cur, { title: "" }]);
    }, [setResult]);

    return (
        <>
            <ButtonGroup>
                <Button
                    variant="outlined"
                    disabled={
                        !!isLoading || pdfUrls.length === 0 || !pdfUrls.every((pdfUrl) => pdfUrl.endsWith(".pdf"))
                    }
                    onClick={handleGuess}
                >
                    カラム作成
                </Button>
                <Button
                    variant="outlined"
                    disabled={
                        !!isLoading ||
                        result.length < 2 ||
                        !pdfUrls.every((pdfUrl) => pdfUrl.endsWith(".pdf"))
                    }
                    onClick={handleExtract}
                >
                    データ抽出
                </Button>
            </ButtonGroup>
            <>
                {isLoading === "guess" && <Loading label="カラム情報を作成中です..." />}
                {isLoading === "extract" && (
                    <Loading label="テーブル情報を作成中です..." />
                )}
            </>
            <TableComponent data={result} setData={setResult} />
            <ButtonGroup>
                <Button
                    variant="outlined"
                    disabled={!!isLoading || result.length >= 20}
                    onClick={addRow}
                >
                    行を追加
                </Button>
            </ButtonGroup>
            <Divider />
            <TableExport result={result} />
        </>
    );
}
