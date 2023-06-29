import "./Participant.css";
import { Line, Saparate } from "../../../../Layouts/Line/Line";
import { DropDown } from "../../../DropDown/DropDown";
export const Participant = ({
  participant,
  admins,
  isUserAdmin,
  options,
  actions,
}) => {
  const isParticipantAdmin = admins.includes(participant._id);
  let displayedOptions;
  let displayedActions;
  if (isParticipantAdmin) {
    displayedOptions = [...options].slice(1);
    displayedActions = [
      ...actions.map((action) => () => action(participant)),
    ].slice(1);
  } else {
    displayedOptions = options.filter((_, index) => index !== 1);
    displayedActions = actions
      .map((action) => () => action(participant))
      .filter((_, index) => index !== 1);
  }

  return (
    <div className="Participant" key={participant._id}>
      <Saparate>
        <Line>
          <div>{participant.username}</div>
          <div>{participant.email}</div>
        </Line>
        <Line>
          {isParticipantAdmin && <div className="adminTag">Admin</div>}
          {isUserAdmin && (
            <DropDown options={displayedOptions} actions={displayedActions} />
          )}
        </Line>
      </Saparate>
    </div>
  );
};
