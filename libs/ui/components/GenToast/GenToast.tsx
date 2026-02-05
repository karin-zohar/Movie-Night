import type { FC } from 'react';
import './gen-toast.style.css';
import type { ToastType } from '@/libs/hooks/useToast/useToast';
import clsx from 'clsx';

type GenToastProps = {
    text: string;
    type: ToastType;
};

const GenToast: FC<GenToastProps> = ({ text, type }) => {
    const { theme } = {theme: 'light'};
    return (
        <div className={clsx('gen-toast')}>
            <div className={clsx('gen-toast-message', type, 'theme', theme)}>
                <span className="gen-toast-message-text">{text}</span>
            </div>
        </div>
    );
};

export default GenToast;
