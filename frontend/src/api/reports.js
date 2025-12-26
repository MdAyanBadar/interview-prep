import api from "./axios";

export const getProgress = () =>
  api.get("/reports/progress");
