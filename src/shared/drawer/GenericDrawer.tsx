import React from "react";
import { X } from "lucide-react";

interface DrawerProps {
    isOpen: boolean;
    onHide: () => void;
    title: string;
    description?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    width?: string;
}

const GenericDrawer: React.FC<DrawerProps> = ({
    isOpen,
    onHide,
    title,
    description,
    children,
    footer,
    width = "w-112.5",
}) => {
    return (
        <>
            <div
                onClick={onHide}
                className={`
                    fixed inset-0 z-40
                    bg-black/30
                    transition-opacity duration-300
                    ${isOpen
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none"
                    }
                `}
            />

            <aside
                className={`
                    fixed top-0 right-0 z-50
                    h-screen
                    ${width}
                    bg-white
                    shadow-2xl
                    flex flex-col
                    transform
                    transition-transform
                    duration-300
                    ease-in-out
                    ${isOpen
                        ? "translate-x-0"
                        : "translate-x-full"
                    }
                `}
            >
                <div className="flex items-center justify-between px-6 py-5 border-b bg-[#001D4A] text-white">
                    <div>
                        <h2 className="text-lg font-semibold">
                            {title}
                        </h2>

                        {description && (
                            <p className="text-sm mt-1">
                                {description}
                            </p>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={onHide}
                        className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/10 cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {children}
                </div>

                {footer && (
                    <div className="border-t border-slate-100 px-6 py-4 flex justify-end gap-3">
                        {footer}
                    </div>
                )}
            </aside>
        </>
    );
};

export default GenericDrawer;