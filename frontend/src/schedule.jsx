import "./schedule.css";

const Schedule = () => {
  const timeSlots = [
    { day: "monday", slots: ["08:00-12:00", "12:00-16:00", "16:00-20:00"] },
    { day: "tuesday", slots: ["08:00-12:00", "12:00-16:00", "16:00-20:00"] },
    { day: "wednesday", slots: ["08:00-12:00", "12:00-16:00", "16:00-20:00"] },
    { day: "thursday", slots: ["08:00-12:00", "12:00-16:00", "16:00-20:00"] },
    { day: "friday", slots: ["08:00-12:00", "12:00-16:00", "16:00-20:00"] },
  ];

  return (
    <>
      <div className="scheduleContainer">
        <div className="monday day">Monday</div>
        <div className="tuesday day">Tuesday</div>
        <div className="wednesday day">Wednesday</div>
        <div className="thursday day">Thursday</div>
        <div className="friday day">Friday</div>
        {timeSlots.map((slot, index) => {
          return (
            <div key={index} className={slot.day}>
              <div className={slot.day}>{slot.slots[0]}</div>
              <div className={slot.day}>{slot.slots[1]}</div>
              <div className={slot.day}>{slot.slots[2]}</div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Schedule;
