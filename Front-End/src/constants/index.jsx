import {
    FolderArchive,
    Home,
    NotepadText,
    Package,
    PackagePlus,
    Settings,
    ShoppingBag,
    UserCheck,
    UserPlus,
    Users
} from "lucide-react";

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
                label: "Citizen's Charter",
                icon: FolderArchive,
                path: "/dashboard/citizencharacter",
            },
            {
                label: "5S Corner",
                icon: FolderArchive,
                path: "/dashboard/corners",
            },
            {
                label: "QMS Corner",
                icon: FolderArchive,
                path: "/dashboard/qmscorner",
            },
            {
                label: "GAD Corner",
                icon: FolderArchive,
                path: "/dashboard/gadcorner",
            }
        ],
    }
];