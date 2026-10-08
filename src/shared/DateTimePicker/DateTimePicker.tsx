import React from "react";

interface DateTimePickerProps {
    label: string;
    value: string;
    onChange: (newValue: string) => void;
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
    label,
    value,
    onChange,
}) => {
    const datePart = value ? value.split("T")[0] : "";
    const timePart = value?.split("T")[1] || "08:00";
    const [h, m] = timePart.split(":");

    const hours24 = parseInt(h || "8", 10);

    // Conversión a formato 12 horas
    const hours12 = hours24 % 12 || 12;
    const current12Str = hours12 < 10 ? `0${hours12}` : `${hours12}`;
    const isPM = hours24 >= 12;

    const getLocalDate = () => {
        const now = new Date();

        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    const handleDateChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const dateVal = e.target.value;

        onChange(
            dateVal
                ? `${dateVal}T${timePart}`
                : ""
        );
    };

    const handleHourChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const selected12 = parseInt(e.target.value, 10);
        const currentDate = datePart || getLocalDate();

        let new24 = selected12;

        if (isPM && selected12 < 12) {
            new24 += 12;
        }

        if (!isPM && selected12 === 12) {
            new24 = 0;
        }

        const finalH = String(new24).padStart(2, "0");

        onChange(
            `${currentDate}T${finalH}:${m || "00"}`
        );
    };

    const handleMinuteChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const currentDate = datePart || getLocalDate();
        const formattedH = String(hours24).padStart(2, "0");

        onChange(
            `${currentDate}T${formattedH}:${e.target.value}`
        );
    };

    const handlePeriodChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const newIsPM = e.target.value === "PM";
        const currentDate = datePart || getLocalDate();

        let updated24 = hours24;

        if (newIsPM && hours24 < 12) {
            updated24 += 12;
        }

        if (!newIsPM && hours24 >= 12) {
            updated24 -= 12;
        }

        /*
         * AM solamente permite 8:00 - 11:59
         * PM solamente permite 12:00 - 17:00
         */

        if (!newIsPM && updated24 < 8) {
            updated24 = 8;
        }

        if (newIsPM && updated24 < 12) {
            updated24 = 12;
        }

        if (newIsPM && updated24 > 17) {
            updated24 = 17;
        }

        const finalH = String(updated24).padStart(2, "0");

        onChange(
            `${currentDate}T${finalH}:${m || "00"}`
        );
    };

    /*
     * Horas disponibles dependiendo de AM / PM
     *
     * AM -> 08, 09, 10, 11
     * PM -> 12, 01, 02, 03, 04, 05
     */
    const availableHours = isPM
        ? [12, 1, 2, 3, 4, 5]
        : [8, 9, 10, 11];

    return (
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
                {label}
            </label>

            <div className="flex flex-col gap-2">

                {/* Fecha */}
                <input
                    type="date"
                    value={datePart}
                    onChange={handleDateChange}
                    className="
                        w-full
                        px-3 py-2.5
                        border border-slate-200
                        rounded-lg
                        text-sm
                        outline-none
                        focus:border-blue-500
                        focus:ring-2
                        focus:ring-blue-500/10
                    "
                />

                {/* Hora + Minutos + AM/PM */}
                <div className="grid grid-cols-3 gap-2">

                    {/* Hora */}
                    <select
                        value={current12Str}
                        onChange={handleHourChange}
                        className="
                            px-3 py-2.5
                            border border-slate-200
                            rounded-lg
                            text-sm
                            bg-white
                            outline-none
                            focus:border-blue-500
                        "
                    >
                        {availableHours.map((hour) => {
                            const value = String(hour).padStart(2, "0");

                            return (
                                <option
                                    key={value}
                                    value={value}
                                >
                                    {value}
                                </option>
                            );
                        })}
                    </select>

                    {/* Minutos */}
                    <select
                        value={m || "00"}
                        onChange={handleMinuteChange}
                        className="
                            px-3 py-2.5
                            border border-slate-200
                            rounded-lg
                            text-sm
                            bg-white
                            outline-none
                            focus:border-blue-500
                        "
                    >
                        {Array.from({ length: 60 }, (_, i) => {
                            const minute = String(i).padStart(2, "0");

                            return (
                                <option
                                    key={minute}
                                    value={minute}
                                >
                                    {minute}
                                </option>
                            );
                        })}
                    </select>

                    {/* AM / PM */}
                    <select
                        value={isPM ? "PM" : "AM"}
                        onChange={handlePeriodChange}
                        className="
                            px-3 py-2.5
                            border border-slate-200
                            rounded-lg
                            text-sm
                            bg-white
                            outline-none
                            focus:border-blue-500
                            font-medium
                        "
                    >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                    </select>

                </div>
            </div>
        </div>
    );
};