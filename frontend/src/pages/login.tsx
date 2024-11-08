import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { login } from "@/helper/auth";
import { useAuth } from "@/hooks/use-user";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const { refreshAuth, refreshRooms } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await login({
        email: email,
        password: password,
      });
      setEmail("");
      setPassword("");
    } catch (error) {
      console.log(error);
    } finally {
      await refreshAuth();
      await refreshRooms();
      navigate("/");
    }
  };
  return (
    <div className="flex flex-row">
      <div className="hidden h-screen w-1/2 bg-primary-foreground md:block">
        <div className="flex h-full items-end">
          <p className="p-9">
            &quot;Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Voluptatum, inventore. Neque officiis inventore odit officia nam eum
            corrupti, ipsam nisi blanditiis dolore cupiditate. Dolores, animi
            sed! Repellendus qui incidunt ducimus.&quot; - Lorem 2024
          </p>
        </div>
      </div>
      <div className="h-screen w-screen md:w-1/2">
        <Button
          variant={"outline"}
          onClick={() => navigate("/register")}
          className="absolute right-5 top-5"
        >
          Register
        </Button>
        <div className="flex h-full flex-col items-center justify-center gap-y-3">
          <p className="text-2xl font-bold">Login to your account</p>
          <p className="text-sm text-gray-400">
            Enter your credentials below to login to your account
          </p>
          <form onSubmit={handleSubmit} className="flex w-80 flex-col gap-y-3">
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
            <Button className="w-full">Login</Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
