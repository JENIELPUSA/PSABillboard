import {
    createBrowserRouter,
    RouterProvider,
    Navigate,
    Outlet,
} from "react-router-dom";

import { ThemeProvider } from "@/contexts/theme-context";

import Layout from "@/routes/layout";
import DashboardPage from "@/routes/dashboard/page";

import CitizensCharter from "./components/CitizenCharacter/CitizenCharacter";
import Corner from "./components/5SCorder/Corners";
import GAD from "./components/GADCORNER/gadcorner";
import QmsCorner from "./components/QMS/qmsCorner";

import GuestUserDashboard from "./routes/dashboard/AdminPage";

// Global Video / Poster
import VideoPosterDisplay from "./components/Poster_Video/PosterVideo";

// Route guards
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import PublicRoute from "./components/PublicRoute/PublicRoute";

// Auth pages
import Login from "./components/Login/Login";
import ResetPassword from "./components/Login/ResetPassword";


// ==========================================
// GLOBAL CONTENT
// ==========================================
// function GlobalContent() {
//     return (
//         <>
//             {/* Global Poster / Video */}
//             <VideoPosterDisplay />
//
//             {/* Current Page */}
//             <Outlet />
//         </>
//     );
// }


function App() {

    const router = createBrowserRouter([

        // ==========================================
        // ROOT
        // ==========================================
        // {
        //     element: <GlobalContent />,
        //     children: [
        {
            // ==========================================
            // PUBLIC ROUTES
            // ==========================================
            element: <PublicRoute />,
            children: [
                {
                    path: "/login",
                    element: <Login />,
                },
                {
                    path: "/reset-password",
                    element: <ResetPassword />,
                },
                {
                    path: "/reset-password/:token",
                    element: <ResetPassword />,
                },

                // Public pages
                {
                    path: "/public/citizencharacter",
                    element: <CitizensCharter />,
                },
                {
                    path: "/public/corners",
                    element: <Corner />,
                },
            ],
        },


        // ==========================================
        // PRIVATE ROUTES
        // ==========================================
        {
            path: "/dashboard",
            element: <PrivateRoute />,
            children: [
                {
                    element: <Layout />,
                    children: [

                        {
                            index: true,
                            element: <DashboardPage />,
                        },

                        {
                            path: "citizencharacter",
                            element: <CitizensCharter />,
                        },

                        {
                            path: "corners",
                            element: <Corner />,
                        },

                        {
                            path: "gadcorner",
                            element: <GAD />,
                        },

                        {
                            path: "qmscorner",
                            element: <QmsCorner />,
                        },

                        {
                            path: "new-customer",
                            element: (
                                <h1 className="title">
                                    New Customer
                                </h1>
                            ),
                        },

                        {
                            path: "verified-customers",
                            element: (
                                <h1 className="title">
                                    Verified Customers
                                </h1>
                            ),
                        },

                        {
                            path: "products",
                            element: (
                                <h1 className="title">
                                    Products
                                </h1>
                            ),
                        },

                        {
                            path: "new-product",
                            element: (
                                <h1 className="title">
                                    New Product
                                </h1>
                            ),
                        },

                        {
                            path: "inventory",
                            element: (
                                <h1 className="title">
                                    Inventory
                                </h1>
                            ),
                        },

                        {
                            path: "settings",
                            element: (
                                <h1 className="title">
                                    Settings
                                </h1>
                            ),
                        },
                    ],
                },
            ],
        },


        // ==========================================
        // FALLBACK
        // ==========================================
        {
            path: "*",
            element: (
                <Navigate
                    to="/dashboard"
                    replace
                />
            ),
        },
        //     ],
        // },
    ]);


    return (
        <ThemeProvider storageKey="theme">
            <RouterProvider router={router} />
        </ThemeProvider>
    );
}


export default App;