import ExplorePdfUrls from "@/components/modules/ExplorePdfUrls";
import { Divider, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { useState } from "react";

export default function Explore() {
  const [pdfUrls, setPdfUrls] = useState<string[]>([]);
  return (
    <>
      <ExplorePdfUrls pdfUrls={pdfUrls} setPdfUrls={setPdfUrls} />
      <Divider />
      <List>
        {Array.from(pdfUrls).map((pdfUrl, index) => (
          <ListItem key={`pdf-url-${index}`}>
            <ListItemButton component="a" href={pdfUrl} target="_blank">
              <ListItemText>{pdfUrl}</ListItemText>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  )
}
