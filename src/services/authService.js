// 👉 Ye abhi mock service hai
// 👉 Backend banne ke baad yahan API call lagegi

import axios from "axios";

const USERS = [
  {
    email: "vikrampal038@gmail.com",
    name: "Vikram Pal",
    password: "vikram@123",
    deletePassword: "delete@123",
  },
  {
    email: "singhnikhil100@gmail.com",
    name: "Nikhil Singh",
    password: "nikhil@123",
    deletePassword: "delete@123",
  },
];

export function verifyLogin(email, password) {
  const user = USERS.find((u) => u.email === email);
  if (!user) return null;

  if (user.password !== password) return null;

  return {
    email: user.email,
    name: user.name,
  };
}

export const verifyDeletePassword = async ({ email, password }) => {
  const res = await axios.post("http://localhost:5000/api/auth/verify-delete-password", {
    email,
    password,
  });
  return res.data;
};
