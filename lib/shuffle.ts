export const shuffle = (arr: string[]): string[] => {
  const shuffled = [...arr];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    // eslint-disable-next-line security/detect-object-injection
    const currentItem = shuffled[index];
    // eslint-disable-next-line security/detect-object-injection
    const randomItem = shuffled[randomIndex];

    // eslint-disable-next-line security/detect-object-injection
    shuffled[index] = randomItem!;
    // eslint-disable-next-line security/detect-object-injection
    shuffled[randomIndex] = currentItem!;
  }

  return shuffled;
};
