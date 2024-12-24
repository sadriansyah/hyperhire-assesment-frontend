import { AppDispatch } from "@/store";
import { addMenu, fetchMenus } from "@/store/menuSlice";
import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

type Menu = {
  id: string;
  name: string;
  depth: number;
  parentId: string | null;
  parentName: string | null;
  parent: Menu;
  children: Menu[];
};

type TreeItemProps = {
  menu: Menu;
  expandedItems: Record<string | number, boolean>;
  setExpandedItems: React.Dispatch<
    React.SetStateAction<Record<string | number, boolean>>
  >;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClick: any;
};

const TreeItem: React.FC<TreeItemProps> = ({
  menu,
  expandedItems,
  setExpandedItems,
  onClick,
}) => {
  const isExpanded = expandedItems?.[menu.id] || false;
  const [isAdding, setIsAdding] = useState(false);
  const [newMenuName, setNewMenuName] = useState("");
  const [parentId, setParentId] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const toggleExpand = () => {
    setExpandedItems((prev) => ({
      ...prev,
      [menu.id]: !isExpanded,
    }));
  };

  const handleAddClick = (parentId: string) => {
    setParentId(parentId);
    setIsAdding(true);
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
        setIsAdding(false);
      }
    } else if (e.key === "Escape") {
      setNewMenuName("");
      setParentId("");
      setIsAdding(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsAdding(false);
        setNewMenuName(""); // Reset the input value
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="tree-item">
      {/* Parent Item */}
      <div className="py-0.5 flex items-center gap-x-0.5 w-full group">
        {menu.children && menu.children.length > 0 && (
          <button
            onClick={toggleExpand}
            className="size-6 flex justify-center items-center hover:bg-gray-100 rounded-md focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 size-4" />
            ) : (
              <ChevronRight className="w-4 h-4 size-4" />
            )}
          </button>
        )}
        <div className="">
          <span
            className="text-sm text-gray-800 dark:text-neutral-200 cursor-pointer"
            onClick={() => onClick(menu.id)}
          >
            {menu.name}
          </span>
        </div>
        <span
          className="ml-2 size-6 flex justify-center items-center rounded-md focus:outline-none opacity-0 hover:opacity-100 cursor-pointer group-hover:opacity-100 transition-opacity"
          onClick={() => handleAddClick(menu.id)}
        >
          <span className="bg-blue-500 rounded-full text-light p-2">
            <Plus className="w-3 h-3 size-4" fill="#ffffff" />
          </span>
        </span>
      </div>
      {isAdding && (
        <div
          ref={inputRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          className={`mt-1 w-40 text-sm text-gray-800 dark:bg-neutral-800 border-b-2 ${
            isAdding ? "border-blue-500" : "border-transparent"
          } focus:outline-none`}
        />
      )}

      {/* Render Children */}
      {isExpanded && menu.children && menu.children.length > 0 && (
        <div className="w-full overflow-hidden transition-[height] duration-300">
          <div className="ps-7 relative before:absolute before:top-0 before:start-3 before:w-0.5 before:-ms-px before:h-full before:bg-gray-100 dark:before:bg-neutral-700">
            {menu.children.map((child) => (
              <TreeItem
                key={child.id}
                menu={child}
                expandedItems={expandedItems}
                setExpandedItems={setExpandedItems}
                onClick={onClick}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TreeItem;
