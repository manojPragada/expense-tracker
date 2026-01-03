import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import { Link, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
    BarChart3,
    Calendar,
    Plus,
    FileText,
    Tag,
    Sun,
    Moon,
    ChevronRight,
    ChevronsLeft,
    Menu,
    X,
    ChevronDown,
} from "lucide-react";

export default function AuthenticatedLayout({ header, children }) {
    const { props } = usePage();
    const user = props.auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(
        localStorage.getItem("sidebarCollapsed") === "true"
    );
    const [darkMode, setDarkMode] = useState(
        localStorage.getItem("darkMode") === "true" ||
            (!localStorage.getItem("darkMode") &&
                window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
    const [hoveredItem, setHoveredItem] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("darkMode", darkMode.toString());
    }, [darkMode]);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    const toggleSidebarCollapse = () => {
        const newState = !sidebarCollapsed;
        setSidebarCollapsed(newState);
        localStorage.setItem("sidebarCollapsed", newState.toString());
    };

    const navigation = [
        {
            name: "Overview",
            href: route("overview"),
            icon: <BarChart3 className="w-5 h-5" />,
        },
        {
            name: "Weekly Overview",
            href: route("weekly-overview"),
            icon: <Calendar className="w-5 h-5" />,
        },
        {
            name: "Submit Income/Expense",
            href: route("submit"),
            icon: <Plus className="w-5 h-5" />,
        },
        {
            name: "View Submissions",
            href: route("submissions"),
            icon: <FileText className="w-5 h-5" />,
        },
        {
            name: "Categories",
            href: route("categories"),
            icon: <Tag className="w-5 h-5" />,
        },
    ];

    const isActive = (href) => {
        const currentPath = window.location.pathname;
        let hrefPath;
        try {
            if (href.startsWith("http")) {
                hrefPath = new URL(href).pathname;
            } else {
                hrefPath = href;
            }
        } catch {
            hrefPath = href;
        }
        return currentPath === hrefPath;
    };

    const handleMouseEnter = (itemName, event) => {
        if (sidebarCollapsed) {
            const rect = event.currentTarget.getBoundingClientRect();
            setTooltipPosition({
                top: rect.top + rect.height / 2,
                left: rect.right + 8,
            });
            setHoveredItem(itemName);
        }
    };

    const handleMouseLeave = () => {
        setHoveredItem(null);
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-50 bg-white dark:bg-gray-800 border-r-2 border-gray-300 dark:border-gray-700 shadow-xl transform transition-all duration-300 ease-in-out ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                } lg:translate-x-0 ${
                    sidebarCollapsed ? "lg:w-20" : "lg:w-64"
                } w-64 overflow-visible`}
            >
                <div className="flex flex-col h-full">
                    {/* Collapse Toggle */}
                    <div
                        className={`flex items-center h-16 border-b-2 border-gray-300 dark:border-gray-700 ${
                            sidebarCollapsed
                                ? "justify-center px-4"
                                : "justify-end px-6"
                        }`}
                    >
                        {/* Collapse button for desktop */}
                        {!sidebarCollapsed && (
                            <h2 className="hidden lg:block text-xl font-bold text-gray-900 dark:text-white text-left w-full py-4">
                                Expense Tracker
                            </h2>
                        )}
                        <button
                            onClick={toggleSidebarCollapse}
                            className="hidden lg:block text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            {sidebarCollapsed ? (
                                <ChevronRight className="w-5 h-5" />
                            ) : (
                                <ChevronsLeft className="w-5 h-5" />
                            )}
                        </button>
                        {/* Close button for mobile */}
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-1 py-6 space-y-2 overflow-y-auto overflow-x-visible">
                        {navigation.map((item) => {
                            const active = isActive(item.href);
                            return (
                                <div
                                    key={item.name}
                                    className="relative"
                                    onMouseEnter={(e) =>
                                        handleMouseEnter(item.name, e)
                                    }
                                    onMouseLeave={handleMouseLeave}
                                >
                                    <Link
                                        href={item.href}
                                        className={`flex items-center ${
                                            sidebarCollapsed
                                                ? "lg:justify-center"
                                                : "space-x-3"
                                        } px-4 py-3 rounded-lg transition-all duration-200 ${
                                            active
                                                ? "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 shadow-md border-2 border-indigo-200 dark:border-indigo-800"
                                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white hover:shadow-sm border-2 border-transparent"
                                        }`}
                                    >
                                        <span
                                            className={`flex-shrink-0 ${
                                                active
                                                    ? "text-indigo-600 dark:text-indigo-400"
                                                    : "text-gray-500 dark:text-gray-400"
                                            }`}
                                        >
                                            {item.icon}
                                        </span>
                                        {!sidebarCollapsed && (
                                            <span className="font-medium hidden lg:block">
                                                {item.name}
                                            </span>
                                        )}
                                        <span className="font-medium lg:hidden">
                                            {item.name}
                                        </span>
                                    </Link>
                                </div>
                            );
                        })}
                    </nav>

                    {/* Dark Mode Toggle */}
                    <div className="px-0 py-3 border-t-2 border-gray-300 dark:border-gray-700">
                        <button
                            onClick={toggleDarkMode}
                            className={`flex items-center w-full ${
                                sidebarCollapsed
                                    ? "lg:justify-center"
                                    : "justify-between"
                            } w-full px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600`}
                            aria-label="Toggle dark mode"
                        >
                            <div
                                className={`flex items-center ${
                                    sidebarCollapsed
                                        ? "lg:justify-center"
                                        : "space-x-3"
                                }`}
                            >
                                {darkMode ? (
                                    <Sun className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                                ) : (
                                    <Moon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                )}
                                {!sidebarCollapsed && (
                                    <span className="font-medium hidden lg:block">
                                        {darkMode ? "Light Mode" : "Dark Mode"}
                                    </span>
                                )}
                                <span className="font-medium lg:hidden">
                                    {darkMode ? "Light Mode" : "Dark Mode"}
                                </span>
                            </div>
                            {!sidebarCollapsed && (
                                <div
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 hidden lg:flex ${
                                        darkMode
                                            ? "bg-indigo-600"
                                            : "bg-gray-300"
                                    }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                                            darkMode
                                                ? "translate-x-6"
                                                : "translate-x-1"
                                        }`}
                                    />
                                </div>
                            )}
                            <div
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 lg:hidden ${
                                    darkMode ? "bg-indigo-600" : "bg-gray-300"
                                }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                                        darkMode
                                            ? "translate-x-6"
                                            : "translate-x-1"
                                    }`}
                                />
                            </div>
                        </button>
                    </div>

                    {/* User Section */}
                    <div className="border-t-2 border-gray-300 dark:border-gray-700 py-2 px-3">
                        <div className="space-y-2">
                            {/* User Button */}
                            <button
                                onClick={() =>{
                                        setSidebarCollapsed(false);
                                        setTimeout(() => {
                                            setHoveredItem(
                                                hoveredItem === "user" ? null : "user"
                                            );
                                        }, sidebarCollapsed ? 300 : 0);
                                    }
                                }
                                className={`flex items-center w-full rounded-lg text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 ${
                                    sidebarCollapsed ? "lg:justify-center" : ""
                                }`}
                            >
                                <div
                                    className={`flex items-center ${
                                        sidebarCollapsed
                                            ? "lg:justify-center"
                                            : "space-x-3 flex-1"
                                    }`}
                                >
                                    <div className="flex-shrink-0">
                                        <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                                            <span className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm">
                                                {user.name
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                    {!sidebarCollapsed && (
                                        <div className="w-full flex items-center py-2">
                                            <div className="py-1 px-1">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                    {user.name}
                                                </p>
                                                <p className="hidden text-xs text-gray-500 dark:text-gray-400 truncate">
                                                    {user.email}
                                                </p>
                                            </div>
                                            <ChevronDown
                                                className={`w-5 h-5 text-gray-400 dark:text-gray-500 ml-auto transition-transform duration-200 ${
                                                    hoveredItem === "user"
                                                        ? "rotate-180"
                                                        : ""
                                                }`}
                                            />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0 lg:hidden">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                            {user.name}
                                        </p>
                                        <p className="hidden text-xs text-gray-500 dark:text-gray-400 truncate">
                                            {user.email}
                                        </p>
                                    </div>
                                </div>
                            </button>

                            {/* Dropdown Options - Inline */}
                            {hoveredItem === "user" && (
                                <div className="space-y-1 px-2">
                                    <Link
                                        href={route("profile.edit")}
                                        className="block w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                                    >
                                        Profile
                                    </Link>
                                    <Link
                                        href={route("logout")}
                                        method="post"
                                        as="button"
                                        className="block w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                                    >
                                        Log Out
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div
                className={`flex-1 transition-all duration-300 ${
                    sidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
                }`}
            >
                {/* Top Bar (mobile menu button) */}
                <div className="flex md:hidden sticky top-0 z-30 h-16 items-center justify-between bg-white dark:bg-gray-800 border-b-2 border-gray-300 dark:border-gray-700 px-4 sm:px-6 lg:px-8 shadow-md">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>

                {/* Page Header */}
                {header && (
                    <header className="bg-white dark:bg-gray-800 shadow-md border-b-2 border-gray-300 dark:border-gray-700">
                        <div className="mx-auto max-w-full px-4 py-6 sm:px-6 lg:px-8">
                            {header}
                        </div>
                    </header>
                )}

                {/* Main Content Area */}
                <main className="py-2 bg-gray-100 dark:bg-gray-900 min-h-screen">
                    <div className="mx-auto max-w-full px-2">{children}</div>
                </main>
            </div>

            {/* Tooltip Portal - renders outside the sidebar to avoid clipping */}
            {hoveredItem &&
                sidebarCollapsed &&
                typeof document !== "undefined" &&
                createPortal(
                    <div
                        className="fixed px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg shadow-xl whitespace-nowrap z-[9999] pointer-events-none hidden lg:block"
                        style={{
                            top: `${tooltipPosition.top}px`,
                            left: `${tooltipPosition.left}px`,
                            transform: "translateY(-50%)",
                        }}
                    >
                        {hoveredItem}
                        <div className="absolute right-full top-1/2 -translate-y-1/2 mr-[-1px] border-4 border-transparent border-r-gray-900 dark:border-r-gray-700"></div>
                    </div>,
                    document.body
                )}
        </div>
    );
}
