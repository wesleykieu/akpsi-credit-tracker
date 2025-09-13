import { ChartLineMultiple } from "./linechart";

export default function AttendanceLineChart() {
  // Mock data for attendance trends
  const attendanceData = [
    { eventName: "1", pmAttendance: 25, cmAttendance: 18 },
    { eventName: "2 ", pmAttendance: 22, cmAttendance: 20 },
    { eventName: "3", pmAttendance: 18, cmAttendance: 15 },
    { eventName: "4", pmAttendance: 20, cmAttendance: 22 },
    { eventName: "5", pmAttendance: 15, cmAttendance: 12 },
    { eventName: "6", pmAttendance: 16, cmAttendance: 14 },
    { eventName: "7", pmAttendance: 12, cmAttendance: 8 },
    { eventName: "8", pmAttendance: 14, cmAttendance: 10 },
    { eventName: "9", pmAttendance: 28, cmAttendance: 25 },
    { eventName: "10", pmAttendance: 19, cmAttendance: 16 },
  ];

  return <ChartLineMultiple data={attendanceData} />;
}
