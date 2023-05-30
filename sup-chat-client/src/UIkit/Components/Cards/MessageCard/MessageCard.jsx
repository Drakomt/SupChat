import { forwardRef } from "react";
import { Line, Saparate,Rows } from "../../../Layouts/Line/Line";
import "./MessageCard.css";
//import { Card, CardContent, Typography, styled } from "@mui/material";

// const StyledCard = styled(Card)({
//     minWidth: 275,
//     marginBottom: '10px',
//     marginTop: '10px',
// });

// const HeaderDiv = styled(Card)({
//     display: 'flex',
//     justifyContent: 'space-between',
// });

// const BodyDiv = styled('div')({
//     display: 'flex',
//     justifyContent: 'space-between',
// })

export const MessageCard = forwardRef(({message, key, className}, ref) => {
    
    const date =  new Date(message.dateTime)
    const timeStr = date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', hour12: false});
    return (
        <div className={`messageCard ${className}`} key={key} ref={ref}>
            <Rows>  
                <Line>
                    <div>{message.user?.username}</div>
                    <div>{message.user?.email} </div>
                </Line>
                <Saparate>
                    <div>{message.text}</div>
                    <div>{timeStr}</div>
                </Saparate>
            </Rows>
        </div>
        // <StyledCard ref={ref}>
        //     <CardContent>
        //         <HeaderDiv>
        //             <Typography color={"textSecondary"} gutterBottom>
        //                 {message.user?.username}
        //             </Typography>
        //             <Typography color={"textSecondary"} gutterBottom>
        //                 {message?.user.email}
        //             </Typography>
        //         </HeaderDiv>
        //         <BodyDiv>
        //             <Typography variant="body2" component={"p"}>
        //                 {message.text}
        //             </Typography>
        //             <Typography color={"textSecondary"}>
        //                 {timeStr}
        //             </Typography>
        //         </BodyDiv>
        //     </CardContent>
        // </StyledCard>
    )
});