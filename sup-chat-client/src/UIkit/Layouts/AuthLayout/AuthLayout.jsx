import "./AuthLayout.css"
export const AuthLayout = ({ children,className }) => {
    
  return (
    <div className={'formRoot'}>
      <div className={`mainSection ${className}`}>{children}</div>
    </div>
  );
};