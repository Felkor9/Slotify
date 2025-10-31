import { useState } from "react";

const Schedule = () => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const timeSlots = ["09:00-13:00", "13:00-17:00", "17:00-21:00"];
  const [maxBookings, _setMaxBookings] = useState(6);
  const spots = [];

  for (let i = 0; i < maxBookings; i++) {
    spots.push({ nr: i + 1, isBooked: false });
  }

  //* temporära användare tills vi har databas kopplat
  const users = [
    { id: 1, userName: "Felix", bookings: [] },
    { id: 2, userName: "Ingo", bookings: [] },
    { id: 3, userName: "Kristofer", bookings: [] },
    { id: 4, userName: "Caspar", bookings: [] },
    { id: 5, userName: "Hampus", bookings: [] },
    { id: 6, userName: "Will", bookings: [] },
  ];
  const loggedInUserId = 1;

  //* temporära tider att boka
  const bookings = [];
  for (const day of days) {
    for (const slot of timeSlots) {
      bookings.push({ day, time: slot, booked: [] });
    }
  }

  // bokar in användar id på tid och dag
  const handleBooking = (day, time) => {
    const user = users.find((u) => u.id === loggedInUserId);
    const booking = bookings.find((b) => b.day === day && b.time === time);
    if (user && booking) {
      booking.booked.push(user.id);
    }
    console.log(bookings);
  };

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
                  <td
                    key={day + time}
                    style={{ border: "1px solid", cursor: "pointer" }}
                    onClick={() => handleBooking(day, time)}
                  >
                    {spots.map((spot) => (
                      <div
                        key={spot.nr}
                        style={{
                          border: "1px solid rgb(191, 191, 191)",
                          backgroundColor: "#aaf5adff",
                        }}
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
