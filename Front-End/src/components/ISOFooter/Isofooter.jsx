import isoLogo from "../../assets/ISO 9001.png";

const ISOFooter = () => {
    return (
        <div className="flex flex-col items-center gap-8 py-20 border-t-4 border-[#0038A8] bg-slate-50 dark:bg-[#0b1120] mx-0 px-4 md:px-20 text-center">
            <div className="bg-white p-6 rounded-xl shadow-md border-b-4 border-[#CE1126]">
                <img
                    src={isoLogo}
                    alt="ISO 9001 Certified"
                    className="h-28 md:h-36 object-contain"
                />
            </div>

            <div className="space-y-3">
                <p className="text-[#0038A8] dark:text-blue-400 text-xl md:text-2xl font-black uppercase tracking-wider">
                    Philippine Statistics Authority
                </p>

                <div className="flex justify-center items-center gap-1 my-4">
                    <div className="w-10 h-1.5 bg-[#0038A8]"></div>
                    <div className="w-10 h-1.5 bg-[#CE1126]"></div>
                    <div className="w-10 h-1.5 bg-[#FCD116]"></div>
                </div>

                <p className="text-slate-600 dark:text-slate-400 text-sm font-bold uppercase tracking-widest">
                    System Design & Development
                </p>

                <p className="text-slate-800 dark:text-slate-200 font-semibold text-lg">
                    Michael Angelo M. Calleza{" "}
                    <span className="text-[#CE1126]">&</span> JENIEL A. PUSA
                </p>
            </div>
        </div>
    );
};

export default ISOFooter;