import Toast, { Severity } from '@/components/bases/Toast';
import { createContext, ReactElement, ReactNode, useContext, useState } from 'react';

type ToastContextProps = {
    showToast: (severity: Severity, message: string) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const useToastContext = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToastContext must be used within a ToastProvider');
    }
    return context;
};

export default function ToastProvider(props: { children: ReactNode }): ReactElement {
    const { children } = props;
    const [open, setOpen] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const [severity, setSeverity] = useState<Severity>('success');

    const showToast = (severity: Severity, msg: string) => {
        setSeverity(severity);
        setMessage(msg);
        setOpen(true);
    };

    const hideToast = () => {
        setOpen(false);
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <Toast open={open} severity={severity} message={message} hideToast={hideToast} />
        </ToastContext.Provider>
    );
}