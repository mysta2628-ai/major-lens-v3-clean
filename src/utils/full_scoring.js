export function computeProfile(answers) {
  const profile = {
    interests: 0,
    structure: 0,
    values: 0,
    pressure: 0,
  };

  answers.forEach(({ dimension, score }) => {
    if (profile[dimension] !== undefined) {
      profile[dimension] += score;
    }
  });

  return profile;
}
