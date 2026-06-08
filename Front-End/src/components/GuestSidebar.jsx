import { forwardRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { navbarLinks } from "@/constants";
import logo from "../assets/psa-logo.mp4";
import { useAuth } from "../contexts/AuthContext";
import { cn } from "@/utils/cn";
import PropTypes from "prop-types";
import { LogIn, LogOut } from "lucide-react";

export const GuestSidebar = forwardRef(({ collapsed }, ref) => {
    const { logout, role } = useAuth();
    const navigate = useNavigate();
    
    const hasRole = !!role;

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login");
        } catch (error) {
            console.error("Failed to log out:", error);
        }
    };

    // Get all links from navbarLinks
    const navLinks = navbarLinks[0]?.links || [];

    return (
        <aside
            ref={ref}
            className={cn(
                // Base styles
                "fixed z-[100] flex h-full flex-col overflow-x-hidden border-r border-blue-800 bg-[#0038A8] text-white transition-all duration-300 dark:bg-[#001f5c]",
                // Dynamic Width base sa Screen Size at Collapsed State
                collapsed 
                    ? "w-[60px] md:w-[80px]" 
                    : "w-[75vw] sm:w-[220px] md:w-[260px]",
                // Mobile behavior (Slide-in / Slide-out)
                collapsed ? "max-md:-left-full" : "max-md:left-0",
            )}
        >
            {/* Header Section: Logo at Title */}
            <div className={cn(
                "flex flex-col items-center justify-center gap-y-3 p-4 md:p-6 border-b border-blue-700/50",
                collapsed && "p-2 md:p-4"
            )}>
                <div className="relative group">
                    <div className="absolute -inset-1 bg-yellow-400 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
                    <video
                        src={logo}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className={cn(
                            "relative rounded-full border-2 border-yellow-400 object-cover bg-white transition-all duration-300",
                            collapsed ? "w-10 h-10 md:w-12 md:h-12" : "w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24"
                        )}
                    />
                </div>

                {!collapsed && (
                    <div className="text-center px-1">
                        <p className="text-[8px] sm:text-[10px] uppercase tracking-widest text-yellow-400 font-bold">
                            Republic of the Philippines
                        </p>
                        <p className="text-xs sm:text-sm font-black leading-tight text-white mt-1">
                            PHILIPPINE STATISTICS <br /> AUTHORITY
                        </p>
                        <p className="text-xs sm:text-[14px] md:text-[16px] font-medium text-blue-200 mt-2 italic whitespace-normal">
                            PSA Interactive Bulletin Board
                        </p>
                    </div>
                )}
            </div>

            {/* Navigation Section */}
            <div className="flex w-full flex-col gap-y-6 overflow-y-auto p-3 md:p-4 [scrollbar-width:_thin] scrollbar-thumb-blue-400">
                <nav className={cn("flex flex-col gap-y-2", collapsed && "items-center")}>
                    <p className={cn(
                        "text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-yellow-500/80 mb-1 px-3",
                        collapsed && "hidden"
                    )}>
                        {hasRole ? "MAIN NAVIGATION" : "GUEST NAVIGATION"}
                    </p>

                    {navLinks.map((link) => (
                        <NavLink
                            key={link.label}
                            to={link.path}
                            end={link.path === "/dashboard"}
                            className={({ isActive }) => cn(
                                "flex items-center gap-x-3 px-3 py-2.5 md:py-3 rounded-lg transition-all duration-200 group",
                                isActive
                                    ? "bg-white/10 text-yellow-400 border-l-4 border-yellow-400 shadow-lg"
                                    : "text-blue-100 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            {({ isActive }) => (
                                <>
                                    <link.icon
                                        size={collapsed ? 22 : 20}
                                        className={cn(
                                            "shrink-0 transition-transform group-hover:scale-110",
                                            isActive && "text-yellow-400"
                                        )}
                                    />
                                    {!collapsed && (
                                        <span className="text-xs sm:text-[14px] font-semibold tracking-wide truncate">
                                            {link.label}
                                        </span>
                                    )}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>
            </div>

            {/* Guest Message - Only show when no role */}
            {!hasRole && !collapsed && (
                <div className="flex w-full flex-col items-center justify-center p-4 text-center mt-auto">
                    <p className="text-xs text-blue-300">Guest Mode</p>
                    <p className="text-[10px] text-blue-400/70 mt-1">Login for full access</p>
                </div>
            )}

            {/* Conditional Button - Login or Logout */}
            <div className={cn("border-t border-blue-200 p-3 md:p-4 dark:border-blue-800", collapsed ? "mt-auto" : "mt-0")}>
                {!hasRole ? (
                    <NavLink
                        to="/login"
                        className={cn(
                            "flex w-full items-center gap-2 rounded-lg py-2 text-xs sm:text-sm font-medium transition-all duration-200",
                            "bg-yellow-500 text-blue-900 hover:bg-yellow-400",
                            collapsed ? "justify-center px-0 py-2.5" : "px-3",
                            "mx-auto"
                        )}
                    >
                        <LogIn
                            size={20}
                            className={cn("flex-shrink-0", collapsed ? "" : "")}
                        />
                        {!collapsed && <p className="whitespace-nowrap">Login</p>}
                    </NavLink>
                ) : (
                    <button
                        onClick={handleLogout}
                        className={cn(
                            "flex w-full items-center gap-2 rounded-lg py-2 text-xs sm:text-sm font-medium transition-all duration-200",
                            "text-white hover:bg-yellow-800 dark:text-blue-200 dark:hover:bg-yellow-800/30",
                            collapsed ? "justify-center px-0 py-2.5" : "px-3",
                            "mx-auto",
                        )}
                    >
                        <LogOut
                            size={20}
                            className={cn("flex-shrink-0", collapsed ? "" : "")}
                        />
                        {!collapsed && <p className="whitespace-nowrap">Logout</p>}
                    </button>
                )}
            </div>
        </aside>
    );
});

GuestSidebar.displayName = "GuestSidebar";
GuestSidebar.propTypes = {
    collapsed: PropTypes.bool,
};