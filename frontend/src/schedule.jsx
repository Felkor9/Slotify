import { useState, useContext, useEffect } from "react";
import GlobalContext from "./GlobalContext";

const Schedule = () => {
  const [days, setDays] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [seats, setSeats] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetch("/api/days")
      .then((response) => response.json())
      .then((data) => {
        setDays(data);
      })
      .catch((error) => console.error("Error fetching days:", error));
    fetch("/api/slots")
      .then((response) => response.json())
      .then((data) => {
        setTimeSlots(data);
      });
    fetch("/api/seats")
      .then((response) => response.json())
      .then((data) => {
        setSeats(data);
      });
  }, []);

  useEffect(() => {
    fetch("/api/bookings")
      .then((response) => response.json())
      .then((data) => {
        setBookings(data);
      });
  }, []);

  const { loggedInUserId, users } = useContext(GlobalContext);
  console.log("users:,", users);
  console.log("bookings:", bookings);

  //* temporära tider att boka
  // const [bookings, setBookings] = useState(() => {
  //   const array = [];
  //   for (const day of days) {
  //     for (const slot of timeSlots) {
  //       array.push({ day.name, time: slot, booked: [] });
  //     }
  //   }
  //   return array;
  // });

  // bokar in användar id på tid och dag
  const handleBooking = async (dayid, timeslotid, seatid) => {
    try {
      const userid = Number(loggedInUserId);
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userid, dayid, timeslotid, seatid }),
      });
      if (!res.ok) throw new Error("Kunde inte boka ");
      const updated = await fetch("/api/bookings").then((r) => r.json());
      setBookings(updated);
    } catch (err) {
      console.log(err.message);
    }
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
            {days &&
              days.map((day) => (
                <th key={day.id} style={{ border: "1px solid", width: "18%" }}>
                  {day.name}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {timeSlots &&
            timeSlots.map((time) => (
              <tr key={time.id}>
                <td style={{ border: "1px solid" }}>
                  {time.starttime} - {time.endtime}
                </td>
                {days.map((day) => {
                  // const booking = bookings.find(
                  //   (slot) => slot.day === day && slot.time === time
                  // );
                  return (
                    <td
                      key={day.id + time.id}
                      style={{ border: "1px solid", cursor: "pointer" }}
                      onClick={() => handleBooking(day.id, time.id, 1)}
                    >
                      {seats.map((seat) => {
                        // const bookedUser = booking?.booked[idx]
                        //   ? users.find((u) => u.id === booking.booked[idx])
                        //       ?.username
                        //   : null;
                        const bookedUserId = bookings.find(
                          (b) =>
                            b.day_id === day.id &&
                            b.timeslots_id === time.id &&
                            b.seats_id === seat.id
                        )?.user_id;

                        const bookedUser = users.find(
                          (u) => u.id === bookedUserId
                        )?.username;

                        return (
                          <div
                            key={seat.id}
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
