import { Sup } from "../repository/Sup.js";
const Dal = new Sup();
const updateUserEventName = "updateUser";
const updateUser = async (data, io, socket, users) => {
    const isValidToken = await Dal.userRep.isValidToken(data.token);
    if (isValidToken) {
        const user = await Dal.userRep.findById(data.user._id);
        user.email = data.user.email;
        user.username = data.user.username;
        await Dal.userRep.update(user._id, user);
        user.friends.forEach(friend => {
            const pSocket = users.get(friend._id.toString());
            pSocket?.emit("updateUser", user);
        });
    }
};
const userEvents = { functions: [updateUser],
    eventNames: [updateUserEventName] };
export default userEvents;
//# sourceMappingURL=userio.js.map