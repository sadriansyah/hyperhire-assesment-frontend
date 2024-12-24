import { RootState, AppDispatch } from "@/store";
import { deleteMenu, fetchDropdownItems, fetchMenus, resetSelectedMenu, updateMenu } from "@/store/menuSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface Menu {
  id: string;
  name: string;
  depth: number;
  parentId: string | null;
  parentName: string | null;
  parent: Menu;
  children: Menu[];
}

const MenuDetail = () => {
  const { selectedMenu, loading, error } = useSelector(
    (state: RootState) => state.menus
  );
  const [isDropdown, setIsDropdown] = useState(false);
  const dropdownItems = useSelector((state: RootState) => state.menus.dropdownItems);

  const dispatch = useDispatch<AppDispatch>();

  const [menu, setMenu] = useState<Menu>({
    id: "",
    name: "",
    depth: 0,
    parentId: null,
    parentName: null,
    parent: {} as Menu,
    children: [],
  });

  useEffect(() => {
    dispatch(fetchDropdownItems());
    if (selectedMenu) {
      setMenu(selectedMenu);
    }
  }, [selectedMenu, dispatch]);

  if (loading) {
    return <div>Loading ...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  const toggleDropdown = () => {
    setIsDropdown(!isDropdown);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMenu((prevMenu) => ({
      ...prevMenu,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (menu.id === "") return;
    await dispatch(updateMenu(menu));
    dispatch(fetchMenus({}));
  };

  const handleDelete = async () => {
    if (menu.id === "") return;
    await dispatch(deleteMenu(menu.id));
    dispatch(resetSelectedMenu());
    dispatch(fetchMenus({}));
    setMenu({
      id: "",
      name: "",
      depth: 0,
      parentId: null,
      parentName: null,
      parent: {} as Menu,
      children: [],
    });
  }

  const handleSelectParent = (itemId:string) => {
    const selectedItem = dropdownItems.find(item => item.id === itemId);
    if (selectedItem) {
      setMenu((prevMenu) => ({
        ...prevMenu,
        parentId: selectedItem.id,
        parentName: selectedItem.name,
        depth: selectedItem.depth,
      }));
    }
    setIsDropdown(false);
    console.log(itemId);
  }


  return (
    <div className="flex-1 mt-6 space-y-4">
      <div>
        <label className="block text-sm text-gray-600 mb-2">Menu ID</label>
        <input
          type="text"
          className="w-full p-2 pl-4 bg-gray-50 rounded-xl text-gray-500"
          value={menu.id || ""}
          readOnly
        />
      </div>
      <div>
        <label className="block text-sm text-gray-600 mb-2">Depth</label>
        <input
          type="text"
          className="w-80 p-2 pl-4 bg-gray-200 rounded-xl"
          value={menu.depth || ""}
          readOnly
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-2">Parent Data</label>
        <div className="relative w-80">
          <button
              className="w-full px-4 py-4 bg-gray-50  rounded-xl flex justify-between items-center"
              onClick={() => toggleDropdown()}
            >
              <span>{menu.parent?.name || ""}</span>
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
                    onClick={() => handleSelectParent(item.id)}
                  >
                    {item.name}
                  </li>
                ))}
              </ul>
            )}
        </div>
      </div>
      <div>
        <label className="block text-sm text-gray-600 mb-2">Name</label>
        <input
          type="text"
          className="w-80 p-2 pl-4 bg-gray-50 rounded-xl"
          value={menu.name || ""}
          name="name"
          onChange={handleChange}
        />
      </div>

      <div className="flex gap-2">
        <button className="w-40 py-3 bg-blue-600 text-white rounded-3xl" onClick={handleSave}>
          Save
        </button>
        <button className="w-40 py-3 bg-red-600 text-white rounded-3xl" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default MenuDetail;
