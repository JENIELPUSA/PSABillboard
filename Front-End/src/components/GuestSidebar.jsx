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
                "fixed z-[100] flex h-full w-[150px] flex-col overflow-x-hidden border-r border-blue-800 bg-[#0038A8] text-white transition-all duration-300 dark:bg-[#001f5c]",
                collapsed ? "md:w-[80px]" : "md:w-[260px]",
                collapsed ? "max-md:-left-full" : "max-md:left-0",
            )}
        >
            {/* Header Section: Logo at Title */}
            <div className={cn(
                "flex flex-col items-center justify-center gap-y-3 p-6 border-b border-blue-700/50",
                collapsed && "p-4"
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
                            collapsed ? "w-12 h-12" : "w-24 h-24"
                        )}
                    />
                </div>

                {!collapsed && (
                    <div className="text-center">
                        <p className="text-[10px] uppercase tracking-widest text-yellow-400 font-bold">Republic of the Philippines</p>
                        <p className="text-sm font-black leading-tight text-white mt-1">
                            PHILIPPINE STATISTICS <br /> AUTHORITY
                        </p>
                        <p className="text-[16px] font-medium text-blue-200 mt-2 italic">
                            PSA Interactive Bulletin Board
                        </p>
                    </div>
                )}
            </div>

            {/* Navigation Section - Always visible */}
            <div className="flex w-full flex-col gap-y-6 overflow-y-auto p-4 [scrollbar-width:_thin] scrollbar-thumb-blue-400">
                <nav className={cn("flex flex-col gap-y-2", collapsed && "items-center")}>
                    <p className={cn(
                        "text-[11px] font-bold uppercase tracking-wider text-yellow-500/80 mb-1 px-3",
                        collapsed && "hidden"
                    )}>
                        {hasRole ? "MAIN NAVIGATION" : "GUEST NAVIGATION"}
                    </p>

                    {navLinks.map((link) => (
                        <NavLink
                            key={link.label}
                            to={link.path}
                            end={link.path === "/dashboard"} // Add this line for dashboard exact match
                            className={({ isActive }) => cn(
                                "flex items-center gap-x-3 px-3 py-3 rounded-lg transition-all duration-200 group",
                                isActive
                                    ? "bg-white/10 text-yellow-400 border-l-4 border-yellow-400 shadow-lg"
                                    : "text-blue-100 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            {({ isActive }) => ( // Change this to render props pattern
                                <>
                                    <link.icon
                                        size={collapsed ? 24 : 20}
                                        className={cn(
                                            "shrink-0 transition-transform group-hover:scale-110",
                                            isActive && "text-yellow-400" // Change from group-[.active] to isActive
                                        )}
                                    />
                                    {!collapsed && (
                                        <span className="text-[14px] font-semibold tracking-wide">
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
            {!hasRole && (
                <div className="flex w-full flex-col items-center justify-center p-4 text-center">
                    <p className="text-xs text-blue-300">Guest Mode</p>
                    <p className="text-[10px] text-blue-400/70 mt-1">Login for full access</p>
                </div>
            )}

            {/* Conditional Button - Login or Logout - Always visible */}
            <div className="mt-auto border-t border-blue-200 p-4 dark:border-blue-800">
                {!hasRole ? (
                    <NavLink
                        to="/login"
                        className={cn(
                            "flex w-full items-center gap-2 rounded-lg py-2",
                            "text-sm font-medium transition-all duration-200",
                            "bg-yellow-500 text-blue-900 hover:bg-yellow-400",
                            collapsed ? "md:w-[45px] md:justify-center md:px-0 md:py-3" : "px-3",
                            "mx-1"
                        )}
                    >
                        <LogIn
                            size={22}
                            className={cn("flex-shrink-0", collapsed ? "mx-auto" : "")}
                        />
                        {!collapsed && <p className="whitespace-nowrap">Login</p>}
                    </NavLink>
                ) : (
                    <button
                        onClick={handleLogout}
                        className={cn(
                            "flex w-full items-center gap-2 rounded-lg py-2",
                            "text-sm font-medium transition-all duration-200",
                            "text-white hover:bg-yellow-800 dark:text-blue-200 dark:hover:bg-yellow-800/30",
                            collapsed ? "md:w-[45px] md:justify-center md:px-0 md:py-3" : "px-3",
                            "mx-1",
                        )}
                    >
                        <LogOut
                            size={22}
                            className={cn("flex-shrink-0", collapsed ? "mx-auto" : "")}
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