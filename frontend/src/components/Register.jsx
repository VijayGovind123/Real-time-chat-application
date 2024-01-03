import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  //const [token, setToken] = useState("");
  function handleSubmit(e) {
    e.preventDefault();
    const data = {
      name,
      password,
      email,
    };
    axios
      .post("http://localhost:4000/api/register", data)
      .then((res) => {
        console.log(res.data);
        if (res.data.user) {
          localStorage.setItem("token", res.data.token);
          navigate("/");
        } else {
          console.log(res.data.error);
          navigate("/register");
        }
      })
      .catch((err) => console.log(err));
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="username"
          value={name}
          type="text"
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          placeholder="email"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          placeholder="password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Register;
