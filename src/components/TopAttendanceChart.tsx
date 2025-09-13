import { ChartBarLabelCustom } from "./charts";

export default function TopAttendeesChart() {
  // Mock data for top attendees
  const topAttendees = [
    { userId: 1, userName: "Wesley Kieu", attendanceCount: 18, pmCount: 11, cmCount: 7 },
    { userId: 2, userName: "Alex Chen", attendanceCount: 15, pmCount: 9, cmCount: 6 },
    { userId: 3, userName: "Sarah Johnson", attendanceCount: 14, pmCount: 8, cmCount: 6 },
    { userId: 4, userName: "Mike Rodriguez", attendanceCount: 12, pmCount: 7, cmCount: 5 },
    { userId: 5, userName: "Emma Davis", attendanceCount: 10, pmCount: 6, cmCount: 4 },
  ];

  return <ChartBarLabelCustom data={topAttendees} />;
}