// Weather temperature display helpers — trips store temperatures in Celsius
export const normalizeUnits = (unit) => (unit === "f" ? "f" : "c");

export const tempValue = (celsius, unit) =>
  unit === "f" ? Math.round((celsius * 9) / 5 + 32) : Math.round(celsius);

export const tempRange = (lowC, highC, unit) =>
  `${tempValue(lowC, unit)}–${tempValue(highC, unit)}°${unit === "f" ? "F" : "C"}`;