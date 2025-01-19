export default function DateDisplay() {
  const today = new Date();
  const dayOfWeek = today.toLocaleString("fr", { weekday: "long" });
  const day = today.getDate();
  const month = today.toLocaleString("fr", { month: "long" });
  const year = today.getFullYear();

  return (
    <div className="text-2xl font-bold">
      {dayOfWeek} {day} {month} {year}
    </div>
  );
}
