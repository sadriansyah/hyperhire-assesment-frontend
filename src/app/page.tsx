"use client";
import Sidebar from "../components/Sidebar";
import { FolderIcon, LayoutGrid } from "lucide-react";
import MenuStructure from "@/components/MenuStructure";
import MenuDetail from "@/components/MenuDetail";
import { useEffect, useState } from "react";
import Image from 'next/image';

const Home = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);

  const updateWindowWidth = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    updateWindowWidth();
    window.addEventListener("resize", updateWindowWidth);

    return () => {
      window.removeEventListener("resize", updateWindowWidth);
    };
  }, []);

   useEffect(() => {
    if (windowWidth < 1024) {
      setIsSidebarVisible(false);
    } else {
      setIsSidebarVisible(true);
    }
  }, [windowWidth]);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isVisible={isSidebarVisible} toggleSidebar={toggleSidebar} />

      <div className="flex-1 p-8 flex flex-col overflow-y-auto">

        {!isSidebarVisible && (
          <Image className="mb-4 cursor-pointer" src="/menu-close.svg" alt="logo icon" width={30} height={4} onClick={toggleSidebar} />
        )}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-6">
            <FolderIcon className="w-4 h-4 text-gray-300" fill="#D0D5DD" />
            <span className="text-gray-400">/</span>
            <span>Menus</span>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex bg-blue-600 p-4 rounded-full">
              <LayoutGrid className="w-4 h-4 text-white" fill="white" />
            </div>
            <h1 className="text-2xl font-semibold">Menus</h1>
          </div>

          <div className="flex flex-wrap lg:flex-nowrap gap-6">
            <MenuStructure />
            <MenuDetail />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
