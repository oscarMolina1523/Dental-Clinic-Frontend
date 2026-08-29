import React, { useEffect, useState, useCallback } from "react";
import { Check, AlertCircle, X } from "lucide-react";

export type ToastType = "success" | "error";

interface ToastProps {
    type: ToastType;
    message: string;
    onClose: () => void;
    duration?: number;
}

const Toast: React.FC<ToastProps> = ({
    type,
    message,
    onClose,
    duration = 3000,
}) => {
    const [isVisible, setIsVisible] = useState(false);

    // 1. Declaramos handleClose primero
    const handleClose = useCallback(() => {
        setIsVisible(false);
        setTimeout(() => {
            onClose();
        }, 300);
    }, [onClose]);

    // 2. Usamos useEffect después de definir handleClose
    useEffect(() => {
        const animationFrame = requestAnimationFrame(() => {
            setIsVisible(true);
        });

        const timer = setTimeout(() => {
            handleClose();
        }, duration);

        return () => {
            cancelAnimationFrame(animationFrame);
            clearTimeout(timer);
        };
    }, [duration, handleClose]);

    const isSuccess = type === "success";

    return (
        <div className="fixed top-10 right-5 z-100 pointer-events-none">
            <div
                className={`
                    pointer-events-auto
                    flex items-start gap-3
                    min-w-[320px] max-w-105
                    p-4 rounded-md shadow-lg
                    border-l-4 overflow-hidden
                    transition-all duration-300 ease-out
                    ${isVisible
                                    ? "opacity-100 translate-y-0 scale-100"
                                    : "opacity-0 translate-y-4 scale-95"
                                }
                    ${isSuccess
                                    ? "bg-[#d4edda] border-l-[#28a745] text-[#155724]"
                                    : "bg-[#f8d7da] border-l-[#dc3545] text-[#721c24]"
                                }
                    `}
            >
                <div className="pt-0.5">
                    {isSuccess ? (
                        <Check className="w-5 h-5 text-[#28a745] stroke-[2.5]" />
                    ) : (
                        <AlertCircle className="w-5 h-5 text-[#dc3545] stroke-[2.5]" />
                    )}
                </div>

                <div className="flex-1">
                    <h4 className="font-bold text-sm leading-tight">
                        {isSuccess ? "Success" : "Error"}
                    </h4>
                    <p className="text-sm mt-1 opacity-90 leading-snug">
                        {message}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleClose}
                    className={`
                        p-1 rounded-full transition-colors cursor-pointer -mr-1 -mt-1
                        ${isSuccess
                            ? "hover:bg-green-200/60 text-[#155724]"
                            : "hover:bg-red-200/60 text-[#721c24]"
                        }
                    `}
                >
                    <X className="w-4 h-4 opacity-70 hover:opacity-100" />
                </button>
            </div>
        </div>
    );
};

export default Toast;