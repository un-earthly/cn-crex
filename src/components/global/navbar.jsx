"use client"
import React, { useState, useEffect } from 'react';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Activity, Trophy, Calendar, Globe, Home, Menu, X, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';

const Accordion = ({ title, icon, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-gray-200">
            <button
                className="flex items-center justify-between w-full p-4 text-left"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="flex items-center text-gray-700">
                    {icon}
                    <span className="ml-2">{title}</span>
                </span>
                {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {isOpen && <div className="p-4 bg-gray-50">{children}</div>}
        </div>
    );
};

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    // Close drawer when clicking outside
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (isOpen && !event.target.closest('.drawer-content')) {
                setIsOpen(false);
            }
        };

        document.addEventListener('click', handleOutsideClick);

        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, [isOpen]);

    const menuItems = [
        {
            title: 'Stats',
            icon: <Activity className="w-4 h-4" />,
            children: [
                  { href: "/stats/teams", icon: Trophy, label: "Team Rankings" },
                { href: "/stats/players", icon: Trophy, label: "Player Rankings" },
            ],
        },
        {
            title: 'Fixtures',
            icon: <Calendar className="w-4 h-4" />,
            children: [
                { href: "/fixtures/international", icon: Globe, label: "International Series" },
                { href: "/fixtures/local", icon: Home, label: "Local Series" },
            ],
        },
    ];

    return (
        <header className="bg-white shadow-md sticky top-0 left-0 w-full z-50">
            <div className="container mx-auto px-4">
                <nav className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link
                            href="/"
                            className="text-xl font-bold text-green-600 hover:text-green-800 transition-colors"
                        >
                            CN
                        </Link>
                    </div>

                    {/* Mobile and Tablet Menu Button */}
                    <div className="xl:hidden">
                        <button onClick={toggleMenu} className="text-gray-700 hover:text-green-600 transition-colors">
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Desktop and Large Tablet Navigation */}
                    <div className="hidden xl:flex items-center">
                        <NavigationMenu>
                            <NavigationMenuList className="flex space-x-4">
                                <NavigationMenuItem>
                                    <Link href="/"
                                        passHref
                                        legacyBehavior
                                    >
                                        <NavigationMenuLink

                                            className="px-3 py-2 text-gray-700 hover:text-green-600 transition-colors"
                                        >
                                            <Home className="w-4 h-4 inline-block mr-1" />
                                            Home
                                        </NavigationMenuLink>
                                    </Link>
                                </NavigationMenuItem>

                                {menuItems.map((item, index) => (
                                    <NavigationMenuItem key={index}>
                                        <NavigationMenuTrigger className="text-gray-700 hover:text-green-600 transition-colors">
                                            {item.icon}
                                            <span className="ml-1">{item.title}</span>
                                        </NavigationMenuTrigger>
                                        <NavigationMenuContent>
                                            <ul className="grid gap-3 p-4 w-[400px] lg:w-[500px] lg:grid-cols-2">
                                                {item.children.map((subItem, subIndex) => (
                                                    <li key={subIndex}>
                                                        <Link
                                                            passHref
                                                            href={subItem.href}
                                                            legacyBehavior
                                                        >
                                                            <NavigationMenuLink
                                                                className="flex items-center p-2 rounded-md text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                                                            >
                                                                <subItem.icon className="w-4 h-4 mr-2" />
                                                                {subItem.label}
                                                            </NavigationMenuLink>
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </NavigationMenuContent>
                                    </NavigationMenuItem>
                                ))}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>
                </nav>
            </div>

            {/* Mobile and Tablet Drawer */}
            <div className={`fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} xl:hidden transition-transform duration-300 ease-in-out z-30 w-64 sm:w-80 bg-white shadow-lg`}>
                <div className="drawer-content h-full flex flex-col">
                    <div className="flex items-center justify-between p-4 border-b">
                        <span className="font-semibold text-xl">Menu</span>
                        <button onClick={toggleMenu} className="text-gray-500 hover:text-gray-700">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    <nav className="flex-grow overflow-y-auto">
                        <div className="border-b border-gray-200">
                            <a href="/" className="flex items-center p-4 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors">
                                <Home className="w-4 h-4 mr-2" />
                                Home
                            </a>
                        </div>
                        {menuItems.map((item, index) => (
                            <Accordion key={index} title={item.title} icon={item.icon}>
                                <ul className="space-y-2">
                                    {item.children.map((subItem, subIndex) => (
                                        <li key={subIndex}>
                                            <Link
                                                href={subItem.href}
                                                className="flex items-center p-2 rounded-md text-gray-700 hover:bg-green-100 hover:text-green-600 transition-colors"
                                            >
                                                <subItem.icon className="w-4 h-4 mr-2" />
                                                {subItem.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </Accordion>
                        ))}
                    </nav>
                </div>
            </div>

            {
                isOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-20 xl:hidden" onClick={toggleMenu}></div>
                )
            }
        </header >
    );
};

export default Navbar;