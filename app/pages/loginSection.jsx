import React from "react";
import Login from "../components/login";
function loginSection() {
  return (
    <main>
      <div>
        <Login
          emailPlaceholder="Enter your email"
          passwordPlaceholder="Enter your password"
        />
      </div>
    </main>
  );
}

export default loginSection;
