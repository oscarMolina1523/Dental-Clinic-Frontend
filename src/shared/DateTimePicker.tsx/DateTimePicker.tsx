import React from "react";

// Subcomponente reutilizable para evitar duplicar lógica entre start y end time
interface DateTimePickerProps {
    label: string;
    value: string;
    onChange: (newValue: string) => void;
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({ label, value, onChange }) => {
    const datePart = value ? value.split("T")[0] : "";
    const timePart = value?.split("T")[1] || "09:00";
    const [h, m] = timePart.split(":");
    const hours24 = parseInt(h || "9", 10);

    // Conversión a formato 12 horas
    const hours12 = hours24 % 12 || 12;
    const current12Str = hours12 < 10 ? `0${hours12}` : `${hours12}`;
    const isPM = hours24 >= 12;

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const dateVal = e.target.value;
        onChange(dateVal ? `${dateVal}T${timePart}` : "");
    };

    const handleHourChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected12 = parseInt(e.target.value, 10);
        const currentDate = datePart || new Date().toISOString().split("T")[0];

        let new24 = selected12;
        if (isPM && selected12 < 12) new24 += 12;
        if (!isPM && selected12 === 12) new24 = 0;

        const finalH = new24 < 10 ? `0${new24}` : `${new24}`;
        onChange(`${currentDate}T${finalH}:${m || "00"}`);
    };

    const handleMinuteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const currentDate = datePart || new Date().toISOString().split("T")[0];
        const formattedH = hours24 < 10 ? `0${hours24}` : `${hours24}`;
        onChange(`${currentDate}T${formattedH}:${e.target.value}`);
    };

    const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newIsPM = e.target.value === "PM";
        const currentDate = datePart || new Date().toISOString().split("T")[0];

        let updated24 = hours24;
        if (newIsPM && hours24 < 12) updated24 += 12;
        if (!newIsPM && hours24 >= 12) updated24 -= 12;

        const finalH = updated24 < 10 ? `0${updated24}` : `${updated24}`;
        onChange(`${currentDate}T${finalH}:${m || "00"}`);
    };

    return (
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
                {label}
            </label>

            <div className="flex flex-col gap-2">
                {/* Input de Fecha */}
                <input
                    type="date"
                    value={datePart}
                    onChange={handleDateChange}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                />

                {/* Selectores Horas + Minutos + AM/PM */}
                <div className="grid grid-cols-3 gap-2">
                    {/* Hora (01 - 12) */}
                    <select
                        value={current12Str}
                        onChange={handleHourChange}
                        className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-white outline-none focus:border-blue-500"
                    >
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => {
                            const val = h < 10 ? `0${h}` : `${h}`;
                            return <option key={val} value={val}>{val}</option>;
                        })}
                    </select>

                    {/* Minutos */}
                    <select
                        value={m || "00"}
                        onChange={handleMinuteChange}
                        className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-white outline-none focus:border-blue-500"
                    >
                        {["00", "15", "30", "45"].map((minute) => (
                            <option key={minute} value={minute}>{minute}</option>
                        ))}
                    </select>

                    {/* Período (AM/PM) */}
                    <select
                        value={isPM ? "PM" : "AM"}
                        onChange={handlePeriodChange}
                        className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-white outline-none focus:border-blue-500 font-medium"
                    >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                    </select>
                </div>
            </div>
        </div>
    );
};