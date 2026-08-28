import { useEffect, useMemo, useState } from "react";

type SearchField<T> = keyof T;

const normalizeValue = (value: unknown): string => {
    if (value === null || value === undefined) {
        return "";
    }

    if (value instanceof Date) {
        return value.toLocaleString("es-ES");
    }

    if (typeof value === "boolean") {
        return value ? "activo true si" : "inactivo false no";
    }

    if (typeof value === "number") {
        return String(value);
    }

    return String(value);
};

const normalizeText = (value: unknown): string => {
    return normalizeValue(value)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
};

const itemMatchesSearch = <T,>(
    item: T,
    search: string,
    fields: SearchField<T>[]
): boolean => {

    if (!search.trim()) {
        return true;
    }

    const normalizedSearch = normalizeText(search);

    return fields.some((field) => {

        const value = item[field];

        return normalizeText(value)
            .includes(normalizedSearch);
    });
};

export const filterData = <T,>(
    data: T[],
    search: string,
    fields: SearchField<T>[]
): T[] => {

    if (!search.trim()) {
        return data;
    }

    return data.filter((item) =>
        itemMatchesSearch(
            item,
            search,
            fields
        )
    );
};

interface UseTableSearchProps<T> {
    data: T[];

    /**
     * Campos que serán utilizados para la búsqueda.
     */
    fields: SearchField<T>[];

    /**
     * Tiempo de espera después de que el usuario
     * deja de escribir.
     */
    delay?: number;
}

interface UseTableSearchResult<T> {
    search: string;

    debouncedSearch: string;

    setSearch: (value: string) => void;

    filteredData: T[];
}

export const useTableSearch = <T,>({
    data,
    fields,
    delay = 800,
}: UseTableSearchProps<T>): UseTableSearchResult<T> => {

    const [search, setSearch] = useState("");

    const [debouncedSearch, setDebouncedSearch] =
        useState("");

    useEffect(() => {

        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, delay);

        return () => {
            clearTimeout(timer);
        };

    }, [search, delay]);

    const filteredData = useMemo(() => {

        return filterData(
            data,
            debouncedSearch,
            fields
        );

    }, [
        data,
        debouncedSearch,
        fields,
    ]);

    return {
        search,
        debouncedSearch,
        setSearch,
        filteredData,
    };
};