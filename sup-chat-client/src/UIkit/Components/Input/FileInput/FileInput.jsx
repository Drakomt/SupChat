import { useCallback } from "react";

export const FileInput = ({ className, forwardedref, onTextChange = (v) => {}}) => {

    const onChange = useCallback((e) => {
        console.log("file input event",e);
        onTextChange(e)
    }, [onTextChange]);

    return (
        <div className={`inputContainer ${className}`}>
            <input
                type="file"
                onChange={onChange}
                ref={forwardedref}
            />
        </div>
    )
};