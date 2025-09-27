import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center mb-6">
        <img src="/images/logo.png" alt="Logo" className="w-36" />
      </div>

      <div className="w-full max-w-sm bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-bold text-center mb-4 text-blue-600">
          Login to your account
        </h2>
        <LoginForm />
      </div>
    </div>
  );
}