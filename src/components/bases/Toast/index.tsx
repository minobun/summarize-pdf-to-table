import { Alert, Snackbar } from '@mui/material';
import { ReactElement } from 'react';

export type Severity = "success" | "info" | "warning" | "error";

type ToastProps = {
    open: boolean;
    message: string;
    severity: Severity;
    hideToast: () => void;
}

export default function Toast(props: ToastProps): ReactElement {
    const { open, message, severity, hideToast } = props;
    return (
        <Snackbar open={open} autoHideDuration={6000} onClose={hideToast}>
            <Alert onClose={hideToast} severity={severity} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    );
};
