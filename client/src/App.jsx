import { useState } from "react";
import Login from "./pages/Login";
import ChatApp from "./pages/ChatApp";

function App() {
  const [user, setUser] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {user ? <ChatApp user={user} setUser={setUser} /> : <Login setUser={setUser} />}
    </div>
  );
}

export default App;