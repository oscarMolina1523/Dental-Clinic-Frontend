import React, { useEffect } from "react";

interface DateTimePickerProps {
    label: string;
    value: string;
    onChange: (newValue: string) => void;
    endValue?: string;
    onEndChange?: (newValue: string) => void;
}

interface TimeSelectorProps {
    value: string;
    datePart: string;
    onChange: (newValue: string) => void;
}

const getLocalDate = () => {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

// Solo permite horas entre 08:00 y 17:59.
const getValidTime = (timePart: string): string => {
    const [rawHour, rawMinute] = (timePart || "08:00").split(":");

    let hour = Number(rawHour);
    let minute = Number(rawMinute);

    if (!Number.isInteger(hour) || hour < 8) {
        hour = 8;
    } else if (hour > 17) {
        hour = 17;
    }

    if (!Number.isInteger(minute) || minute < 0 || minute > 59) {
        minute = 0;
    }

    return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
};

const TimeSelector: React.FC<TimeSelectorProps> = ({
    value,
    datePart,
    onChange,
}) => {
    const timePart = getValidTime(value?.split("T")[1] || "08:00");
    const [h, m] = timePart.split(":");

    const hours24 = Number(h);
    const hours12 = hours24 % 12 || 12;
    const current12Str = String(hours12).padStart(2, "0");
    const isPM = hours24 >= 12;

    const currentDate = datePart || getLocalDate();

    const handleHourChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const selected12 = Number(e.target.value);

        let new24: number;

        if (isPM) {
            new24 = selected12 === 12 ? 12 : selected12 + 12;
        } else {
            new24 = selected12 === 12 ? 0 : selected12;
        }

        // El horario permitido es de 08:00 a 17:59.
        new24 = Math.max(8, Math.min(17, new24));

        const finalH = String(new24).padStart(2, "0");

        onChange(`${currentDate}T${finalH}:${m}`);
    };

    const handleMinuteChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const formattedH = String(hours24).padStart(2, "0");

        onChange(
            `${currentDate}T${formattedH}:${e.target.value}`
        );
    };

    const handlePeriodChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const newIsPM = e.target.value === "PM";

        let updated24 = hours24;

        if (newIsPM && updated24 < 12) {
            updated24 += 12;
        }

        if (!newIsPM && updated24 >= 12) {
            updated24 -= 12;
        }

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

        onChange(`${currentDate}T${finalH}:${m}`);
    };

    const availableHours = isPM
        ? [12, 1, 2, 3, 4, 5]
        : [8, 9, 10, 11];

    return (
        <div className="grid grid-cols-3 gap-2">
            <select
                value={current12Str}
                onChange={handleHourChange}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-white outline-none focus:border-blue-500"
            >
                {availableHours.map((hour) => {
                    const hourValue = String(hour).padStart(2, "0");

                    return (
                        <option key={hourValue} value={hourValue}>
                            {hourValue}
                        </option>
                    );
                })}
            </select>

            <select
                value={m}
                onChange={handleMinuteChange}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-white outline-none focus:border-blue-500"
            >
                {Array.from({ length: 60 }, (_, i) => {
                    const minute = String(i).padStart(2, "0");

                    return (
                        <option key={minute} value={minute}>
                            {minute}
                        </option>
                    );
                })}
            </select>

            <select
                value={isPM ? "PM" : "AM"}
                onChange={handlePeriodChange}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-white outline-none focus:border-blue-500 font-medium"
            >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
            </select>
        </div>
    );
};

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
    label,
    value,
    onChange,
    endValue,
    onEndChange,
}) => {
    const isRangeMode =
        endValue !== undefined && onEndChange !== undefined;

    const datePart = value?.split("T")[0] || "";

    useEffect(() => {
        const initialDate = datePart || getLocalDate();

        const normalizedStart =
            `${initialDate}T${getValidTime(value?.split("T")[1] || "08:00")}`;

        if (value !== normalizedStart) {
            onChange(normalizedStart);
        }

        if (isRangeMode) {
            const normalizedEnd =
                `${initialDate}T${getValidTime(endValue?.split("T")[1] || "08:30")}`;

            if (endValue !== normalizedEnd) {
                onEndChange(normalizedEnd);
            }
        }
    }, [
        datePart,
        value,
        endValue,
        isRangeMode,
        onChange,
        onEndChange,
    ]);

    const handleDateChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const newDate = e.target.value;

        if (!newDate) {
            onChange("");

            if (isRangeMode) {
                onEndChange("");
            }

            return;
        }

        const startTime = getValidTime(
            value?.split("T")[1] || "08:00"
        );

        onChange(`${newDate}T${startTime}`);

        if (isRangeMode) {
            const endTime = getValidTime(
                endValue?.split("T")[1] || "08:00"
            );

            onEndChange(`${newDate}T${endTime}`);
        }
    };

    const handleEndTimeChange = (newValue: string) => {
        if (!isRangeMode) return;

        const timePart = getValidTime(
            newValue.split("T")[1] || "08:00"
        );

        const sharedDate = datePart || getLocalDate();

        onEndChange(`${sharedDate}T${timePart}`);
    };

    return (
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
                {label}
            </label>

            <div className="flex flex-col gap-2">
                <input
                    type="date"
                    value={datePart}
                    onChange={handleDateChange}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                />

                {isRangeMode ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Hora de inicio *
                            </label>

                            <TimeSelector
                                value={value}
                                datePart={datePart}
                                onChange={onChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Hora de finalización *
                            </label>

                            <TimeSelector
                                value={endValue}
                                datePart={datePart}
                                onChange={handleEndTimeChange}
                            />
                        </div>
                    </div>
                ) : (
                    <TimeSelector
                        value={value}
                        datePart={datePart}
                        onChange={onChange}
                    />
                )}
            </div>
        </div>
    );
};