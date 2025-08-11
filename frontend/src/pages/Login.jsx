export default function Login() {
    return (
      <div className="flex flex-col items-center mt-20">
        <h1 className="text-3xl mb-6">Login to Exam Repo</h1>
        <a href="http://localhost:5000/api/auth/google" className="bg-blue-500 text-white px-4 py-2 rounded">
          Login with Google
        </a>
      </div>
    );
  }
  