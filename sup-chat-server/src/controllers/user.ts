import { Sup } from "../repository/Sup.js";
import { IUser,User } from "../schemas/user.js";

const Dal = new Sup()

export function login (request, response) {
  response.render("hello world");
};

export async function signUp(request, response){
  try {
    console.log("body:",request.body);
    const { email, username, password } = request.body;
    console.log("email:",email,"username:",username,"password:",password);
    const newUser = new User({ email, username, password });
    const signUpUser = await Dal.userRep.add(newUser);
    response.sendStatus(201);
  } catch (error) {
    console.log("signUp error:", error);
    response.redirect('signUp');
  }
}
