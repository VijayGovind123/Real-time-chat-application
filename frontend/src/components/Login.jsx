import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  function handleSubmit(e) {
    e.preventDefault();
    const data = {
      email,
      password,
    };
    axios
      .post("http://localhost:4000/api/login", data)
      .then((res) => {
        console.log(res.data);
        if (res.data.user) {
          localStorage.setItem("token", res.data.jwttoken);
          navigate("/");
        } else {
          console.log(res.data.error);
          alert("Check your credentials");
          navigate("/404");
        }
      })
      .catch((err) => {
        alert("Server error,please try again later");
        console.log(err);
      });
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Login;
