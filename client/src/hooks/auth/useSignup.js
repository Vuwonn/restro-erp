import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setLoading } from "@/redux/authSlice";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "react-toastify";

const useSignup = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLocalLoading] = useState(false);

    const submitHandler = async (values, { setSubmitting, resetForm }) => {
        const formData = new FormData();
        Object.keys(values).forEach((key) => {
            if (values[key]) formData.append(key, values[key]);
        });

        try {
            setLocalLoading(true);
            dispatch(setLoading(true));

            const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });

            if (res.data.success) {
                navigate("/login");
                toast.success(res.data.message);
                resetForm();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLocalLoading(false);
            dispatch(setLoading(false));
            setSubmitting(false);
        }
    };

    return { loading, submitHandler };
};

export default useSignup;
