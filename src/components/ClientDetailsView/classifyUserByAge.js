export default function classifyUserByAge(dateString) {
  const birthDate = new Date(dateString);
  const currentDate = new Date();

  const ageInDays = Math.floor((currentDate - birthDate) / (24 * 60 * 60 * 1000));

  const ageCategories = [
    { category: 'at_birth', maxAge: 14 },
    { category: '6_weeks', maxAge: 6 * 7 },
    { category: '10_weeks', maxAge: 10 * 7 },
    { category: '6_months', maxAge: 6 * 30.44 },
    { category: '7_months', maxAge: 7 * 30.44 },
    { category: '9_months', maxAge: 9 * 30.44 },
    { category: '12_months', maxAge: 12 * 30.44 },
    { category: '18_months', maxAge: 18 * 30.44 },
    { category: '24_months', maxAge: 24 * 30.44 },
  ];

  for (const category of ageCategories) {
    if (ageInDays <= category.maxAge) {
      return category.category;
    }
  }
  return 'not_applicable';
}
