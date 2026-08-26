import React from "react";
import { Search, X } from "lucide-react";

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
    value,
    onChange,
    placeholder = "Buscar...",
}) => {

    return (
        <div className="relative w-full max-w-sm">

            <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
            />

            <input
                type="text"
                value={value}
                onChange={(event) =>
                    onChange(event.target.value)
                }
                placeholder={placeholder}
                className="
                    w-full
                    h-10
                    pl-9
                    pr-9
                    text-sm
                    text-slate-700
                    bg-slate-50
                    border
                    border-slate-200
                    rounded-xl
                    outline-none
                    transition-all
                    focus:bg-white
                    focus:border-blue-400
                    focus:ring-2
                    focus:ring-blue-100
                    placeholder:text-slate-400
                "
            />

            {value && (
                <button
                    type="button"
                    onClick={() => onChange("")}
                    className="
                        absolute
                        right-3
                        top-1/2
                        -translate-y-1/2
                        text-slate-400
                        hover:text-slate-600
                    "
                >
                    <X className="w-4 h-4" />
                </button>
            )}

        </div>
    );
};

export default SearchInput;