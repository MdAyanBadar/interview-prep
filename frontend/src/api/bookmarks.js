import api from "./axios";

export const addBookmark = question =>
  api.post("/bookmarks", { question });

export const getBookmarks = () =>
  api.get("/bookmarks");
