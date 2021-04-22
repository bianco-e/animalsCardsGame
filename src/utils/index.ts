export const generateAnimationString = (percent: number) =>
  new Array(Math.floor(100 / percent))
    .fill("")
    .map((i, idx) => {
      return `${idx * percent}% {transform: rotate(${
        idx % 2 === 0 ? "0.35deg" : "-0.35deg"
      })}`;
    })
    .join(" ");

export const cardSpeciesToLowerCase = (species: string): string => {
  const splittedSpecies = species.split(" ");
  if (splittedSpecies.length > 1) {
    return splittedSpecies.join("-").toLowerCase();
  }
  return species.toLowerCase();
};