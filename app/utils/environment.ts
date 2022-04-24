export const isServer = typeof window === "undefined";

const { env } = isServer ? process : (window as unknown as any);

export default env;
