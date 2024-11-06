"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { register } from "@/helper/auth";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    try {
        e.preventDefault();
        const res = await register({
          username: username,
          email: email,
          password: password,
        });
        setUsername("");
        setEmail("");
        setPassword("");
        console.log(res);            
    } catch (error) {
        console.log(error)
    } finally{
        navigate("/login")
    }
  };

  return (
    <div className="flex flex-row">
      <div className="bg-primary-foreground hidden h-screen w-1/2 md:block">
        <div className="flex h-full items-end">
          <p className="p-9">
            &quot;Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Voluptatum, inventore. Neque officiis inventore odit officia nam eum
            corrupti, ipsam nisi blanditiis dolore cupiditate. Dolores, animi
            sed! Repellendus qui incidunt ducimus.&quot; - Lorem 2024
          </p>
        </div>
      </div>{" "}
      <div className="h-screen w-screen md:w-1/2">
        <Button
          variant={"outline"}
          onClick={() => navigate("/login")}
          className="absolute right-5 top-5"
        >
          Login
        </Button>
        <div className="flex h-full flex-col items-center justify-center gap-y-3">
          <p className="text-2xl font-bold">Create an account</p>
          <p className="text-sm text-gray-400">
            Enter your credentials below to create an account
          </p>
          <form onSubmit={handleSubmit} className="flex w-80 flex-col gap-y-3">
            <Input
              type="text"
              required
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              type="email"
              required
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              required
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button className="w-full">Register</Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
