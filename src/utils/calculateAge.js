
export default function calculateAge(dateString) {
  const today = new Date();
  const birthDate = new Date(dateString);

  const ageInMilliseconds = today - birthDate;
  const ageInSeconds = ageInMilliseconds / 1000;
  const ageInMinutes = ageInSeconds / 60;
  const ageInHours = ageInMinutes / 60;
  const ageInDays = ageInHours / 24;
  const ageInWeeks = ageInDays / 7;
  const ageInMonths = today.getMonth() - birthDate.getMonth() + (12 * (today.getFullYear() - birthDate.getFullYear()));
  const ageInYears = today.getFullYear() - birthDate.getFullYear();

  if (ageInDays <= 1) {
    return `New born`;
  }
  if (ageInDays <= 7) {
    return `${Math.floor(ageInDays)} day old`;
  } else if (ageInMonths < 2) {
    const weeks = Math.floor(ageInWeeks);
    const days = Math.floor(ageInDays % 7);
    return days > 0 ? `${weeks} week${weeks > 1 ? 's' : ''}, ${days} days old` : `${weeks} week${weeks > 1 ? 's' : ''} old`;
  } else if (ageInMonths < 12) {
    const months = Math.floor(ageInMonths);
    const weeks = Math.floor(ageInWeeks % 4);
    return weeks > 0 ? `${months} month${months > 1 ? 's' : ''}, ${weeks} week${weeks > 1 ? 's' : ''} old` : `${months} month${months > 1 ? 's' : ''}`;
  } else {
    const years = Math.floor(ageInYears);
    const months = Math.floor(ageInMonths % 12);
    return months > 0 ? `${years} year${years > 1 ? 's' : ''}, ${months} month${months > 1 ? 's' : ''} old` : `${years} year${years > 1 ? 's' : ''} old`;
  }
}