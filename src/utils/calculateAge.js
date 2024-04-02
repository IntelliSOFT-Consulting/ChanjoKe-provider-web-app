export default function calculateAge(dateString) {
  if (!dateString) {
    return 'N/A';
  }

  const today = new Date();
  const birthDate = new Date(dateString);

  const ageInMilliseconds = today - birthDate;
  const ageInSeconds = ageInMilliseconds / 1000;
  const ageInMinutes = ageInSeconds / 60;
  const ageInHours = ageInMinutes / 60;
  const ageInDays = ageInHours / 24;
  const ageInWeeks = ageInDays / 7;
  const ageInMonths = (today.getFullYear() - birthDate.getFullYear()) * 12 + (today.getMonth() - birthDate.getMonth());
  const ageInYears = ageInMonths / 12;

  if (ageInDays <= 7) {
    return ageInDays.toFixed(2) > 1 ? `${ageInDays.toFixed(2)} days` : `${ageInDays.toFixed(2)} day`;
  } else if (ageInMonths < 2) {
    const weeks = Math.floor(ageInWeeks);
    const days = ageInDays - weeks * 7;
    return days > 0 ? `${weeks} week${weeks > 1 ? 's' : ''}, ${days.toFixed(2)} days` : `${weeks} week${weeks > 1 ? 's' : ''}`;
  } else if (ageInMonths < 12) {
    const months = Math.floor(ageInMonths);
    const remainingDays = ageInDays - (months * 30.44); // average number of days in a month
    const weeks = Math.floor(remainingDays / 7);
    return weeks > 0 ? `${months} month${months > 1 ? 's' : ''}, ${weeks} week${weeks > 1 ? 's' : ''}` : `${months} month${months > 1 ? 's' : ''}`;
  } else {
    const years = Math.floor(ageInYears);
    const remainingMonths = ageInMonths - years * 12;
    return remainingMonths > 0 ? `${years} year${years > 1 ? 's' : ''}, ${remainingMonths.toFixed(2)} months` : `${years} year${years > 1 ? 's' : ''}`;
  }
}
