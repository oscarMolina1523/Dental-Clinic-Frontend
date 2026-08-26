import { MoreVertical } from "lucide-react";
import type {
    DataTableProps,
} from "./types";

const DataTable = <T,>({
    data,
    columns,
    getRowId,
    actions,
    loading = false,
    emptyMessage = "No hay registros para mostrar.",
}: DataTableProps<T>) => {

    return (
        <div className="overflow-x-auto">

            <table className="w-full text-left border-collapse">

                {/* HEADER */}
                <thead>
                    <tr className="text-slate-400 text-xs font-medium border-b border-slate-100">

                        {columns.map((column) => (
                            <th
                                key={column.key}
                                className={`pb-3 font-normal ${column.className ?? ""}`}
                            >
                                {column.header}
                            </th>
                        ))}

                        {actions && actions.length > 0 && (
                            <th className="pb-3 pr-2 text-right font-normal">
                            </th>
                        )}

                    </tr>
                </thead>

                {/* BODY */}
                <tbody className="divide-y divide-slate-50">

                    {loading ? (

                        <tr>
                            <td
                                colSpan={
                                    columns.length +
                                    (actions ? 1 : 0)
                                }
                                className="py-10 text-center text-sm text-slate-400"
                            >
                                Cargando...
                            </td>
                        </tr>

                    ) : data.length === 0 ? (

                        <tr>
                            <td
                                colSpan={
                                    columns.length +
                                    (actions ? 1 : 0)
                                }
                                className="py-10 text-center text-sm text-slate-400"
                            >
                                {emptyMessage}
                            </td>
                        </tr>

                    ) : (

                        data.map((item, index) => (

                            <tr
                                key={getRowId(item)}
                                className="hover:bg-slate-50/60 transition-colors"
                            >

                                {columns.map((column) => (

                                    <td
                                        key={column.key}
                                        className={`py-3.5 ${column.className ?? ""}`}
                                    >
                                        {column.render
                                            ? column.render(item, index)
                                            : null}
                                    </td>

                                ))}

                                {/* ACTIONS */}
                                {actions && actions.length > 0 && (

                                    <td className="py-3.5 pr-2 text-right">

                                        <div className="flex items-center justify-end gap-1">

                                            {actions.map((action, actionIndex) => (

                                                <button
                                                    key={actionIndex}
                                                    onClick={() =>
                                                        action.onClick(item)
                                                    }
                                                    title={action.label}
                                                    className={
                                                        action.className ??
                                                        "p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                                                    }
                                                >
                                                    {action.icon ?? (
                                                        <MoreVertical className="w-4 h-4" />
                                                    )}
                                                </button>

                                            ))}

                                        </div>

                                    </td>

                                )}

                            </tr>

                        ))

                    )}

                </tbody>

            </table>

        </div>
    );
};

export default DataTable;