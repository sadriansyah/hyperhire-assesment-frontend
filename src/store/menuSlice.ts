import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface Menu {
  id: string;
  name: string;
  depth: number;
  parentId: string | null;
  parentName: string | null;
  parent: Menu;
  children: Menu[];
}

interface CreateMenu {
  name: string;
  parentId: string | null;
}

interface MenusState {
  menus: Menu[];
  dropdownItems: Menu[];
  loading: boolean;
  error: string | null;
  selectedMenu: Menu | null;
  menuId: string;
}

const initialState: MenusState = {
  menus: [],
  dropdownItems: [],
  loading: false,
  error: null,
  selectedMenu: null,
  menuId: ''
};

export const fetchMenus = createAsyncThunk<Menu[], { menuId?: string }>(
  'menus/fetchMenus',
  async ({ menuId }) => {
    const url = menuId ? `/api/menus?menuId=${menuId}` : '/api/menus';
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch menus');
    }
    const data = await response.json();
    return data.menus;
  }
);

export const fetchMenuDetails = createAsyncThunk<Menu, number>(
  'menus/fetchMenuDetails',
  async (menuId) => {
    const response = await fetch(`/api/menus/${menuId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch menu details');
    }
    const data = await response.json();
    return data.menu;
  }
);

export const updateMenu = createAsyncThunk<Menu, Menu>(
  'menus/updateMenu',
  async (menuData) => {
    const response = await fetch(`/api/menus/${menuData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(menuData),
    });

    if (!response.ok) {
      throw new Error('Failed to update menu');
    }

    const data = await response.json();
    return data.menu;
  }
);

export const deleteMenu = createAsyncThunk(
  'menus/deleteMenu',
  async (id: string) => {
    const response = await fetch(`/api/menus/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete menu');
    }

    return id;
  }
);

export const addMenu = createAsyncThunk<CreateMenu, CreateMenu>(
  'menus/addMenu',
  async (menuData) => {
    const response = await fetch('/api/menus', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(menuData),
    });

    if (!response.ok) {
      throw new Error('Failed to add menu');
    }

    const data = await response.json();
    return data.menu;
  }
);

export const fetchDropdownItems = createAsyncThunk(
  "menus/fetchDropdownItems",
  async () => {
    const response = await fetch("http://localhost:3000/api/menus/selection");
    if (!response.ok) {
      throw new Error("Failed to fetch dropdown items");
    }
    return await response.json();
  }
);

const menusSlice = createSlice({
  name: 'menus',
  initialState,
  reducers: {
    resetSelectedMenu: (state) => {
      state.selectedMenu = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenus.fulfilled, (state, action) => {
        state.loading = false;
        state.menus = action.payload;
      })
      .addCase(fetchMenus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch menus';
      })

      .addCase(fetchMenuDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenuDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedMenu = action.payload;
      })
      .addCase(fetchMenuDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch menu details';
      })

      .addCase(updateMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMenu.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedMenu = action.payload;
      })
      .addCase(updateMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update menu';
      })

      .addCase(deleteMenu.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteMenu.fulfilled, (state) => {
        state.loading = false;
        state.selectedMenu = null;
      })
      .addCase(deleteMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete menu';
      })

      .addCase(addMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMenu.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add menu';
      })

      .addCase(fetchDropdownItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDropdownItems.fulfilled, (state, action) => {
        state.loading = false;
        state.dropdownItems = action.payload;
      })
      .addCase(fetchDropdownItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch dropdown items";
      });
  },
});

export const { resetSelectedMenu } = menusSlice.actions;
export default menusSlice.reducer;
