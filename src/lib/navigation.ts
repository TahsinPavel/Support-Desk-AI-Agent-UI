import {
  Home,
  MessageSquare,
  MessageCircle,
  Mail,
  Phone,
  Settings,
  Calendar,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Appointments",
    href: "/dashboard/appointments",
    icon: Calendar,
  },
  {
    title: "SMS",
    href: "/dashboard/sms",
    icon: MessageSquare,
  },
  {
    title: "Chat",
    href: "/dashboard/chat",
    icon: MessageCircle,
  },
  {
    title: "Email",
    href: "/dashboard/email",
    icon: Mail,
  },
  {
    title: "Voice",
    href: "/dashboard/voice",
    icon: Phone,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];