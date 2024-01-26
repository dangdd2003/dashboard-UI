import {
  BeakerIcon,
  HomeIcon,
  LightBulbIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

export const NavBarData = [
  {
    title: "Home",
    path: "/home",
    icon: HomeIcon,
  },
  {
    title: "Explorer",
    path: "/explorer",
    icon: UserGroupIcon,
  },
  {
    title: "Your Workspace",
    path: "/profile",
    icon: LightBulbIcon,
  },

  {
    title: "My Tests",
    path: "/tests",
    icon: BeakerIcon,
  },
];
