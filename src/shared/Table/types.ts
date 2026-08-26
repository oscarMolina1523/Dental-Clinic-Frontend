import type { ReactNode } from "react";

export interface TableColumn<T> {
    key: string;
    header: string;

    /**
     * Permite decidir qué mostrar en cada celda.
     */
    render?: (item: T, index: number) => ReactNode;

    /**
     * Clases adicionales para la columna.
     */
    className?: string;
}

export interface TableAction<T> {
    label: string;
    icon?: ReactNode;

    /**
     * Función que se ejecutará desde el componente padre.
     */
    onClick: (item: T) => void;

    className?: string;
}

export interface DataTableProps<T> {
    data: T[];
    columns: TableColumn<T>[];

    /**
     * Identificador único de cada fila.
     */
    getRowId: (item: T) => string | number;

    /**
     * Acciones opcionales por fila.
     */
    actions?: TableAction<T>[];

    /**
     * Mostrar estado de carga.
     */
    loading?: boolean;

    /**
     * Texto cuando no existen registros.
     */
    emptyMessage?: string;
}