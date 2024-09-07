"use client"
import React, { useState, useEffect } from 'react';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Activity, Trophy, Calendar, Globe, Home, Menu, X, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import { Button } from '../ui/button';

const Accordion = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="border-b border-gray-200">
            <button
                className="flex items-center justify-between w-full p-4 text-left"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
            >
                <span className="flex items-center text-gray-700">
                    <span>{title}</span>
                </span>
                {isOpen ? <ChevronUp className="w-4 h-4" aria-hidden="true" /> : <ChevronDown className="w-4 h-4" aria-hidden="true" />}
            </button>
            {isOpen && <div className="p-4 bg-gray-50">{children}</div>}
        </div>
    )
}
function Navbar() {
    const [navbarData, setNavbarData] = useState(null)
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const toggleMenu = () => {
        setIsOpen(!isOpen)
    }
    useEffect(() => {
        const fetchNavBarData = async () => {
            try {
                const response = await axios.get(process.env.NEXT_PUBLIC_BASE + '/api/nav')
                setNavbarData(response.data)
            } catch (error) {
                console.error('Error fetching navbar data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchNavBarData()

        const handleOutsideClick = (event) => {
            if (isOpen && !(event.target.closest('.drawer-content'))) {
                setIsOpen(false)
            }
        }

        document.addEventListener('click', handleOutsideClick)

        return () => {
            document.removeEventListener('click', handleOutsideClick)
        }
    }, [isOpen])


    if (loading) {
        return <NavbarSkeleton />
    }

    if (!navbarData) {
        return null
    }
    return (
        <header className="bg-white shadow-md sticky top-0 left-0 w-full z-50">
            <div className="container mx-auto px-4">
                <nav className="flex items-center justify-between h-16">
                    {/* Logo and Brand */}
                    <div className="flex-shrink-0 flex items-center">
                        <img src={navbarData.logoSrc} alt={`${navbarData.brandText} logo`} width={32} height={32} className="mr-2" />
                        <Link href="/" className="text-xl font-bold text-green-600 hover:text-green-800 transition-colors">
                            {navbarData.brandText}
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="xl:hidden">
                        <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label="Toggle menu">
                            <Menu className="w-6 h-6" />
                        </Button>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden xl:flex items-center">
                        <NavigationMenu>
                            <NavigationMenuList>
                                {navbarData.navLinks.map((link, index) => (
                                    <NavigationMenuItem key={index}>
                                        {link.href ? (
                                            <Link href={link.href} legacyBehavior passHref>
                                                <NavigationMenuLink className="px-3 py-2 text-gray-700 hover:text-green-600 transition-colors">
                                                    {link.title}
                                                </NavigationMenuLink>
                                            </Link>
                                        ) : (
                                            <>
                                                <NavigationMenuTrigger className="text-gray-700 hover:text-green-600 transition-colors">
                                                    {link.title}
                                                </NavigationMenuTrigger>
                                                <NavigationMenuContent>
                                                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                                        {link.items?.map((item, itemIndex) => (
                                                            <li key={itemIndex}>
                                                                <NavigationMenuLink asChild className="px-3 py-2 text-gray-700 hover:text-green-600 transition-colors">
                                                                    <Link
                                                                        href={item.link}
                                                                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                                                    >
                                                                        <div className="text-sm font-medium leading-none">{item.text}</div>
                                                                    </Link>
                                                                </NavigationMenuLink>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </NavigationMenuContent>
                                            </>
                                        )}
                                    </NavigationMenuItem>
                                ))}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>
                </nav>
            </div>

            {/* Mobile Drawer */}
            <div
                className={`fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    } xl:hidden transition-transform duration-300 ease-in-out z-30 w-64 sm:w-80 bg-white shadow-lg`}
                aria-hidden={!isOpen}
            >
                <div className="drawer-content h-full flex flex-col">
                    <div className="flex items-center justify-between p-4 border-b">
                        <span className="font-semibold text-xl">Menu</span>
                        <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label="Close menu">
                            <X className="w-6 h-6" />
                        </Button>
                    </div>
                    <nav className="flex-grow overflow-y-auto">
                        {navbarData.navLinks.map((link, index) => (
                            link.href ? (
                                <Link
                                    key={index}
                                    href={link.href}
                                    className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                                    onClick={toggleMenu}
                                >
                                    {link.title}
                                </Link>
                            ) : (
                                <Accordion key={index} title={link.title}>
                                    <ul className="space-y-2">
                                        {link.items?.map((item, itemIndex) => (
                                            <li key={itemIndex}>
                                                <Link
                                                    href={item.link}
                                                    className="block px-2 py-1 rounded-md text-gray-700 hover:bg-green-100 hover:text-green-600 transition-colors"
                                                    onClick={toggleMenu}
                                                >
                                                    {item.text}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </Accordion>
                            )
                        ))}
                    </nav>
                </div>
            </div>

            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 xl:hidden"
                    onClick={toggleMenu}
                    aria-hidden="true"
                />
            )}
        </header>
    );
};

export default Navbar;


function NavbarSkeleton() {
    return (
        <header className="bg-white shadow-md sticky top-0 left-0 w-full z-50">
            <div className="container mx-auto px-4">
                <nav className="flex items-center justify-between h-16">
                    {/* Logo and Brand Skeleton */}
                    <div className="flex-shrink-0 flex items-center">
                        <div className="w-8 h-8 bg-gray-200 rounded-full mr-2 animate-pulse" />
                        <div className="w-32 h-6 bg-gray-200 rounded animate-pulse" />
                    </div>

                    {/* Mobile Menu Button Skeleton */}
                    <div className="xl:hidden">
                        <Button variant="ghost" size="icon" disabled>
                            <Menu className="w-6 h-6 text-gray-300" />
                        </Button>
                    </div>

                    {/* Desktop Navigation Skeleton */}
                    <div className="hidden xl:flex items-center space-x-4">
                        {[...Array(5)].map((_, index) => (
                            <div key={index} className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
                        ))}
                    </div>
                </nav>
            </div>
        </header>
    )
}