export const isXSmall = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(max-width: 575.98px)").matches
