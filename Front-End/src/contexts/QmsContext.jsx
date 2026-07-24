import React, {
    createContext,
    useState,
    useEffect,
    useCallback,
    useRef,
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
    const [category, setCategory] = useState("QMS corner"); // Default category

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const API = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;
    const initialFetchDone = useRef(false);

    // =========================
    // FETCH (PAGINATION + SEARCH) - FIXED
    // =========================
    const FetchQmsCorners = useCallback(async (categoryParam = null) => {
        // Use the passed category or fallback to the state
        const categoryToUse = categoryParam || category;
        
        // Don't fetch if category is empty
        if (!categoryToUse || categoryToUse.trim() === "") {
            console.warn("Category is empty, skipping fetch");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError("");

            // Encode the category name for URL
            const encodedCategory = encodeURIComponent(categoryToUse);

            console.log(`Fetching QMS Corners for category: ${categoryToUse}`);
            console.log(`URL: ${API}/api/v1/qms/category/${encodedCategory}`);

            const res = await axios.get(`${API}/api/v1/qms/category/${encodedCategory}`, {
                params: {
                    page: currentPage,
                    limit,
                    search: searchTerm || undefined,
                },
            });

            console.log("Fetch response:", res.data);

            setQmsCorners(res.data.data || []);
            setTotalCount(res.data.totalCount || 0);
            setTotalPages(res.data.totalPages || 1);

            if (res.data.currentPage) {
                setCurrentPage(res.data.currentPage);
            }

            // Update category state if a different category was passed
            if (categoryParam && categoryParam !== category) {
                setCategory(categoryParam);
            }

            initialFetchDone.current = true;

        } catch (err) {
            console.error("FetchQmsCorners Error:", err);
            setError(
                err.response?.data?.message ||
                "Failed to load QMS Corners"
            );
            setQmsCorners([]);
            setTotalCount(0);
            setTotalPages(0);
        } finally {
            setLoading(false);
        }
    }, [API, currentPage, limit, searchTerm, category]);

    // =========================
    // CREATE
    // =========================
    const AddQmsCorner = useCallback(async (values) => {
        console.log("Creating QMS Corner with values:", values);
        try {
            const res = await axios.post(
                `${API}/api/v1/qms`,
                values
            );

            console.log("Create response:", res.data);
            if (res.data?.status === "success") {
                // Refresh after successful creation with the current category
                await FetchQmsCorners(category);
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
            console.error("AddQmsCorner Error:", err);

            return {
                success: false,
                error: message,
            };
        }
    }, [API, FetchQmsCorners, category]);

    // =========================
    // UPDATE
    // =========================
    const UpdateQmsCorner = useCallback(async (id, values) => {
        try {
            const res = await axios.patch(
                `${API}/api/v1/qms/${id}`,
                values
            );

            console.log("Update response:", res.data);

            if (res.data?.status === "success") {
                // Refresh after successful update
                await FetchQmsCorners(category);
                return {
                    success: true,
                    data: res.data.data
                };
            }
            return {
                success: false,
                error: res.data?.message || "Failed to update QMS Corner"
            };
        } catch (err) {
            const message =
                err.response?.data?.message ||
                "Failed to update QMS Corner";

            setError(message);
            console.error("UpdateQmsCorner Error:", err);

            return {
                success: false,
                error: message,
            };
        }
    }, [API, FetchQmsCorners, category]);

    // =========================
    // DELETE
    // =========================
    const DeleteQmsCorner = useCallback(async (id) => {
        try {
            await axios.delete(`${API}/api/v1/qms/${id}`);

            // Optimistically update UI
            setQmsCorners((prev) =>
                prev.filter((item) => item._id !== id)
            );

            // Refresh to update pagination counts
            await FetchQmsCorners(category);

            return { success: true };

        } catch (err) {
            const message =
                err.response?.data?.message ||
                "Failed to delete QMS Corner";

            setError(message);
            console.error("DeleteQmsCorner Error:", err);

            return {
                success: false,
                error: message,
            };
        }
    }, [API, FetchQmsCorners, category]);

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

    const handleCategoryChange = useCallback((newCategory) => {
        if (newCategory && newCategory.trim() !== "") {
            setCategory(newCategory);
            setCurrentPage(1);
            setSearchTerm("");
            // Fetch immediately when category changes
            FetchQmsCorners(newCategory);
        }
    }, [FetchQmsCorners]);

    // =========================
    // EFFECTS
    // =========================
    useEffect(() => {
        // Initial fetch with default category only if category is set
        if (category && category.trim() !== "" && !initialFetchDone.current) {
            FetchQmsCorners(category);
        }
    }, [category, FetchQmsCorners]);

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
                category,
                loading,
                error,

                // SETTERS
                setCurrentPage,
                setSearchTerm,
                setLimit,
                setCategory,

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
                handleCategoryChange,
            }}
        >
            {children}
        </QmsCornerContext.Provider>
    );
};