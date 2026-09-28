import React, { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Activity,
  CalendarDays,
  Users,
  CheckCircle2,
} from "lucide-react";

import { usePatients } from "../hooks/usePatients";
import { useAppointments } from "../hooks/useAppointment";
import { useTreatments } from "../hooks/useTreatmentsCatalog";
import { useInvoices } from "../hooks/useInvoices";

const ReportsPage: React.FC = () => {
  const {
    data: invoices = []
  } = useInvoices();

  const {
    data: patients = [],
    isLoading: patientsLoading,
  } = usePatients();

  const {
    data: appointments = [],
    isLoading: appointmentsLoading,
  } = useAppointments(1, 1000);

  const {
    data: treatments = [],
    isLoading: treatmentsLoading,
  } = useTreatments();

  const isLoading =
    patientsLoading ||
    appointmentsLoading ||
    treatmentsLoading;

  /*
   * =========================================================
   * KPIs
   * =========================================================
   */

  const [patientReportType, setPatientReportType] = useState<
    "age" | "gender" | "maritalStatus"
  >("age");

  const totalPatients = patients.length;

  const totalAppointments = appointments.length;

  const totalTreatments = treatments.length;

  const completedAppointments = appointments.filter(
    (appointment) =>
      appointment.status === "COMPLETED"
  ).length;

  /*
   * =========================================================
   * APPOINTMENT STATUS
   * =========================================================
   */

  const appointmentStatusData = useMemo(() => {
    return [
      {
        name: "Programadas",
        status: "SCHEDULED",
        value: appointments.filter(
          (item) => item.status === "SCHEDULED"
        ).length,
        color: "#6366f1",
      },
      {
        name: "Confirmadas",
        status: "CONFIRMED",
        value: appointments.filter(
          (item) => item.status === "CONFIRMED"
        ).length,
        color: "#3b82f6",
      },
      {
        name: "En progreso",
        status: "IN_PROGRESS",
        value: appointments.filter(
          (item) => item.status === "IN_PROGRESS"
        ).length,
        color: "#f59e0b",
      },
      {
        name: "Completadas",
        status: "COMPLETED",
        value: appointments.filter(
          (item) => item.status === "COMPLETED"
        ).length,
        color: "#10b981",
      },
      {
        name: "Canceladas",
        status: "CANCELLED",
        value: appointments.filter(
          (item) => item.status === "CANCELLED"
        ).length,
        color: "#ef4444",
      },
      {
        name: "No asistió",
        status: "NO_SHOW",
        value: appointments.filter(
          (item) => item.status === "NO_SHOW"
        ).length,
        color: "#64748b",
      },
    ];
  }, [appointments]);

  /*
   * =========================================================
   * APPOINTMENTS BY MONTH
   * =========================================================
   */

  const appointmentsByMonth = useMemo(() => {
    const months = [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ];

    const result = months.map((month, index) => ({
      month,
      citas: 0,
      monthIndex: index,
    }));

    appointments.forEach((appointment) => {
      const item = appointment as unknown as Record<
        string,
        unknown
      >;

      const rawDate =
        item.date ??
        item.appointmentDate ??
        item.scheduledDate ??
        item.createdAt;

      if (!rawDate) return;

      const date = new Date(String(rawDate));

      if (Number.isNaN(date.getTime())) return;

      result[date.getMonth()].citas += 1;
    });

    return result;
  }, [appointments]);

  const patientDemographicData = useMemo(() => {
    if (!patients.length) {
      return [];
    }

    // ==========================================
    // POR RANGO DE EDAD
    // ==========================================

    if (patientReportType === "age") {
      const ageRanges = [
        {
          name: "0 - 12",
          min: 0,
          max: 12,
          color: "#22c55e",
        },
        {
          name: "13 - 17",
          min: 13,
          max: 17,
          color: "#06b6d4",
        },
        {
          name: "18 - 29",
          min: 18,
          max: 29,
          color: "#3b82f6",
        },
        {
          name: "30 - 44",
          min: 30,
          max: 44,
          color: "#8b5cf6",
        },
        {
          name: "45 - 59",
          min: 45,
          max: 59,
          color: "#f59e0b",
        },
        {
          name: "60+",
          min: 60,
          max: Infinity,
          color: "#ef4444",
        },
      ];

      return ageRanges.map((range) => {
        const value = patients.filter((patient) => {
          const birthdate = new Date(
            patient.birthdate
          );

          if (Number.isNaN(birthdate.getTime())) {
            return false;
          }

          const today = new Date();

          let age =
            today.getFullYear() -
            birthdate.getFullYear();

          const monthDifference =
            today.getMonth() -
            birthdate.getMonth();

          if (
            monthDifference < 0 ||
            (monthDifference === 0 &&
              today.getDate() < birthdate.getDate())
          ) {
            age--;
          }

          return (
            age >= range.min &&
            age <= range.max
          );
        }).length;

        return {
          name: range.name,
          value,
          color: range.color,
        };
      });
    }

    // ==========================================
    // POR GÉNERO
    // ==========================================

    if (patientReportType === "gender") {
      const genderMap = new Map<string, number>();

      patients.forEach((patient) => {
        const gender =
          patient.gender?.trim() ||
          "Sin especificar";

        genderMap.set(
          gender,
          (genderMap.get(gender) ?? 0) + 1
        );
      });

      const genderColors = [
        "#3b82f6",
        "#ec4899",
        "#64748b",
        "#8b5cf6",
        "#14b8a6",
      ];

      return Array.from(
        genderMap.entries()
      ).map(([name, value], index) => ({
        name,
        value,
        color:
          genderColors[
          index % genderColors.length
          ],
      }));
    }

    // ==========================================
    // POR ESTADO CIVIL
    // ==========================================

    const maritalStatusMap = new Map<
      string,
      number
    >();

    patients.forEach((patient) => {
      const status =
        patient.maritalStatus?.trim() ||
        "Sin especificar";

      maritalStatusMap.set(
        status,
        (maritalStatusMap.get(status) ?? 0) + 1
      );
    });

    const maritalColors = [
      "#6366f1",
      "#f59e0b",
      "#10b981",
      "#ef4444",
      "#64748b",
    ];

    return Array.from(
      maritalStatusMap.entries()
    ).map(([name, value], index) => ({
      name,
      value,
      color:
        maritalColors[
        index % maritalColors.length
        ],
    }));
  }, [patients, patientReportType]);


  const patientsWithDebt = useMemo(() => {
    const patientMap = new Map<
      string,
      {
        patientId: string;
        patientFullName: string;
        totalAmount: number;
        paidAmount: number;
        pendingAmount: number;
        invoices: number;
      }
    >();

    invoices.forEach((invoice) => {
      const existing = patientMap.get(
        invoice.patientId
      );

      if (existing) {
        existing.totalAmount += invoice.totalAmount;
        existing.paidAmount += invoice.paidAmount;
        existing.pendingAmount += invoice.pendingAmount;
        existing.invoices += 1;
      } else {
        patientMap.set(invoice.patientId, {
          patientId: invoice.patientId,
          patientFullName: invoice.patientFullName,
          totalAmount: invoice.totalAmount,
          paidAmount: invoice.paidAmount,
          pendingAmount: invoice.pendingAmount,
          invoices: 1,
        });
      }
    });

    return Array.from(patientMap.values())
      .filter((patient) => patient.pendingAmount > 0)
      .sort(
        (a, b) =>
          b.pendingAmount - a.pendingAmount
      );
  }, [invoices]);

  /*
   * =========================================================
   * APPOINTMENT COMPLETION RATE
   * =========================================================
   */

  const completionRate =
    totalAppointments > 0
      ? Math.round(
        (completedAppointments /
          totalAppointments) *
        100
      )
      : 0;

  /*
   * =========================================================
   * LOADING
   * =========================================================
   */

  if (isLoading) {
    return (
      <div className="h-full w-full overflow-auto bg-slate-100 p-6 md:p-8 lg:p-10">
        <div className="mb-8">
          <div className="h-9 w-64 animate-pulse rounded-lg bg-slate-200" />

          <div className="mt-3 h-5 w-48 animate-pulse rounded bg-slate-200" />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-32 animate-pulse rounded-2xl bg-white"
            />
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-96 animate-pulse rounded-2xl bg-white"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-auto bg-slate-100 p-6 md:p-8 lg:p-10">

      {/* =====================================================
          KPI CARDS
      ====================================================== */}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {/* PATIENTS */}

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total de pacientes
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {totalPatients.toLocaleString("es-NI")}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>

          <p className="mt-4 text-xs text-slate-400">
            Pacientes registrados
          </p>
        </div>

        {/* APPOINTMENTS */}

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Citas registradas
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {totalAppointments.toLocaleString("es-NI")}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50">
              <CalendarDays className="h-6 w-6 text-indigo-600" />
            </div>
          </div>

          <p className="mt-4 text-xs text-slate-400">
            Todas las citas
          </p>
        </div>

        {/* TREATMENTS */}

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Tratamientos
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {totalTreatments.toLocaleString("es-NI")}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50">
              <Activity className="h-6 w-6 text-emerald-600" />
            </div>
          </div>

          <p className="mt-4 text-xs text-slate-400">
            Catálogo de tratamientos
          </p>
        </div>

        {/* COMPLETED */}

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Citas completadas
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {completedAppointments.toLocaleString("es-NI")}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
          </div>

          <p className="mt-4 text-xs text-slate-400">
            Atenciones finalizadas
          </p>
        </div>
      </div>

      {/* =====================================================
          CHARTS
      ====================================================== */}

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* ===================================================
            APPOINTMENTS BY MONTH
        ==================================================== */}

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Citas por mes
            </h2>

            <p className="text-sm text-slate-500">
              Evolución de las citas registradas
            </p>
          </div>

          <div className="h-[320px] w-full">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <LineChart data={appointmentsByMonth}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                />

                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="citas"
                  name="Citas"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ===================================================
            APPOINTMENT STATUS
        ==================================================== */}

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Estado de las citas
            </h2>

            <p className="text-sm text-slate-500">
              Distribución de las citas
            </p>
          </div>

          <div className="h-[320px] w-full">
            {appointmentStatusData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-slate-400">
                No hay citas registradas
              </div>
            ) : (
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <PieChart>
                  <Pie
                    data={appointmentStatusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="45%"
                    outerRadius={105}
                    innerRadius={55}
                    paddingAngle={3}
                  >
                    {appointmentStatusData.map(
                      (_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            [
                              "#6366f1",
                              "#3b82f6",
                              "#f59e0b",
                              "#10b981",
                              "#ef4444",
                              "#64748b",
                            ][index % 6]
                          }
                        />
                      )
                    )}
                  </Pie>

                  <Tooltip />

                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* ===================================================
            TREATMENTS
        ==================================================== */}

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Pacientes con pagos pendientes
              </h2>

              <p className="text-sm text-slate-500">
                Pacientes con mayor saldo pendiente
              </p>
            </div>

            <div className="rounded-lg bg-red-50 px-3 py-2">
              <span className="text-xs font-medium text-red-600">
                {patientsWithDebt.length} pacientes
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            {patientsWithDebt.length === 0 ? (
              <div className="flex h-[300px] items-center justify-center text-sm text-slate-400">
                No hay pacientes con pagos pendientes
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left">
                    <th className="pb-3 font-medium text-slate-500">
                      Paciente
                    </th>

                    <th className="pb-3 text-center font-medium text-slate-500">
                      Facturas
                    </th>

                    <th className="pb-3 text-right font-medium text-slate-500">
                      Total
                    </th>

                    <th className="pb-3 text-right font-medium text-slate-500">
                      Pagado
                    </th>

                    <th className="pb-3 text-right font-medium text-slate-500">
                      Pendiente
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {patientsWithDebt
                    .slice(0, 8)
                    .map((patient) => (
                      <tr
                        key={patient.patientId}
                        className="border-b border-slate-50 last:border-0"
                      >
                        <td className="py-4">
                          <div className="font-medium text-slate-800">
                            {patient.patientFullName}
                          </div>
                        </td>

                        <td className="py-4 text-center">
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                            {patient.invoices}
                          </span>
                        </td>

                        <td className="py-4 text-right text-slate-600">
                          C$ {patient.totalAmount.toLocaleString("es-NI", {
                            minimumFractionDigits: 2,
                          })}
                        </td>

                        <td className="py-4 text-right text-emerald-600">
                          C$ {patient.paidAmount.toLocaleString("es-NI", {
                            minimumFractionDigits: 2,
                          })}
                        </td>

                        <td className="py-4 text-right">
                          <span className="font-semibold text-red-600">
                            C$ {patient.pendingAmount.toLocaleString("es-NI", {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* ===================================================
            APPOINTMENT SUMMARY
        ==================================================== */}

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Datos de pacientes
              </h2>

              <p className="text-sm text-slate-500">
                Distribución de pacientes según sus características
              </p>
            </div>

            <select
              value={patientReportType}
              onChange={(event) =>
                setPatientReportType(
                  event.target.value as
                  | "age"
                  | "gender"
                  | "maritalStatus"
                )
              }
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-indigo-500"
            >
              <option value="age">
                Rango de edad
              </option>

              <option value="gender">
                Género
              </option>

              <option value="maritalStatus">
                Estado civil
              </option>
            </select>
          </div>

          <div className="h-[350px] w-full">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={patientDemographicData}
                margin={{
                  top: 10,
                  right: 20,
                  left: 0,
                  bottom: 10,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                />

                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                />

                <Tooltip
                  formatter={(value) => [
                    value,
                    "Pacientes",
                  ]}
                />

                <Bar
                  dataKey="value"
                  name="Pacientes"
                  radius={[6, 6, 0, 0]}
                >
                  {patientDemographicData.map(
                    (item, index) => (
                      <Cell
                        key={`${item.name}-${index}`}
                        fill={item.color}
                      />
                    )
                  )}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* =====================================================
          SUMMARY
      ====================================================== */}

      <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Resumen de la clínica
          </h2>

          <p className="text-sm text-slate-500">
            Información basada en los datos actuales
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-xl bg-slate-50 p-5">
            <p className="text-sm text-slate-500">
              Tasa de citas completadas
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-900">
              {completionRate}%
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-5">
            <p className="text-sm text-slate-500">
              Citas confirmadas
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-900">
              {
                appointments.filter(
                  (item) =>
                    item.status === "CONFIRMED"
                ).length
              }
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-5">
            <p className="text-sm text-slate-500">
              Citas pendientes
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-900">
              {
                appointments.filter(
                  (item) =>
                    item.status === "SCHEDULED"
                ).length
              }
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 p-5">
            <p className="text-sm text-slate-500">
              Citas canceladas
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-900">
              {
                appointments.filter(
                  (item) =>
                    item.status === "CANCELLED"
                ).length
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;