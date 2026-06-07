import React, {
    createContext,
    useState,
    useEffect,
    useCallback,
} from "react";
import axios from "axios";

export const QmsCornerContext = createContext();

export const QmsCornerProvider = ({ children }) => {
    // =========================
    // STATES
    // =========================
    const [qmsCorners, setQmsCorners] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(6);
    const [searchTerm, setSearchTerm] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const API = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;

    // =========================
    // FETCH (PAGINATION + SEARCH)
    // =========================
    const FetchQmsCorners = useCallback(async () => {
        try {
            setLoading(true);

            const res = await axios.get(`${API}/api/v1/qms`, {
                params: {
                    page: currentPage,
                    limit,
                    search: searchTerm || undefined,
                },
            });

            setQmsCorners(res.data.data || []);
            setTotalCount(res.data.totalCount || 0);
            setTotalPages(res.data.totalPages || 1);

            if (res.data.currentPage) {
                setCurrentPage(res.data.currentPage);
            }

        } catch (err) {
            console.error("FetchQmsCorners Error:", err);
            setError(
                err.response?.data?.message ||
                "Failed to load QMS Corners"
            );
        } finally {
            setLoading(false);
        }
    }, [API, currentPage, limit, searchTerm]);

    // =========================
    // CREATE
    // =========================
    const AddQmsCorner = useCallback(async (values) => {
        console.log("values", values);
        try {
            const res = await axios.post(
                `${API}/api/v1/qms`,
                values
            );

            console.log("res", res);
            if (res.data?.status === "success") {
                await FetchQmsCorners();
                return {
                    success: true,
                    data: res.data.data
                };
            }
            return {
                success: false,
                error: res.data?.message || "Failed to create QMS Corner"
            };
        } catch (err) {
            const message =
                err.response?.data?.message ||
                "Failed to create QMS Corner";

            setError(message);

            return {
                success: false,
                error: message,
            };
        }
    }, [API, FetchQmsCorners]);

    // =========================
    // UPDATE
    // =========================
    const UpdateQmsCorner = useCallback(async (id, values) => {
        try {
            const res = await axios.patch(
                `${API}/api/v1/qms/${id}`,
                values
            );



            if (res.data?.status === "success") {
                await FetchQmsCorners();
                return {
                    success: true,
                    data: res.data.data
                };
            }
            return {
                success: false,
                error: res.data?.message || "Failed to create QMS Corner"
            };
        }

        catch (err) {
            const message =
                err.response?.data?.message ||
                "Failed to update QMS Corner";

            setError(message);

            return {
                success: false,
                error: message,
            };
        }
    }, [API, FetchQmsCorners]);

    // =========================
    // DELETE
    // =========================
    const DeleteQmsCorner = useCallback(async (id) => {
        try {
            await axios.delete(`${API}/api/v1/qms/${id}`);

            setQmsCorners((prev) =>
                prev.filter((item) => item._id !== id)
            );

            // Refresh to update pagination counts
            await FetchQmsCorners();

            return { success: true };

        } catch (err) {
            const message =
                err.response?.data?.message ||
                "Failed to delete QMS Corner";

            setError(message);

            return {
                success: false,
                error: message,
            };
        }
    }, [API, FetchQmsCorners]);

    // =========================
    // HANDLERS
    // =========================
    const handleSearch = useCallback((query) => {
        setSearchTerm(query);
        setCurrentPage(1);
    }, []);

    const handlePageChange = useCallback((page) => {
        setCurrentPage(page);
    }, []);

    const handleLimitChange = useCallback((newLimit) => {
        setLimit(newLimit);
        setCurrentPage(1);
    }, []);

    const clearSearch = useCallback(() => {
        setSearchTerm("");
        setCurrentPage(1);
    }, []);

    // =========================
    // EFFECTS
    // =========================
    useEffect(() => {
        FetchQmsCorners();
    }, [FetchQmsCorners]);

    return (
        <QmsCornerContext.Provider
            value={{
                // DATA
                qmsCorners,
                totalCount,
                totalPages,
                currentPage,
                limit,
                searchTerm,
                loading,
                error,

                // SETTERS
                setCurrentPage,
                setSearchTerm,
                setLimit,

                // CRUD
                FetchQmsCorners,
                AddQmsCorner,
                UpdateQmsCorner,
                DeleteQmsCorner,

                // HANDLERS
                handleSearch,
                handlePageChange,
                handleLimitChange,
                clearSearch,
            }}
        >
            {children}
        </QmsCornerContext.Provider>
    );
};