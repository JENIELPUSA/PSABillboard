import { ChartColumn, Home, NotepadText, Package, PackagePlus, Settings, ShoppingBag, UserCheck, UserPlus, Users} from "lucide-react";
export const navbarLinks = [
    {
        title: "Dashboard",
        links: [
            {
                label: "HOME",
                icon: Home,
                path: "/dashboard",
            },
            {
                label: "Citizen Character",
                icon: Users,
                path: "/dashboard/citizencharacter",
            },
            {
                label: "5S Corner",
                icon: ChartColumn,
                path: "/dashboard/corners",
            },
            {
                label: "QMS Corner",
                icon: ChartColumn,
                path: "/dashboard/qmscorner",
            },
            {
                label: "GAD Corner",
                icon: ChartColumn,
                path: "/dashboard/gadcorner",
            }

        ],
    }
];

