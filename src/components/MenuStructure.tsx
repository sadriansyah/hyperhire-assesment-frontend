import { AppDispatch, RootState } from "@/store";
import {
  addMenu,
  fetchDropdownItems,
  fetchMenuDetails,
  fetchMenus,
} from "@/store/menuSlice";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TreeItem from "./TreeItem";
import { Plus } from "lucide-react";

type Menu = {
  id: string;
  name: string;
  depth: number;
  parentId: string | null;
  parentName: string | null;
  parent: Menu;
  children: Menu[];
};

const MenuStructure = () => {
  const [isDropdown, setIsDropdown] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newMenuName, setNewMenuName] = useState("");
  const [parentId, setParentId] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const [expandedItems, setExpandedItems] = useState({});
  const { menus, loading, error } = useSelector(
    (state: RootState) => state.menus
  );
  const dropdownItems = useSelector(
    (state: RootState) => state.menus.dropdownItems
  );

  useEffect(() => {
    dispatch(fetchMenus({}));
    dispatch(fetchDropdownItems());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const toggleDropdown = () => {
    setIsDropdown(!isDropdown);
  };

  const handleExpandAll = () => {
    const allExpanded: Record<string | number, boolean> = {};
    const expandRecursively = (menu: Menu) => {
      allExpanded[menu.id] = true;
      if (menu.children) {
        menu.children.forEach(expandRecursively);
      }
    };
    menus.forEach(expandRecursively);
    setExpandedItems(allExpanded);
  };

  const handleCollapseAll = () => {
    setExpandedItems({});
  };

  const handleMenuClick = (menudId: number) => {
    dispatch(fetchMenuDetails(menudId));
  };

  const handleSelectionClick = (item: string) => {
    dispatch(fetchMenus({ menuId: item }));
    setIsDropdown(false);
  };

  const handleAddNewClick = (parentId: string) => {
    setParentId(parentId);
    setIsAddingNew(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    setNewMenuName(e.currentTarget.textContent || "");
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (newMenuName.trim()) {
        await dispatch(
          addMenu({
            name: newMenuName,
            parentId: parentId,
          })
        );
        dispatch(fetchMenus({}));
        setNewMenuName("");
        setIsAddingNew(false);
      }
    } else if (e.key === "Escape") {
      setNewMenuName("");
      setParentId("");
      setIsAddingNew(false);
    }
  };

  return (
    <div className="flex-1">
      <div className="">
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-2">Menu</label>
          <div className="relative w-80">
            <button
              className="w-full px-4 py-4 bg-gray-50  rounded-xl flex justify-between items-center"
              onClick={() => toggleDropdown()}
            >
              <span>{dropdownItems.length > 0 && dropdownItems[0].name}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {isDropdown && (
              <ul className="absolute mt-2 z-10 w-full bg-gray-50 border rounded-xl shadow-lg">
                {dropdownItems.map((item, index) => (
                  <li
                    key={index}
                    className="p-4 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSelectionClick(item.id)}
                  >
                    {item.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="flex gap-4 mb-6">
          <button
            className="px-8 py-2 bg-[#1C1F2E] text-white rounded-3xl"
            onClick={handleExpandAll}
          >
            Expand All
          </button>
          <button
            className="px-8 py-2 border rounded-3xl"
            onClick={handleCollapseAll}
          >
            Collapse All
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {menus.map((menu) => (
          <TreeItem
            key={menu.id}
            menu={menu}
            expandedItems={expandedItems}
            setExpandedItems={setExpandedItems}
            onClick={handleMenuClick}
          />
        ))}
        <span
          className="ml-2 size-6 flex justify-center items-center rounded-md focus:outline-none opacity-0 hover:opacity-100 cursor-pointer group-hover:opacity-100 transition-opacity"
          onClick={() => handleAddNewClick("")}
        >
          <span className="bg-blue-500 rounded-full text-light p-2">
            <Plus className="w-3 h-3 size-4" fill="#ffffff" />
          </span>
        </span>
        {isAddingNew && (
          <div
            ref={inputRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            className={`mt-1 w-40 text-sm text-gray-800 dark:bg-neutral-800 border-b-2 ${
              isAddingNew ? "border-blue-500" : "border-transparent"
            } focus:outline-none`}
          />
        )}
      </div>
    </div>
  );
};

export default MenuStructure;
