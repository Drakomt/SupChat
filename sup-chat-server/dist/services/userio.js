import { Sup } from "../repository/Sup.js";
const Dal = new Sup();
const updateUserEventName = "updateUser";
const updateUser = async (data, io, socket, users) => {
    const user = await Dal.userRep.findById(data._id);
    user.email = data.email;
    user.username = data.username;
    await Dal.userRep.update(user._id, user);
    user.friends.forEach(friend => {
        const pSocket = users.get(friend._id.toString());
        pSocket?.emit("updateUser", user);
    });
};
const userEvents = { functions: [updateUser],
    eventNames: [updateUserEventName] };
export default userEvents;
//# sourceMappingURL=userio.js.map