"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";

const Header = () => {
  return (
    <header className="fixed top-0 w-full bg-white shadow-xs p-4 text-white flex items-center z-50">
      <Link href="/top" className="flex items-center">
        <img src="/sazanami_dev.svg" alt="Logo" className="h-10" />
      </Link>
      <nav className="ml-auto">
        <ul className="flex space-x-4 items-center">
          <li>
            <Link href="/top" className="text-gray-500 rounded-lg p-2 hover:bg-black hover:text-white transition duration-500 ease-in-out">
              <span className="mx-3">Top</span>
            </Link>
          </li>
          <li>
            <Link href="/announcement" className="text-gray-500 rounded-lg p-2 hover:bg-black hover:text-white transition duration-500 ease-in-out">
              <span className="mx-3">Announcement</span>
            </Link>
          </li>
          <li>
            <Link href="/member" className="text-gray-500 rounded-lg p-2 hover:bg-black hover:text-white transition duration-300 ease-in-out">
              <span className="mx-3">Member</span>
            </Link>
          </li>
          <li>
            <Link href="/project" className="text-gray-500 rounded-lg p-2 hover:bg-black hover:text-white transition duration-300 ease-in-out">
              <span className="mx-3">Project</span>
            </Link>
          </li>
          <li>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-gray-500 rounded-lg p-2 hover:bg-red-500 hover:text-white transition duration-300 ease-in-out"
            >
              <span className="mx-3">Logout</span>
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;