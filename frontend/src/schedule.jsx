import { useState, useContext, useEffect } from "react";
import GlobalContext from "./GlobalContext";
import "./schedule.css";
import "./schedule.css";
import { toast } from "react-toastify";

const Schedule = () => {
  const [days, setDays] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [seats, setSeats] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [alreadyBooked, setAlreadyBooked] = useState(false);

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

  const handleBooking = async (
    bookedUserId,
    day_id,
    timeslots_id,
    seats_id
  ) => {
    // om platsen är bokad av den inloggade användaren, ta bort bokningen
    if (bookedUserId === Number(loggedInUserId)) {
      try {
        const user_id = Number(loggedInUserId);
        const res = await fetch("/api/bookings", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id, day_id, timeslots_id, seats_id }),
        });
        if (!res.ok)
          throw (
            (new Error("Kunde inte boka "),
            toast.error("Kunde inte ta bort bokningen"))
          );
        const updated = await fetch("/api/bookings").then((r) => r.json());
        setBookings(updated);
        toast.success("Removed booking successfully!");
      } catch (err) {
        console.log(err.message);
        toast.error("Kunde inte ta bort bokningen");
      }
      return;
    }

    // kolla om användaren redan har en bokning samma dag och tid
    bookings.map((b) => {
      if (
        b.user_id === Number(loggedInUserId) &&
        b.day_id === day_id &&
        b.timeslots_id === timeslots_id
      ) {
        setAlreadyBooked(true);
        return;
      }
    });

    // annars skapa en ny bokning
    try {
      const user_id = Number(loggedInUserId);
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id, day_id, timeslots_id, seats_id }),
      });
      if (!res.ok)
        throw (
          (new Error("Kunde inte boka "),
          toast.error("Could not create booking"))
        );
      const updated = await fetch("/api/bookings").then((r) => r.json());
      toast.success("Booking created successfully!");
      setBookings(updated);
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <>
      <div className="container">
        <table
          className="table-content"
          style={{
            borderCollapse: "collapse",
            width: "100%",
            textAlign: "center",
          }}
        >
          <thead className="thead-container">
            <tr>
              <th style={{ border: "1px solid", width: "10%" }}>Tid</th>
              {days &&
                days.map((day) => (
                  <th
                    key={day.id}
                    style={{ border: "1px solid", width: "18%" }}
                  >
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
                              className="seat-div"
                              key={seat.id}
                              style={{
                                border: "1px solid rgb(191, 191, 191)",
                                backgroundColor: bookedUser
                                  ? "#f5b2aaff"
                                  : "#afffa5ff",
                                height: "24px",
                              }}
                              onClick={() =>
                                handleBooking(
                                  bookedUserId,
                                  day.id,
                                  time.id,
                                  seat.id
                                )
                              }
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
      </div>
      {alreadyBooked && (
        <div
          className="alreadyBooked-modal"
          onClick={() => setAlreadyBooked(false)}
        >
          <div className="alreadyBooked-content">
            <h2>Du har redan en bokning denna dag och tid!</h2>
          </div>
        </div>
      )}
    </>
  );
};

export default Schedule;
