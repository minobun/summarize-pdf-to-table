import { Modal as BaseModal, Box } from "@mui/material";
import { ReactElement } from "react";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    maxHeight: "50vh",
    overflow: "auto"
};

export default function Modal(props: { isOpen: boolean, onClose: () => void, children: ReactElement }): ReactElement {
    const { isOpen, onClose, children } = props
    return (
        <BaseModal open={isOpen} onClose={onClose}>
            <Box sx={style}>
                {children}
            </Box>
        </BaseModal>
    )
}