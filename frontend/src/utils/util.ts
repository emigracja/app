export const getCssVariable = (variableName: string): string => {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(variableName)
    .trim();
};
export const getRandomInt = (min: number, max: number)=>  {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const getTimeDifference = (publishedAt: string): string => {
  const now = Date.now();
  const published = Date.parse(publishedAt);
  const diff = now - published;

  const timeUnits = [
    { unit: "year", value: 1000 * 60 * 60 * 24 * 365 },
    { unit: "month", value: 1000 * 60 * 60 * 24 * 30 },
    { unit: "week", value: 1000 * 60 * 60 * 24 * 7 },
    { unit: "day", value: 1000 * 60 * 60 * 24 },
    { unit: "hour", value: 1000 * 60 * 60 },
    { unit: "minute", value: 1000 * 60 }
  ];

  let publishedAtString = "just now";

  for (const { unit, value } of timeUnits) {
    const diffInUnit = Math.floor(diff / value);
    if (diffInUnit > 0) {
      publishedAtString = `${diffInUnit} ${unit}${diffInUnit > 1 ? "s" : ""} ago`;
      break;
    }
  }

  return publishedAtString;
}