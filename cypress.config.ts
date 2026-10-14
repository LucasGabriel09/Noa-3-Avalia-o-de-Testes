import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    supportFile: false,
    video: false,
    setupNodeEvents(on) {
      on("task", {
        log(message: string) {
          console.log(message);
          return null;
        },
      });
    },
  },
});
