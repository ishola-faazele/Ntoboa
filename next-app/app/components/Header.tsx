"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, Search, X } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import CreateCharityModal from "./CreateCharityModal";
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isSearchOpen) setIsSearchOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isMenuOpen) setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Ntoboa
          </Link>

          {/* Main Navigation */}
          <div className="flex items-center">
            {/* Search Icon - Visible on all screens */}
            <button
              onClick={toggleSearch}
              className="p-2 text-gray-600 hover:text-blue-600 mr-2"
            >
              <Search size={24} />
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {/* <Link
                href="/create-charity"
                className="text-gray-600 hover:text-blue-600"
              >
                Create Charity
              </Link> */}
              <CreateCharityModal />
              <ConnectButton />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 text-gray-600 hover:text-blue-600"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Search Bar - For all screen sizes */}
        {isSearchOpen && (
          <div className="mt-4 relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full p-2 pr-10 border rounded-md focus:outline-none focus:border-blue-600"
              autoFocus
            />
            <button
              onClick={toggleSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600"
            >
              <X size={20} />
            </button>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-4 py-4 border-t">
            {/* <Link
              href="/create-charity"
              className="block text-gray-600 hover:text-blue-600"
            >
              Create Charity
            </Link> */}
            <CreateCharityModal />
            <div className="flex justify-start">
              <ConnectButton />
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
