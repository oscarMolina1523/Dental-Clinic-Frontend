import type { TableColumn } from "../../shared/Table/types";

interface TableSkeletonProps<T> {
    columns: TableColumn<T>[];
    rows?: number;
    actions?: boolean;
}

const TableSkeleton = <T,>({
    columns,
    rows = 10,
    actions = false,
}: TableSkeletonProps<T>) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full table-fixed text-left border-collapse">

                {/* HEADER */}
                <thead>
                    <tr className="text-slate-400 text-xs font-medium border-b border-slate-100">

                        {columns.map((column) => (
                            <th
                                key={column.key}
                                className={`pb-3 font-normal ${
                                    column.className ?? ""
                                }`}
                            >
                                <div className="h-3 w-20 rounded bg-slate-200 animate-pulse" />
                            </th>
                        ))}

                        {actions && (
                            <th className="pb-3 pr-2 text-right font-normal">
                                <div className="ml-auto h-3 w-10 rounded bg-slate-200 animate-pulse" />
                            </th>
                        )}

                    </tr>
                </thead>

                {/* BODY */}
                <tbody className="divide-y divide-slate-50">

                    {Array.from({ length: rows }).map((_, rowIndex) => (
                        <tr key={rowIndex}>

                            {columns.map((column) => (
                                <td
                                    key={column.key}
                                    className={`py-3.5 ${
                                        column.className ?? ""
                                    }`}
                                >
                                    <div
                                        className={`
                                            h-4
                                            rounded
                                            bg-slate-200
                                            animate-pulse
                                            ${
                                                column.skeletonClassName ??
                                                "w-20"
                                            }
                                        `}
                                    />
                                </td>
                            ))}

                            {actions && (
                                <td className="py-3.5 pr-2">
                                    <div className="flex items-center justify-end gap-1">
                                        <div className="h-6 w-6 rounded-lg bg-slate-200 animate-pulse" />
                                    </div>
                                </td>
                            )}

                        </tr>
                    ))}

                </tbody>
            </table>
        </div>
    );
};

export default TableSkeleton;