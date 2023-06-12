import "./input.css";
import { useCallback, useState } from "react";

export const Input = ({ type, onTextChange = (v) => {}, placeholder, name, value, className, forwardedref}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = showPassword ? "text" : type || "text";

  const handleChange = useCallback((e) => {
    onTextChange(e.target.value);
  }, [onTextChange]);

  return (
    <div className={`inputContainer ${className}`}>
      <input
        type={inputType}
        className={"input"}
        onChange={handleChange}
        placeholder={placeholder}
        value={value}
        name={name}
        ref={forwardedref}
      />
      {type === "password" && (
        <label className="checkboxLabel">
          <input
            type="checkbox"
            className="checkbox"
            onChange={() => setShowPassword(!showPassword)}
          />
          Show Password
        </label>
      )}
    </div>
  );
}
