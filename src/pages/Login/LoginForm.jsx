import React, { useState } from "react";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import AlertMessage from "../../components/AlertMessage";
import { useAuth } from "../../contexts/useAuthContext";
import { login as loginApi } from "../../api/auth";

export default function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await loginApi(email, password);
      login(data);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <InputField label="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
      <InputField label="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
      <AlertMessage message={error} />
      <Button text="Login" onClick={handleLogin} loading={loading} />
    </div>
  );
}
