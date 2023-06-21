import { React, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "../UIkit/Components/Input/Input/Input";
import { Button } from "../UIkit/Components/Button/Button";
import { Rows } from "../UIkit/Layouts/Line/Line" ;
import { toast } from "../UIkit/utils/sweetAlert";
import { AuthLayout } from "../UIkit/Layouts/AuthLayout/AuthLayout";
import { fetchUser } from "../store/userSlice";
import { Loading } from "../UIkit/Components/Loading/Loading";

export const Login = () => {
    const dispatch = useDispatch(); 
    const navigate = useNavigate();
    const inputData = useRef({email:'',password:''});
    const user = useSelector(state => state.userSlice.user);
    const error = useSelector(state => state.userSlice.error);
    const loading = useSelector(state => state.userSlice.loading);

    const displayToast = async (type, message) => {
        await toast(type, message);
    }

    useEffect (() => {
        if (user) {
          displayToast("success", "login successful");
          navigate("/chats");
        }else if (error) displayToast("error", "login failed");
    },[user,error,navigate])

    const submit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');

        if (!email) {
            displayToast("error", "Please enter your email.");
            return;
        }
        
        if (!password) {
        displayToast("error", "Please enter your password.");
        return;
        }

        if (password !== inputData.current.password || email !== inputData.current.email){
            inputData.current.email = email;
            inputData.current.password = password;
            dispatch(fetchUser({email,password}));
        }
    }

   const form = (<div className="logIn">
            <h1>Login</h1>
            <form onSubmit={submit} className="loginForm">
                <Rows>
                    <Input placeholder={"Email"} name="email"/>
                    <Input type={"password"} placeholder={"Password"} name="password"/>
                    <Button type={"submit"} className="btn">Log In</Button>
                    or
                    <Button type={"button"} onClick={() => navigate("/signUp")} className="btn">Sign Up</Button>
                    <span style={{color:"red"}}>{error && error.message}</span>
                </Rows>
            </form>
        </div>)
    return  ((error || !loading) && <AuthLayout>{form}</AuthLayout>) || (loading && <Loading/>)

   
}