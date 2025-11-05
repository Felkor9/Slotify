import { useState, useContext, useEffect } from "react";
import GlobalContext from "./GlobalContext";

const Schedule = () => {
  const [days, setDays] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [seats, setSeats] = useState([]);

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

  const { loggedInUserId, users } = useContext(GlobalContext);

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
                      onClick={() => handleBooking(day.id, time.id)}
                    >
                      {seats.map((seat, idx) => {
                        // const bookedUser = booking?.booked[idx]
                        //   ? users.find((u) => u.id === booking.booked[idx])
                        //       ?.username
                        //   : null;
                        return (
                          <div
                            key={idx}
                            style={{
                              border: "1px solid rgb(191, 191, 191)",
                              // backgroundColor: bookedUser
                              //   ? "#f5b2aaff"
                              //   : "#afffa5ff",
                              height: "24px",
                            }}
                          >
                            {/* {bookedUser || ""} */}
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
