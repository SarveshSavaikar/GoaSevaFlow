// Login.js
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";
import GoogleSignInButton from "./googleSignInButton";



export default function Login() {
    const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCred.user.getIdToken();
      console.log("token on frontend :- ",token)
      localStorage.setItem("token", token); // For dev testing
      const res = await fetch("http://localhost:8000/secure-data", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log("Secure API response:", data);
      alert("Login successful");
      navigate("/home")
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    // <form onSubmit={handleLogin}>
    //   <input type="email" name="email" placeholder="Email" required />
    //   <input type="password" name="password" placeholder="Password" required />
    //   <button type="submit">Log In</button>
    // </form>
    <div className='auth-container'>
      <div className='login-header'>
        <h1 className='login-title'>GoaSevaFlow</h1>
      </div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type='email'
          placeholder='Email'
          name="email"
          required
        />
        <input
          type='password'
          placeholder='Password'
          name="password"
          required
        />
        <button type='submit'>Login</button>
        <p>
          Don’t have an account?{' '}
          <span
            className='auth-link'
            onClick={() => navigate('/signup')}>
            Sign up
          </span>
        </p>
        
      </form>
      <hr style={
          {
            margin:"20px",
            border:"2px solid red"
          }
        }></hr>
        <GoogleSignInButton></GoogleSignInButton>
    </div>
  );
}
