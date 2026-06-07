import React, {
    createContext,
    useState,
    useEffect,
    useCallback,
} from "react";
import axios from "axios";

export const AnnouncementContext = createContext();

export const AnnouncementProvider = ({ children }) => {
    // =========================
    // STATES
    // =========================
    const [announcements, setAnnouncements] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(6);
    const [searchTerm, setSearchTerm] = useState("");

    const [memorandum, setmemorandum] = useState([]);
    const [memototalCount, setmemoTotalCount] = useState(0);
    const [memototalPages, setmemoTotalPages] = useState(0);
    const [memocurrentPage, setmemoCurrentPage] = useState(1);
    const [memolimit, setmemoLimit] = useState(6);

    const [gadcorner, setgadcorner] = useState(0)
    const [gadcornerTotalCount, setgadcornerTotalCount] = useState(0)
    const [gadcornerTotalPages, setgadcornerTotalPages] = useState(0)
    const [gadcornerCurrentPage, setGadcornerCurrentPage] = useState(0)
    const [gadcornerlimit, setgadcornerlimit] = useState(6)



    const [scorner, setscorner] = useState([]);
    const [scornerTotalCount, setscornerTotalCount] = useState(0);
    const [scornerTotalPages, setscornerTotalPages] = useState(0);
    const [scornerCurrentPage, setscornerCurrentPage] = useState(1);
    const [scornerlimit, setscornerLimit] = useState(6);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const API = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;

    // =========================
    // FETCH (PAGINATION + SEARCH)
    // =========================
    const FetchAnnouncementData = useCallback(async () => {
        try {
            setLoading(true);

            const res = await axios.get(`${API}/api/v1/announcement`, {
                params: {
                    page: currentPage,
                    limit,
                    search: searchTerm || undefined,
                },
            });

            setAnnouncements(res.data.data || []);
            setTotalCount(res.data.totalCount || 0);
            setTotalPages(res.data.totalPages || 1);

            if (res.data.currentPage) {
                setCurrentPage(res.data.currentPage);
            }

        } catch (err) {
            console.error("FetchAnnouncementData Error:", err);
            setError(
                err.response?.data?.message ||
                "Failed to load announcements"
            );
        } finally {
            setLoading(false);
        }
    }, [API, currentPage, limit, searchTerm]);


    const FetchAnnounceMemorandum = useCallback(async () => {
        try {
            setLoading(true);

            const res = await axios.get(`${API}/api/v1/announcement/memorandum`, {
                params: {
                    page: memocurrentPage,     // ✅ gumamit ng value, hindi setter
                    limit: memolimit,
                    search: searchTerm || undefined,
                },
            });

            setmemorandum(res.data.data || []);
            setmemoTotalCount(res.data.totalCount || 0);
            setmemoTotalPages(res.data.totalPages || 1);

            // ✅ Tamang property name: currentPage
            if (res.data.currentPage) {
                setmemoCurrentPage(res.data.currentPage);
            }

        } catch (err) {
            console.error("FetchAnnouncementData Error:", err);
            setError(
                err.response?.data?.message ||
                "Failed to load announcements"
            );
        } finally {
            setLoading(false);
        }
    }, [API, memocurrentPage, memolimit, searchTerm]);

    const FetchAnnounceScorner = useCallback(async () => {
        try {
            setLoading(true);

            const res = await axios.get(`${API}/api/v1/announcement/scorner`, {
                params: {
                    page: scornerCurrentPage,
                    limit: scornerlimit,
                    search: searchTerm || undefined,
                },
            });

            setscorner(res.data.data || []);
            setscornerTotalCount(res.data.totalCount || 0);
            setscornerTotalPages(res.data.totalPages || 1);

            if (res.data.currentPage) {
                setscornerCurrentPage(res.data.currentPage);
            }

        } catch (err) {
            console.error("FetchAnnounceScorner Error:", err);
            setError(err.response?.data?.message || "Failed to load announcements");
        } finally {
            setLoading(false);
        }
    }, [API, scornerCurrentPage, scornerlimit, searchTerm]);


    const FetchGadCornerData = useCallback(async () => {
        try {
            setLoading(true);

            const res = await axios.get(`${API}/api/v1/announcement/gadcorner`, {
                params: {
                    page: gadcornerCurrentPage,
                    limit: gadcornerlimit,
                    search: searchTerm || undefined,
                },
            });

            setgadcorner(res.data.data || []);
            setgadcornerTotalCount(res.data.totalCount || 0);
            setgadcornerTotalPages(res.data.totalPages || 1);

            if (res.data.currentPage) {
                setGadcornerCurrentPage(res.data.currentPage);
            }

        } catch (err) {
            console.error("FetchAnnounceScorner Error:", err);
            setError(err.response?.data?.message || "Failed to load announcements");
        } finally {
            setLoading(false);
        }
    }, [API, gadcornerCurrentPage, gadcornerlimit, searchTerm]);


    const AddAnnouncement = useCallback(async (values) => {

        console.log("values", values)
        try {
            const res = await axios.post(
                `${API}/api/v1/announcement`,
                values
            );

            console.log("res", res)
            if (res.data?.status === "Success") {
                FetchAnnounceScorner();
                return {
                    success: true
                };
            }
        } catch (err) {
            const message =
                err.response?.data?.message ||
                "Failed to create announcement";

            setError(message);

            return {
                success: false,
                error: message,
            };
        }
    }, [API, FetchAnnouncementData]);

    // =========================
    // UPDATE
    // =========================
    const UpdateAnnouncement = useCallback(async (id, values) => {
        try {
            const res = await axios.patch(
                `${API}/api/v1/announcement/${id}`,
                values
            );

            await FetchAnnouncementData();

            return {
                success: true,
                data: res.data.data,
            };

        } catch (err) {
            const message =
                err.response?.data?.message ||
                "Failed to update announcement";

            setError(message);

            return {
                success: false,
                error: message,
            };
        }
    }, [API, FetchAnnouncementData]);

    // =========================
    // DELETE
    // =========================
    const DeleteAnnouncement = useCallback(async (id) => {
        try {
            await axios.delete(`${API}/api/v1/announcement/${id}`);

            setAnnouncements((prev) =>
                prev.filter((item) => item._id !== id)
            );

            return { success: true };

        } catch (err) {
            const message =
                err.response?.data?.message ||
                "Failed to delete announcement";

            setError(message);

            return {
                success: false,
                error: message,
            };
        }
    }, [API]);

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

    useEffect(() => {
        FetchAnnouncementData();
        FetchAnnounceMemorandum();
        FetchAnnounceScorner();
        FetchGadCornerData();
    }, [FetchAnnouncementData, FetchAnnounceMemorandum, FetchAnnounceScorner, FetchGadCornerData]);

    return (
        <AnnouncementContext.Provider
            value={{
                // DATA
                announcements,
                totalCount,
                totalPages,
                currentPage,
                limit,
                searchTerm,
                loading,
                error,
                //memo
                memototalCount,
                memototalPages,
                memocurrentPage,
                setmemoLimit,
                setmemoCurrentPage,

                // SETTERS
                setCurrentPage,
                setSearchTerm,
                setLimit,

                scorner,
                scornerTotalCount,
                scornerTotalPages,
                scornerCurrentPage,
                scornerlimit,

                setscornerLimit,
                setscornerCurrentPage,
                setscorner, FetchAnnounceScorner,


                gadcorner,
                gadcornerTotalCount,
                gadcornerCurrentPage,
                setGadcornerCurrentPage,
                setgadcornerlimit, gadcornerTotalPages, FetchGadCornerData,

                // CRUD
                FetchAnnouncementData,
                AddAnnouncement,
                UpdateAnnouncement,
                DeleteAnnouncement, FetchAnnounceMemorandum,

                // HANDLERS
                handleSearch,
                handlePageChange,

                memorandum
            }}
        >
            {children}
        </AnnouncementContext.Provider>
    );
};