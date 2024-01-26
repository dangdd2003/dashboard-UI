import { ArrowRightEndOnRectangleIcon, Cog6ToothIcon, LifebuoyIcon, UserCircleIcon } from "@heroicons/react/24/outline";

export const SidebarData = [
    {
        title: "My Profile",
        path: "/profile",
        icon: UserCircleIcon,
    },
    {
        title: "Settings",
        path: "/settings",
        icon: Cog6ToothIcon,
    },
    {
        title: "User Management",
        path: "/user-management",
        icon: LifebuoyIcon,
    },
    {
        title: "Sign Out",
        path: "/signout",
        icon: ArrowRightEndOnRectangleIcon,
    },
];