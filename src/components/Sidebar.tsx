import { FolderIcon, LayoutGrid } from "lucide-react";
import { useState } from "react";
import Image from 'next/image';

interface SidebarProps {
  isVisible: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ isVisible, toggleSidebar }: SidebarProps) => {
  const [isSystemDropdownOpen, setIsSystemDropdownOpen] = useState(true);

  const toggleSystemDropdown = () => {
    setIsSystemDropdownOpen(!isSystemDropdownOpen);
  };


  return (
    <div className={`m-4 rounded-xl h-full pb-10 flex ${isVisible ? 'block' : 'hidden'}`}>
      <div className="bg-gray-800 text-white w-64 h-full p-4 left-6 space-y-4 rounded-xl flex flex-col">
        <div className="p-4 flex justify-between items-center">
          <span className="text-white text-xl font-bold">
            <Image src="/cloit.png" alt="Logo" width={80} height={4} />
          </span>
          <Image src="/menu-open.svg" className="cursor-pointer" alt="logo icon" width={30} height={4} onClick={toggleSidebar} />
        </div>
        <nav className="flex-1 ">
          <div className="space-y-4 relative">
            <div className="bg-gray-700 py-2 rounded-xl">
              <div className="flex items-center gap-4 px-4 py-2 text-gray-50 rounded" onClick={() => toggleSystemDropdown()}>
                <FolderIcon className="w-5 h-5" fill="white" />
                <span>Systems</span>
              </div>

              {isSystemDropdownOpen && (
                <div className="space-y-2">
                  <div className="flex items-center gap-4 px-4 py-2 text-gray-500 rounded">
                    <LayoutGrid className="w-5 h-5" />
                    <span>System Code</span>
                  </div>

                  <div className="flex items-center gap-4 px-4 py-2 text-gray-500 rounded">
                    <LayoutGrid className="w-5 h-5" />
                    <span>Properties</span>
                  </div>

                  <div className="flex items-center bg-lime-500 gap-4 px-4 py-2 text-black rounded-2xl">
                    <LayoutGrid className="w-5 h-5" fill="#1D2939" />
                    <span>Menus</span>
                  </div>

                  <div className="flex items-center gap-4 px-4 py-2 text-gray-400 rounded">
                    <LayoutGrid className="w-5 h-5" />
                    <span>API List</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 px-4 py-2 text-gray-400 rounded">
              <FolderIcon className="w-5 h-5" />
              <span>Users & Group</span>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};
export default Sidebar;
