import React, { useState } from "react";
import Select from "react-select";
import { useSelector } from "react-redux";
import { Rows } from "../UIkit/Layouts/Line/Line";
import { Button } from "../UIkit/Components/Button/Button";
import { Input } from "../UIkit/Components/Input/Input/Input";
import { AuthLayout } from "../UIkit/Layouts/AuthLayout/AuthLayout";
import { emitNewChat } from "../services/socket";

export const AddChat = ({closeCb}) => {
  const contacts = useSelector((state) => state.userSlice.user?.friends);
  const currentUser = useSelector((state) => state.userSlice.user);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [admins, setAdmins] = useState([
    { value: currentUser._id, label: currentUser.username },
  ]);
  const [selectedParticipants, setSelectedParticipants] = useState([
    { value: currentUser._id, label: currentUser.username },
  ]);
  const options = contacts.map((contact) => ({
    value: contact._id,
    label: contact.username,
    isDisabled: contact._id === currentUser._id,
  })); // Transform contacts to options

  const handleParticipantsChange = (selected) => {
    const newParticipants = selected.filter(
      (participant) =>
        !selectedParticipants.find(
          (currentParticipant) => currentParticipant.value === participant.value
        )
    );

    if (newParticipants.length > 0) {
      setSelectedParticipants([...newParticipants, ...selectedParticipants]);
    }
  };

  const handleAdminChange = (selected) => {
    setAdmins(selected);
  };

  const submit = async (e) => {
    e.preventDefault();
    const participantIds = selectedParticipants.map((participant) => {
      return { _id: participant.value };
    });

    const adminIds = admins.map((admin) => {
      return { _id: admin.value };
    });
    const newChat = {
      name,
      description,
      admins:adminIds,
      participants: participantIds,
      messages: [],
      createdAt: Date.now(),
      createdBy: currentUser._id
    };
    console.log("new chat : ", newChat);
    emitNewChat(newChat);
    // closeCb();
  };

  return (
    <div className="addNewChat">
      <h1>Create New Chat</h1>
      <form onSubmit={submit}>
        <Rows>
          <Input
            placeholder={"Name of Chat"}
            onTextChange={(name) => setName(name)}
            name="name"
          />
          <Input
            placeholder={"Description"}
            onTextChange={(desc) => setDescription(desc)}
            name="description"
          />
          <div className="placeholder">Admins</div>
          <Select
            placeholder={"Admins"}
            isMulti
            options={options}
            onChange={handleAdminChange}
            defaultValue={[
              { value: currentUser._id, label: currentUser.username },
            ]}
          />
          <div className="placeholder">Participants</div>
          <Select
            placeholder={"Participants"}
            isMulti
            options={options}
            onChange={handleParticipantsChange}
            defaultValue={[
              { value: currentUser._id, label: currentUser.username },
            ]}
          />
          <Button type={"submit"} className="btn">
            Create
          </Button>
        </Rows>
      </form>
    </div>
  );
  // return <AuthLayout className={"addChatForm"}>{form}</AuthLayout>;
};
