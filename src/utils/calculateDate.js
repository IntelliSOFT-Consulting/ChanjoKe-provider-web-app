export default function calculateEstimatedBirthDate(selectedWeek, selectedMonth, selectedYear) {
  const currentDate = new Date();
  
  const daysFromWeeks = selectedWeek * 7;
  const daysFromMonths = selectedMonth * 30;
  const daysFromYears = selectedYear * 365;

  const estimatedBirthDate = new Date(currentDate.getTime() - (daysFromWeeks + daysFromMonths + daysFromYears) * 24 * 60 * 60 * 1000);

  const formattedDate = `${estimatedBirthDate.getFullYear()}-${(estimatedBirthDate.getMonth() + 1).toString().padStart(2, '0')}-${estimatedBirthDate.getDate().toString().padStart(2, '0')}`;

  return formattedDate;
}