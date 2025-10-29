import { useState } from "react";

const Schedule = () => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const timeSlots = ["09:00-13:00", "13:00-17:00", "17:00-21:00"];
  const [maxBookings, _setMaxBookings] = useState(6);
  const spots = [];

  for (let i = 0; i < maxBookings; i++) {
    spots.push({ nr: i + 1, isBooked: false });
  }

  const handleBooking = (day, time) => {};

  return (
    <>
      <table
        style={{
          borderCollapse: "collapse",
          width: "100%",
          textAlign: "center",
        }}
      >
        <thead>
          <tr>
            <th style={{ border: "1px solid" }}>Tid</th>
            {days.map((day) => (
              <th key={day} style={{ border: "1px solid" }}>
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeSlots.map((time) => (
            <tr key={time}>
              <td style={{ border: "1px solid" }}>{time}</td>
              {days.map((day) => {
                return (
                  <td key={day + time} style={{ border: "1px solid" }}>
                    {spots.map((spot) => (
                      <div
                        key={spot.nr}
                        style={{
                          border: "1px solid rgb(191, 191, 191)",
                          backgroundColor: "#aaf5adff",
                        }}
                        onClick={() => handleBooking(day, time)}
                      >
                        {spot.nr}
                      </div>
                    ))}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Schedule;
