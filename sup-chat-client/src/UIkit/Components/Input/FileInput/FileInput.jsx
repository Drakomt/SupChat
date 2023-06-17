import { forwardRef, useCallback } from "react";

export const FileInput = forwardRef(({ className, onTextChange = (v) => {}}, ref) => {

    const onChange = useCallback((e) => {
        console.log("file input event",e);
        onTextChange(e)
    }, [onTextChange]);

    return (
        <div className={`inputContainer ${className}`}>
            <input
                type="file"
                onChange={onChange}
                ref={ref}
                accept="image/*"
            />
        </div>
    )
});