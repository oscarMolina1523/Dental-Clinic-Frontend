import React, { useMemo } from "react";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import type { View } from "react-big-calendar";
import dayjs from "dayjs";
import "dayjs/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";
import type AppointmentModel from "../../models/AppointmentModel";

dayjs.locale("es");

const localizer = dayjsLocalizer(dayjs);

interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    resource: AppointmentModel;
}

interface AppointmentCalendarProps {
    appointments: AppointmentModel[];
    onSelectEvent: (appointment: AppointmentModel) => void;
    period: "ALL" | "DAY" | "WEEK" | "MONTH";
}

export const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({
    appointments,
    onSelectEvent,
    period,
}) => {
    const events = useMemo<CalendarEvent[]>(
        () =>
            appointments.map((appointment) => ({
                id: appointment.id,
                title: `${appointment.patientFullName} (${appointment.dentistFullName})`,
                start: new Date(appointment.startAppointmentTime),
                end: new Date(appointment.endAppointmentTime),
                resource: appointment,
            })),
        [appointments]
    );

    // Mapeamos el filtro superior de período a la vista de react-big-calendar
    // Si seleccionan "ALL" o "WEEK", por defecto mostramos la semana.
    const currentView: View = useMemo(() => {
        if (period === "DAY") return "day";
        if (period === "MONTH") return "month";
        return "week"; // ALL y WEEK muestran la vista semanal
    }, [period]);

    // Horario de atención: 08:00 a 18:00.
    const minTime = new Date();
    minTime.setHours(8, 0, 0, 0);

    const maxTime = new Date();
    maxTime.setHours(18, 0, 0, 0);

    const scrollToTime = new Date();
    scrollToTime.setHours(8, 0, 0, 0);

    return (
        <div className="h-[700px] w-full bg-white rounded-2xl border border-slate-100 p-4">
            <Calendar<CalendarEvent>
                localizer={localizer}
                events={events}
                culture="es"
                // Sincronizamos la vista automáticamente con los botones de arriba
                view={currentView}
                onView={() => { }} // Evita cambios manuales internos si deseas que mande el filtro superior
                toolbar={false} // Ocultamos la barra superior nativa del calendario
                // Horario visible en las vistas diaria y semanal
                min={minTime}
                max={maxTime}
                scrollToTime={scrollToTime}
                step={15}
                timeslots={4}
                showMultiDayTimes
                dayLayoutAlgorithm="no-overlap"
                messages={{
                    noEventsInRange: "No hay citas en este rango.",
                }}
                formats={{
                    // Formato de la barra lateral izquierda de horas (ej. 08:00 a. m.)
                    timeGutterFormat: (date) =>
                        dayjs(date).format("hh:mm A"),

                    // Formato de la hora dentro de las tarjetas de citas en vista semana/día
                    eventTimeRangeFormat: ({ start, end }) =>
                        `${dayjs(start).format("hh:mm A")} - ${dayjs(end).format("hh:mm A")}`,

                    // Formato de la hora en la vista de agenda
                    agendaTimeRangeFormat: ({ start, end }) =>
                        `${dayjs(start).format("hh:mm A")} - ${dayjs(end).format("hh:mm A")}`,
                }}
                onSelectEvent={(event) => onSelectEvent(event.resource)}
                eventPropGetter={(event) => {
                    const status = event.resource.status;
                    let backgroundColor = "#2563eb";

                    if (status === "COMPLETED") {
                        backgroundColor = "#059669";
                    } else if (status === "IN_PROGRESS") {
                        backgroundColor = "#d97706";
                    } else if (
                        status === "CANCELLED" ||
                        status === "ABANDONED"
                    ) {
                        backgroundColor = "#e11d48";
                    } else if (status === "NO_SHOW") {
                        backgroundColor = "#64748b";
                    }

                    return {
                        style: {
                            backgroundColor,
                            borderRadius: "6px",
                            border: "none",
                            color: "#ffffff",
                            fontSize: "12px",
                            padding: "3px 5px",
                        },
                    };
                }}
            />
        </div>
    );
};