// Signup.js
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";
import GoogleSignInButton from "./googleSignInButton";

export default function Signup() {
  const navigate = useNavigate();
  const handleSignup = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (password.length < 6) {
      alert('Password should be at least 6 characters');
      return;
    }

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const token = await userCred.user.getIdToken();
      localStorage.setItem("token", token); // For dev testing
      const res = await fetch("http://localhost:8000/secure-data", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log("Secure API response:", data);
      alert("Signup successful");
      navigate("/home")
      
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    // <form onSubmit={handleSignup}>
    //   <input type="email" name="email" placeholder="Email" required />
    //   <input type="password" name="password" placeholder="Password" required />
    //   <button type="submit">Sign Up</button>
    // </form>
    <div className='auth-container'>
      <div className='login-header'>
        <h1 className='login-title'>GoaSevaFlow</h1>
      </div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <input
          type='email'
          placeholder='Email'
          // value={form.email}
          name="email"
          required
        />
        <input
          type='password'
          placeholder='Password'
          // value={form.password}
          name="password"
          required
        />
        <button type='submit'>Sign Up</button>
        <p>
          Already have an account?{' '}
          <span
            className='auth-link'
            onClick={() => navigate('/login')}>
            Login
          </span>
        </p>
        
      </form>
      <hr style={
          {
            margin:"20px",
            border:"2px solid red"
          }
        }></hr>
        <div style={{
          width:"100%",
          justifyContent:"center"
        }}>
          <GoogleSignInButton></GoogleSignInButton>
        </div>
    </div>
  );
}
