import { useState, useContext } from "react";
import GlobalContext from "./GlobalContext";

const Schedule = () => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const timeSlots = ["09:00-13:00", "13:00-17:00", "17:00-21:00"];
  const [maxBookings, _setMaxBookings] = useState(6);
  const spots = [];

  // en array för att generera slots på varje timeSlot
  for (let i = 0; i < maxBookings; i++) {
    spots.push(i);
  }

  const { loggedInUserId, users } = useContext(GlobalContext);

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
          const isAlreadyBooked = slot.booked.includes(loggedInUserId);
          return {
            ...slot,
            booked: isAlreadyBooked
              ? slot.booked.filter((id) => id !== loggedInUserId)
              : [...slot.booked, loggedInUserId],
          };
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
                            ?.username
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
