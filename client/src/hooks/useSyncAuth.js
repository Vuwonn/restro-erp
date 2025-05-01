import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/authSlice"; 
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";

const useSyncAuth = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);

    useEffect(() => {
        const syncAuthStatus = async () => {
            try {
                const response = await axios.get(`${USER_API_END_POINT}/check-login-status`, {
                    withCredentials: true
                });

                if (!response.data.success) {
                    throw new Error("User not authenticated");
                }
            } catch (error) {
                console.log("Syncing auth: User logged out on the server. Logging out on frontend...");
                dispatch(logout()); // Log out from Redux store
            }
        };

        if (user) {
            syncAuthStatus();
        }
    }, [dispatch, user]);
};

export default useSyncAuth;