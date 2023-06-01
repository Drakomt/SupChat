import { Server, Socket } from "socket.io";
import { Sup } from "../repository/Sup.js";

const Dal = new Sup();

const updateUserEventName:string = "updateUser";

const updateUser = async (
    data: any,
    io: Server,
    socket: Socket,
    users: Map<string, Socket>
  ) => {
    const user = await Dal.userRep.findById(data._id);
    user.email = data.email;
    user.username = data.username;
    await Dal.userRep.update(user._id,user);
    user.friends.forEach(friend => {
        const pSocket = users.get(friend._id.toString());
        pSocket?.emit("updateUser", user);
    });
  }




const userEvents = {functions:[updateUser],
eventNames:[updateUserEventName]}

export default userEvents