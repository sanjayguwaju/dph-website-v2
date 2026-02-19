import type { Access } from "payload";

export const isAdmin: Access = ({ req: { user } }) => {
  return user?.role === "admin";
};

export const isEditor: Access = ({ req: { user } }) => {
  return user?.role === "admin" || user?.role === "editor";
};

export const isAuthor: Access = ({ req: { user } }) => {
  return user?.role === "admin" || user?.role === "editor" || user?.role === "author";
};

export const isAuthenticated: Access = ({ req: { user } }) => {
  return Boolean(user);
};

export const isAdminOrSelf: Access = ({ req: { user } }) => {
  if (user?.role === "admin") return true;
  return {
    id: { equals: user?.id },
  };
};

export const isPublishedOrUser: Access = ({ req: { user } }) => {
  if (user) return true;
  return {
    status: { equals: "published" },
  };
};
