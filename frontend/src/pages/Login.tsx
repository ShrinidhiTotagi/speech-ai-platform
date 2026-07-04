export default function Login() {
  return (
    <div className="max-w-sm mx-auto mt-20 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Login
      </h2>

      <input
        type="email"
        placeholder="Email"
        className="w-full mb-3 px-3 py-2 border rounded"
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full mb-4 px-3 py-2 border rounded"
      />

      <button className="w-full bg-blue-600 text-white py-2 rounded">
        Login
      </button>
    </div>
  );
}
