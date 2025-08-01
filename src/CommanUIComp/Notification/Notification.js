import React, { useState } from "react";
import './Notification.module.scss'
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';


const Alert = React.forwardRef(function Alert(props, ref,) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const Notification = (props) => {
    const tost = props.toastShow;
    const massage = props.toastMsg;
    const success = props.isSuccess;
    const Close = props.Close;
    const vertical = 'top';
    const horizontal = 'right';
    return (
        <Stack spacing={2} sx={{ width: '100%' }}>
            <Snackbar open={tost} autoHideDuration={6000} onClose={() => Close(false)} anchorOrigin={{ vertical, horizontal }}>
                <Alert severity={success ? "success" : "error"} onClose={() => Close(false)} sx={{ width: '100%' }}>
                    {massage}
                </Alert>
            </Snackbar>
            {/* severity="error" severity="warning" severity="info" severity="success" */}
        </Stack>
    )
}
export default Notification;