interface ReadOnlyTimeProps {
    value?: string;
}

export const ReadOnlyTime: React.FC<ReadOnlyTimeProps> = ({ value }) => {
    const timePart = value?.split("T")[1]?.slice(0, 5) || "--:--";
    const [hourPart, minutePart] = timePart.split(":");

    const hour24 = Number(hourPart);
    const validHour = Number.isInteger(hour24) && hour24 >= 0 && hour24 <= 23;

    const hour12 = validHour ? hour24 % 12 || 12 : "--";
    const period = validHour ? (hour24 >= 12 ? "PM" : "AM") : "";

    return (
        <div className="grid grid-cols-3 gap-2">
            <div className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-500">
                {typeof hour12 === "number"
                    ? String(hour12).padStart(2, "0")
                    : hour12}
            </div>

            <div className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-500">
                {minutePart || "--"}
            </div>

            <div className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-500 font-medium">
                {period || "--"}
            </div>
        </div>
    );
};