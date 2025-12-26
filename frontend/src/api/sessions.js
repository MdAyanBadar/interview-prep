import api from "./axios";

export const startSession = data =>
  api.post("/sessions/start", data);

export const submitSession = (sessionId, answers) =>
  api.post(`/sessions/${sessionId}/submit`, { answers });
