import { useMemo, useState } from "react";

interface SearchableSelectProps<T> {
    label: string;
    value: string;
    items: readonly T[];

    getOptionValue: (item: T) => string | number;
    getOptionLabel: (item: T) => string;

    onChange: (item: T) => void;

    placeholder?: string;
    searchPlaceholder?: string;
    noResultsMessage?: string;
    disabled?: boolean;
}

const SearchableSelect = <T,>(
    {
        label,
        value,
        items,
        getOptionValue,
        getOptionLabel,
        onChange,
        placeholder = "Seleccione una opción",
        searchPlaceholder = "Buscar...",
        noResultsMessage = "No se encontraron resultados.",
        disabled = false,
    }: SearchableSelectProps<T>
) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");

    const normalizeText = (text: string) =>
        text
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

    const filteredItems = useMemo(() => {
        const normalizedSearch = normalizeText(search);

        return items.filter((item) =>
            normalizeText(getOptionLabel(item)).includes(
                normalizedSearch
            )
        );
    }, [items, search, getOptionLabel]);

    const selectedItem = items.find(
        (item) => String(getOptionValue(item)) === String(value)
    );

    const handleSelect = (item: T) => {
        onChange(item);

        setIsOpen(false);
        setSearch("");
    };

    return (
        <div className="relative">
            <label className="block text-sm font-medium text-slate-700 mb-2">
                {label}
            </label>

            <button
                type="button"
                disabled={disabled}
                onClick={() => setIsOpen((prev) => !prev)}
                className="
                    w-full
                    px-3 py-2.5
                    border border-slate-200
                    rounded-lg
                    text-sm
                    text-left
                    bg-white
                    outline-none
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-500/10
                    disabled:bg-slate-50
                    disabled:cursor-not-allowed
                "
            >
                <span
                    className={
                        selectedItem
                            ? "text-slate-700"
                            : "text-slate-400"
                    }
                >
                    {selectedItem
                        ? getOptionLabel(selectedItem)
                        : placeholder}
                </span>
            </button>

            {isOpen && (
                <div
                    className="
                        absolute
                        z-50
                        left-0
                        right-0
                        mt-1
                        bg-white
                        border border-slate-200
                        rounded-lg
                        shadow-lg
                        overflow-hidden
                    "
                >
                    {/* BUSCADOR FIJO */}
                    <div className="p-2 border-b border-slate-200 bg-white">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            placeholder={searchPlaceholder}
                            autoFocus
                            className="
                                w-full
                                px-3 py-2
                                border border-slate-200
                                rounded-md
                                text-sm
                                outline-none
                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-500/10
                            "
                        />
                    </div>

                    {/* SOLO LA LISTA HACE SCROLL */}
                    <div className="max-h-60 overflow-y-auto">
                        {filteredItems.length > 0 ? (
                            filteredItems.map((item) => {
                                const optionValue = String(
                                    getOptionValue(item)
                                );

                                const isSelected =
                                    optionValue === String(value);

                                return (
                                    <button
                                        key={optionValue}
                                        type="button"
                                        onClick={() =>
                                            handleSelect(item)
                                        }
                                        className={`
                                            w-full
                                            px-3 py-2.5
                                            text-left
                                            text-sm
                                            transition-colors
                                            cursor-pointer
                                            hover:bg-slate-50
                                            ${
                                                isSelected
                                                    ? "bg-blue-50 text-blue-700"
                                                    : "text-slate-700"
                                            }
                                        `}
                                    >
                                        {getOptionLabel(item)}
                                    </button>
                                );
                            })
                        ) : (
                            <div className="px-3 py-3 text-sm text-slate-400">
                                {noResultsMessage}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchableSelect;