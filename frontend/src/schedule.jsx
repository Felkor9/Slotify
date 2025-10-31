import { useState } from "react";

const Schedule = () => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const timeSlots = ["09:00-13:00", "13:00-17:00", "17:00-21:00"];
  const [maxBookings, _setMaxBookings] = useState(6);
  const spots = [];

  // en array för att generera slots på varje timeSlot
  for (let i = 0; i < maxBookings; i++) {
    spots.push(i);
  }

  //* temporära användare tills vi har databas kopplat
  const users = [
    { id: 1, userName: "Felix" },
    { id: 2, userName: "Ingo" },
    { id: 3, userName: "Kristofer" },
    { id: 4, userName: "Caspar" },
    { id: 5, userName: "Hampus" },
    { id: 6, userName: "Will" },
  ];
  const loggedInUserId = 1;

  //* temporära tider att boka
  const [bookings, setBookings] = useState(() => {
    const array = [];
    for (const day of days) {
      for (const slot of timeSlots) {
        array.push({ day, time: slot, booked: [] });
      }
    }
    return array;
  });

  // bokar in användar id på tid och dag
  const handleBooking = (day, time) => {
    setBookings((prev) =>
      prev.map((slot) => {
        if (slot.day === day && slot.time === time) {
          // Inga dubbelbokningar
          if (!slot.booked.includes(loggedInUserId)) {
            return { ...slot, booked: [...slot.booked, loggedInUserId] };
          }
        }
        return slot;
      })
    );
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
            <th style={{ border: "1px solid", width: "10%" }}>Tid</th>
            {days.map((day) => (
              <th key={day} style={{ border: "1px solid", width: "18%" }}>
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
                const booking = bookings.find(
                  (slot) => slot.day === day && slot.time === time
                );
                return (
                  <td
                    key={day + time}
                    style={{ border: "1px solid", cursor: "pointer" }}
                    onClick={() => handleBooking(day, time)}
                  >
                    {spots.map((spot, idx) => {
                      const bookedUser = booking?.booked[idx]
                        ? users.find((u) => u.id === booking.booked[idx])
                            ?.userName
                        : null;
                      return (
                        <div
                          key={idx}
                          style={{
                            border: "1px solid rgb(191, 191, 191)",
                            backgroundColor: bookedUser
                              ? "#f5b2aaff"
                              : "#afffa5ff",
                            height: "24px",
                          }}
                        >
                          {bookedUser || ""}
                        </div>
                      );
                    })}
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
