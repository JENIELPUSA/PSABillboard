import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "react-toastify/dist/ReactToastify.css";
import LoadingIntro from "../../ReusableFolder/loadingIntro";
import ForgotPassword from "../Login/ForgotPassword";
import logo from "../../assets/logo.png";
import { Lock, Mail, ShieldCheck, Database, LayoutDashboard } from "lucide-react"; // Changed FileSpreadsheet to LayoutDashboard
import { motion, AnimatePresence } from "framer-motion";
import LoginStatusModal from "../../ReusableFolder/LogInStatusModal";

export default function AuthForm() {
    const [isForgotPassword, setForgotPassword] = useState(false);
    const [loginStatus, setLoginStatus] = useState({
        show: false,
        status: "success",
        message: "",
    });
    const [showPassword, setShowPassword] = useState(false);

    const [values, setValues] = useState({
        email: "",
        password: "",
    });

    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleInput = useCallback((event) => {
        const { name, value } = event.target;
        setValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    }, []);

    const toggleShowPassword = useCallback(() => {
        setShowPassword((prev) => !prev);
    }, []);

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const response = await login(values.email, values.password);

        if (response.success) {
            setLoginStatus({
                show: true,
                status: "success",
                message: "Login successful!",
            });
            setIsLoading(false);
        } else {
            setIsLoading(false);
            setLoginStatus({
                show: true,
                status: "error",
                message: response.message || "Login failed. Please check your credentials.",
            });
        }
    };

    const handleModalClose = () => {
        setLoginStatus((prev) => ({ ...prev, show: false }));
        if (loginStatus.status === "success") {
            navigate("/dashboard");
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
    };

    return (
        <>
            {/* Full-screen Loading Overlay */}
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        key="loading-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
                    >
                        <LoadingIntro />
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="font-inter flex min-h-screen items-center justify-center overflow-hidden bg-gray-100 p-4 dark:bg-gray-900">
                
                {/* Login Status Modal */}
                <LoginStatusModal
                    isOpen={loginStatus.show}
                    onClose={handleModalClose}
                    status={loginStatus.status}
                    customMessage={loginStatus.message}
                />

                <motion.div
                    className="relative z-10 flex w-full max-w-4xl overflow-hidden rounded-2xl shadow-2xl"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Left Column - PSA Biliran Billboard Section */}
                    <div className="relative hidden w-2/5 flex-col items-center justify-between overflow-hidden bg-gradient-to-b from-blue-950 via-blue-900 to-slate-900 p-10 text-white md:flex text-center"
                         style={{
                             borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                         }}>
                        
                        {/* Billboard Geometric Header Pattern (Official Government Tri-Color Line) */}
                        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 via-yellow-400 to-red-600"></div>

                        {/* Agency Identity Header */}
                        <div className="relative z-10 flex flex-col items-center mt-2">
                            <span className="text-[9px] font-bold tracking-widest text-blue-300 uppercase">
                                Republic of the Philippines
                            </span>
                            <span className="text-xs font-black tracking-wider text-white uppercase mt-0.5">
                                Philippine Statistics Authority
                            </span>
                            <span className="text-[11px] font-bold text-yellow-400 tracking-wide">
                                Biliran Provincial Statistical Office
                            </span>
                        </div>

                        {/* Main Campaign Message */}
                        <div className="relative z-10 flex flex-col items-center my-auto">
                            <motion.div
                                className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 border border-white/20 shadow-lg backdrop-blur-md"
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                                transition={{ delay: 0.3 }}
                            >
                                <LayoutDashboard className="h-11 w-11 text-yellow-400 animate-pulse" />
                            </motion.div>

                            <motion.h1
                                className="mb-3 text-2xl font-extrabold uppercase tracking-tight leading-tight text-white"
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                                transition={{ delay: 0.4 }}
                            >
                                Official <br />
                                <span className="text-yellow-400 text-3xl font-black">Announcements,</span> <br />
                                Fast and Reliable!
                            </motion.h1>

                            <motion.div 
                                className="w-16 h-1 bg-red-500 my-1 rounded-full"
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                                transition={{ delay: 0.5 }}
                            />

                            <motion.p
                                className="text-[11px] text-slate-200 max-w-xs font-medium leading-relaxed mt-2"
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                                transition={{ delay: 0.6 }}
                            >
                                Reminder from PSA Biliran: This portal is intended for the management of internal announcements, memos, and important office notices.
                            </motion.p>
                        </div>

                        {/* Footer / Transparency Tag */}
                        <div className="relative z-10 flex flex-col items-center gap-1">
                            <div className="flex items-center gap-1 text-[9px] font-bold tracking-wider text-slate-400 uppercase">
                                <Database size={10} className="text-emerald-400" /> Secure E-Bulletin Board Portal
                            </div>
                            <span className="text-[9px] text-slate-500">
                                © 2026 PSA Biliran · Systems & ICT Division
                            </span>
                        </div>
                    </div>

                    {/* Right Column - Login Form */}
                    <div className="flex w-full flex-col justify-center bg-white p-8 md:w-3/5 md:p-12">
                        <motion.div
                            className="mb-8 text-center"
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 0.2 }}
                        >
                            <div className="mb-4 xs:mb-2 flex justify-center">
                                <img
                                    src={logo}
                                    alt="PSA Logo"
                                    className="h-28 w-28 xs:h-20 xs:w-20 object-contain"
                                />
                            </div>
                            <h2 className="text-center text-2xl font-black leading-tight tracking-tight uppercase text-slate-800">
                                <span className="block text-blue-700 text-3xl font-black normal-case tracking-normal">PSA Biliran</span>
                                <span className="block text-slate-600 text-xs font-bold tracking-widest mt-1">Digital Bulletin Board System</span>
                            </h2>

                            <p className="text-xs mt-2 text-gray-500">Authorized personnel login only</p>
                        </motion.div>

                        <form
                            className="space-y-5 xs:space-y-3"
                            onSubmit={handleLoginSubmit}
                        >
                            <motion.div
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                                transition={{ delay: 0.7 }}
                            >
                                <label
                                    htmlFor="email"
                                    className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-700"
                                >
                                    PSA Email Address
                                </label>
                                <div className="relative">
                                    <Mail
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                        size={18}
                                    />
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={values.email}
                                        onChange={handleInput}
                                        disabled={isLoading}
                                        className="w-full rounded-lg border border-gray-300 bg-gray-50/50 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 transition-all duration-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 disabled:opacity-50"
                                        placeholder="username@psa.gov.ph"
                                        required
                                    />
                                </div>
                            </motion.div>

                            <motion.div
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                                transition={{ delay: 0.8 }}
                            >
                                <label
                                    htmlFor="password"
                                    className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-700"
                                >
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                        size={18}
                                    />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        value={values.password}
                                        onChange={handleInput}
                                        disabled={isLoading}
                                        className="w-full rounded-lg border border-gray-300 bg-gray-50/50 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 transition-all duration-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 disabled:opacity-50"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </motion.div>

                            <motion.div
                                className="flex items-center justify-between text-xs font-medium"
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                                transition={{ delay: 0.9 }}
                            >
                                <div className="flex items-center">
                                    <input
                                        id="show-password"
                                        name="show-password"
                                        type="checkbox"
                                        checked={showPassword}
                                        onChange={toggleShowPassword}
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <label
                                        htmlFor="show-password"
                                        className="ml-2 block text-gray-700 select-none"
                                    >
                                        Show Password
                                    </label>
                                </div>
                                <a
                                    onClick={() => setForgotPassword(true)}
                                    className="cursor-pointer font-bold text-blue-600 hover:text-blue-800 hover:underline"
                                >
                                    Forgot password?
                                </a>
                            </motion.div>

                            <motion.button
                                type="submit"
                                className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-bold tracking-wider uppercase text-white shadow-md transition-all duration-300 ${
                                    isLoading
                                        ? "cursor-not-allowed bg-blue-400"
                                        : "active:scale-[0.98] bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 shadow-blue-900/10"
                                }`}
                                disabled={isLoading}
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                                transition={{ delay: 1.0 }}
                            >
                                {isLoading ? "Verifying Login..." : "Log In"}
                            </motion.button>
                        </form>
                    </div>

                    <ForgotPassword
                        show={isForgotPassword}
                        onClose={() => {
                            setForgotPassword(false);
                        }}
                    />
                </motion.div>
            </div>
        </>
    );
}