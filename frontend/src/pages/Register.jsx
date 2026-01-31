export default function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

        <input
          type="text"
          placeholder="Name"
          className="w-full border p-2 mb-3 rounded"
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 mb-3 rounded"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-3 rounded"
        />

        <input
          type="text"
          placeholder="Department"
          className="w-full border p-2 mb-3 rounded"
        />

        <input
          type="text"
          placeholder="Role"
          className="w-full border p-2 mb-4 rounded"
        />

        <button className="w-full bg-black text-white py-2 rounded">
          Register
        </button>
      </div>
    </div>
  )
}
