import { forwardRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { navbarLinks } from "@/constants";
import logo from "../assets/psa-logo.mp4";
import { useAuth } from "../contexts/AuthContext";
import { cn } from "@/utils/cn";
import { LogOut } from "lucide-react";

export const Sidebar = forwardRef((props, ref) => {
    const { logout, role } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/dashboard");
        } catch (error) {
            console.error("Failed to log out:", error);
        }
    };

    // ✅ NO ROLE BLOCKING — just optional filtering
    const filteredNavLinks = navbarLinks
        .map((group) => ({
            ...group,
            links: group.links.filter((link) => {
                // If no role requirement → always show
                if (!link.requiredRole) return true;

                // If requiredRole exists but user has no role → still allow (guest mode)
                if (!role) return true;

                // Normal role check
                return role === link.requiredRole;
            }),
        }))
        .filter((group) => group.links.length > 0);

    return (
        <aside
            ref={ref}
            className={cn(
                "fixed z-[100] flex h-full w-[260px] flex-col overflow-x-hidden border-r border-blue-800 bg-[#0038A8] text-white dark:bg-[#001f5c]"
            )}
        >
            {/* HEADER */}
            <div className="flex flex-col items-center justify-center gap-y-3 p-6 border-b border-blue-700/50">
                <video
                    src={logo}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-24 h-24 rounded-full border-2 border-yellow-400 object-cover bg-white"
                />

                <div className="text-center">
                    <p className="text-[10px] uppercase tracking-widest text-yellow-400 font-bold">
                        Republic of the Philippines
                    </p>
                    <p className="text-sm font-black leading-tight text-white mt-1">
                        PHILIPPINE STATISTICS <br /> AUTHORITY
                    </p>
                </div>
            </div>

            {/* NAVIGATION (ALWAYS CLICKABLE) */}
            <div className="flex w-full flex-col gap-y-6 overflow-y-auto p-4">
                {filteredNavLinks.map((group) => (
                    <nav key={group.title} className="flex flex-col gap-y-2">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-yellow-500/80 mb-1 px-3">
                            {group.title}
                        </p>

                        {group.links.map((link) => (
                            <NavLink
                                key={link.label}
                                to={link.path}
                                className={({ isActive }) =>
                                    cn(
                                        "flex items-center gap-x-3 px-3 py-3 rounded-lg transition-all duration-200",
                                        isActive
                                            ? "bg-white/10 text-yellow-400 border-l-4 border-yellow-400"
                                            : "text-blue-100 hover:bg-white/5 hover:text-white"
                                    )
                                }
                            >
                                <link.icon size={20} />
                                <span className="text-[14px] font-semibold">
                                    {link.label}
                                </span>
                            </NavLink>
                        ))}
                    </nav>
                ))}
            </div>

            {/* LOGOUT (OPTIONAL — only if logged in) */}
            {role && (
                <div className="mt-auto border-t border-yellow-700 p-4">
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-blue-100 hover:bg-yellow-800"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            )}
        </aside>
    );
});

Sidebar.displayName = "Sidebar";