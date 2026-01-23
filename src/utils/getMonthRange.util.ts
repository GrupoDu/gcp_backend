export function getMonthRange(today: Date): {
  actualMonth: Date;
  nextMonth: Date;
} {
  const actualMonth: Date = new Date(today.getFullYear(), today.getMonth(), 1);
  const nextMonth: Date = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    1,
  );

  return { actualMonth, nextMonth };
}
