export default function classifyUserByAge(dateString) {
  const birthDate = new Date(dateString);
  const currentDate = new Date();

  // Calculate the age in days
  const ageInDays = Math.floor((currentDate - birthDate) / (24 * 60 * 60 * 1000));

  // Define age categories
  const ageCategories = [
    { category: 'at_birth', maxAge: 2 },
    { category: '2_weeks', maxAge: 14 },
    { category: '6_weeks', maxAge: 6 * 7 },
    { category: '10_weeks', maxAge: 10 * 7 },
    { category: '6_months', maxAge: 6 * 30.44 },
    { category: '7_months', maxAge: 7 * 30.44 },
    { category: '9_months', maxAge: 9 * 30.44 },
    { category: '12_months', maxAge: 12 * 30.44 },
    { category: '18_months', maxAge: 18 * 30.44 },
    { category: '24_months', maxAge: 24 * 30.44 },
    // Add more categories as needed
  ];

  // Check the user's age against categories
  for (const category of ageCategories) {
    if (ageInDays <= category.maxAge) {
      return category.category;
    }
  }

  // If no category matches, return 'not_applicable'
  return 'not_applicable';
}
