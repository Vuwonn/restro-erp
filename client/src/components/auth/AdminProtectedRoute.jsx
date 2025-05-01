import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
    const { user, loading } = useSelector((store) => store.auth);
    const navigate = useNavigate();
    const [checkingAuth, setCheckingAuth] = useState(true);

    useEffect(() => {
        if (!loading) {
            if (!user || user.role !== "admin") {
                navigate("/login", { replace: true });
            }
            setCheckingAuth(false);
        }
    }, [user, loading, navigate]);

    if (loading || checkingAuth) {
        return <div>Loading...</div>; // Prevent UI flickering
    }

    return children;
};

export default AdminProtectedRoute;
