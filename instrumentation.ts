export async function register() {
  if (process.env.NODE_ENV === "production") {
    const { validateEnvironment } = await import("./lib/environment");
    validateEnvironment();
  }
}
