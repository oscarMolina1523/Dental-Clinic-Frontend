import React from "react";

interface DynamicListInputProps {
    label: string;
    items: string[];
    addLabel: string;
    placeholderPrefix: string;
    minHeightClass?: string;
    onAdd: () => void;
    onChange: (index: number, value: string) => void;
    onRemove: () => void;
}

export const DynamicListInput: React.FC<DynamicListInputProps> = ({
    label,
    items,
    addLabel,
    placeholderPrefix,
    minHeightClass = "min-h-20",
    onAdd,
    onChange,
    onRemove,
}) => {
    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-slate-700">{label}</label>

                {items.length === 0 && (
                    <button
                        type="button"
                        onClick={onAdd}
                        className="px-3 py-1.5 text-xs font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                    >
                        {addLabel}
                    </button>
                )}

                {items.length === 1 && (
                    <button
                        type="button"
                        onClick={onRemove}
                        className="px-3 py-2 text-xs text-red-500 border border-red-200 rounded-lg hover:bg-red-50 cursor-pointer"
                    >
                        Eliminar
                    </button>
                )}
            </div>

            {items.length > 0 && (
                <div className="space-y-3">
                    {items.map((item, index) => (
                        <div key={index} className="flex items-start gap-2">
                            <textarea
                                value={item}
                                onChange={(e) => onChange(index, e.target.value)}
                                placeholder={`${placeholderPrefix} ${index + 1}`}
                                className={`flex-1 ${minHeightClass} px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10`}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};