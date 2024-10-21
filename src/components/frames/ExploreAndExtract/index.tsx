import ExplorePdfUrls from "@/components/modules/ExplorePdfUrls";
import ExtractTable from "@/components/modules/ExtractTable";
import UrlListPicker from "@/components/modules/UrlListPicker";
import { useToastContext } from "@/providers/ToastProvider";
import { Divider } from "@mui/material";
import { useState } from "react";

export default function Extract() {
    const [pdfUrls, setPdfUrls] = useState<string[]>([]);
    const [pdfUrlsFiltered, setPdfUrlsFiltered] = useState<string[]>([]);
    const { showToast } = useToastContext();

    const filterPdfUrls = (pdfUrl: string): void => {
        setPdfUrlsFiltered((currentPdfUrls) => {
            if (currentPdfUrls.includes(pdfUrl))
                return currentPdfUrls.filter((currentPdfUrl) => currentPdfUrl !== pdfUrl);
            else if (currentPdfUrls.length >= 10) {
                showToast("warning", "10個以上のファイルは選択できません。")
                return currentPdfUrls;
            }
            else return [...currentPdfUrls, pdfUrl]
        })
    }

    return (
        <>
            <ExplorePdfUrls pdfUrls={pdfUrls} setPdfUrls={setPdfUrls} />
            <Divider />
            <UrlListPicker items={pdfUrls} itemsSelected={pdfUrlsFiltered} selectItem={filterPdfUrls} />
            <Divider />
            <ExtractTable pdfUrls={pdfUrlsFiltered} />
        </>
    );
}
