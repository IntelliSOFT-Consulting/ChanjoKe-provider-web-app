export default function calculateAge(birthDate) {
  const currentDate = new Date();
  const dob = new Date(birthDate);
  let age = currentDate.getFullYear() - dob.getFullYear();

  // Adjust age if the birthday hasn't occurred yet this year
  if (currentDate.getMonth() < dob.getMonth() || (currentDate.getMonth() === dob.getMonth() && currentDate.getDate() < dob.getDate())) {
    age--;
  }

  return age

}