import { useState } from "react";
import { Input } from "../UIkit/Components/Input/Input/Input";
import { Button } from "../UIkit/Components/Button/Button";
import { Rows } from "../UIkit/Layouts/Line/Line" ;
import { toast } from "../UIkit/utils/sweetAlert";
import { AuthLayout } from "../UIkit/Layouts/AuthLayout/AuthLayout";
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import { createUser } from "../store/signUpSlice";
import { Loading } from "../UIkit/Components/Loading/Loading";


export const SignUp = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch()
     
    async function success(){
        toast("success","sign up successful");
        navigate('/login');
     }
    const [inputData, setInputData] = useState(null);
    const {isSignedUp, error,loading} = useSelector(state => state.signUpSlice);
    console.log(isSignedUp, error, loading);
    if(isSignedUp) success();
    const submit = async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const email = formData.get('email');
      const username = formData.get('username')
      const password = formData.get('password');
      const confirmPassword = formData.get('confirmPassword');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !username || !password || !confirmPassword) {
        toast("error", "Please fill in all the fields.");
        return;
      }

      if (!emailRegex.test(email)) {
        toast("error", "Please enter a valid email address.");
        return;
      }
    
      if (password !== confirmPassword) {
        toast("error", "Passwords do not match.");
        return;
      }
    
      dispatch(createUser({ email, password, username }));   
      
    }

   const form = (
     <div className="signUp">
       <h1>Sign Up</h1>
       <form onSubmit={submit} className="signUpForm">
         <Rows>
           <Input placeholder={"Email"} name="email" />
           <Input placeholder={"username"} name="username" />
           <Input type={"password"} placeholder={"Password"} name="password" />
           <Input
             type={"password"}
             placeholder={"Confirm Password"}
             name="confirmPassword"
           />
           {/* <span>Already have an account? <NavLink to={"/login"}> Login </NavLink> </span> */}
           <span style={{ color: "red" }}>{error && "invalid fields"}</span>
         </Rows>
         <Button type={"submit"} className="btn">Sign Up</Button>
         or
         <Button type={"button"} onClick={() => navigate("/login")} className="btn">Log In</Button>
       </form>
     </div>
   );

    return (error || !loading) && <AuthLayout>{form}</AuthLayout> || loading && <Loading/>
}