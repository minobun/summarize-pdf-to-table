import { DeleteForever } from "@mui/icons-material";
import { Button, ButtonGroup, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput } from "@mui/material";
import { ReactElement } from "react";

const MAX_PDF_URLS = 10

export default function PdfUrlsImport(props: { pdfUrls: string[], setPdfUrls: (pdfUrls: string[]) => void }): ReactElement {
    const { pdfUrls, setPdfUrls } = props;
    return (
        <>
            {pdfUrls.map((pdfUrl, index) => (
                <FormControl
                    key={`pdf-url-control-${index}`}
                    sx={{ m: 1 }}
                    variant="outlined"
                    fullWidth
                >
                    <InputLabel htmlFor={`pdf-url-${index}`}>
                        抽出したいPDFのURL
                    </InputLabel>
                    <OutlinedInput
                        id={`pdf-url-${index}`}
                        error={!pdfUrl.endsWith(".pdf")}
                        value={pdfUrl}
                        type="text"
                        onChange={(e) =>
                            setPdfUrls(pdfUrls.map((item, i) => (i === index ? e.target.value : item))
                            )
                        }
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    disabled={pdfUrls.length <= 1}
                                    onClick={() =>
                                        setPdfUrls(pdfUrls.filter((_, i) => i !== index))
                                    }
                                    edge="end"
                                >
                                    <DeleteForever />
                                </IconButton>
                            </InputAdornment>
                        }
                        label="抽出したいPDFのURL"
                    />
                </FormControl>
            ))}
            <ButtonGroup>
                <Button
                    variant="outlined"
                    onClick={() => setPdfUrls([...pdfUrls, ""])}
                    disabled={pdfUrls.length >= MAX_PDF_URLS}
                >
                    追加
                </Button>
            </ButtonGroup>
        </>
    )
}