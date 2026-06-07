import { Outlet, useLocation } from "react-router-dom";
import { useMediaQuery } from "@uidotdev/usehooks";
import { useClickOutside } from "@/hooks/use-click-outside";

import { Sidebar } from "@/layouts/sidebar";
import { GuestSidebar } from "@/components/GuestSidebar";
import { Header } from "@/layouts/header";

import { cn } from "@/utils/cn";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const Layout = () => {
    const isDesktopDevice = useMediaQuery("(min-width: 768px)");
    const sidebarRef = useRef(null);
    const { role, loading } = useAuth();
    const location = useLocation();

    // Persistent collapsed state
    const [collapsed, setCollapsed] = useState(() => {
        const saved = localStorage.getItem("sidebar-collapsed");
        if (saved !== null) return JSON.parse(saved);
        return false;
    });

    // Save state to localStorage
    useEffect(() => {
        localStorage.setItem("sidebar-collapsed", JSON.stringify(collapsed));
    }, [collapsed]);

    // Handle mobile vs desktop
    useEffect(() => {
        if (!isDesktopDevice) {
            setCollapsed(true);
        }
    }, [isDesktopDevice]);

    // Click outside closes sidebar on mobile
    useClickOutside([sidebarRef], () => {
        if (!isDesktopDevice && !collapsed) {
            setCollapsed(true);
        }
    });

    // Show loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-[#0038A8] border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-slate-600">Loading...</p>
                </div>
            </div>
        );
    }

    const hasRole = !!role;
    const isLoginPage = location.pathname === "/login";

    // Always show sidebar even on login page (optional - pwede mong tanggalin ang condition na ito)
    // Kung gusto mong may sidebar din sa login page, alisin mo lang ang if statement na ito
    // if (isLoginPage) {
    //     return (
    //         <div className="min-h-screen bg-slate-100 transition-colors dark:bg-slate-950">
    //             <Outlet />
    //         </div>
    //     );
    // }

    return (
        <div className="min-h-screen bg-slate-100 transition-colors dark:bg-slate-950">
            {/* overlay */}
            <div
                className={cn(
                    "pointer-events-none fixed inset-0 -z-10 bg-black opacity-0 transition-opacity",
                    !collapsed && "max-md:pointer-events-auto max-md:z-50 max-md:opacity-30"
                )}
            />

            {/* ALWAYS show sidebar - always use GuestSidebar for all users */}
            <GuestSidebar ref={sidebarRef} collapsed={collapsed} />

            {/* Main Content */}
            <div
                className={cn(
                    "transition-[margin] duration-300",
                    collapsed ? "md:ml-[70px]" : "md:ml-[240px]"
                )}
            >
                {/* Header - Only show if user has role */}
                {hasRole && (
                    <Header collapsed={collapsed} setCollapsed={setCollapsed} />
                )}

                <div className={cn(
                    "overflow-y-auto overflow-x-hidden p-6",
                    !hasRole && "h-screen mt-0"
                )}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Layout;