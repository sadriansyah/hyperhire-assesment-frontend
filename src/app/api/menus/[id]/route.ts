import { NextRequest, NextResponse } from "next/server";

const fetchMenuById = async (id: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/menus/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response || !response.ok) {
      throw new Error(`Failed to fetch menu details: ${response ? response.statusText : 'No response'}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching menu details:', error);
    throw error;
  }
};

const updateMenuById = async (id: string, updatedMenu: {name: string, parentId: string}) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/menus/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: updatedMenu.name,
        parentId: updatedMenu.parentId
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update menu: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating menu:', error);
    throw error;
  }
};

const deleteMenuById = async (id: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/menus/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete menu: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleteing menu:', error);
    throw error;
  }
};

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
  
    const menuDetails = await fetchMenuById(id);
  
    return NextResponse.json({
      success: true,
      message: 'Successfully fetched menu details',
      menu: menuDetails,
    }, {
      status: 200,
    });
  } catch (error) {
    console.error('Error fetching menu details:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch menu details',
    }, {
      status: 500,
    });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    
    const updatedMenu = await req.json();
  
    if (!updatedMenu || !updatedMenu.name) {
      return NextResponse.json({
        success: false,
        message: 'Missing required menu details',
      }, {
        status: 400,
      });
    }

    const updatedMenuDetails = await updateMenuById(id, updatedMenu);
  
    return NextResponse.json({
      success: true,
      message: 'Successfully updated menu',
      updatedMenu: updatedMenuDetails,
    }, {
      status: 200,
    });
  } catch (error) {
    console.error('Error updating menu:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update menu',
    }, {
      status: 500,
    });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const deleteMenu = await deleteMenuById(id);
  
    return NextResponse.json({
      success: true,
      message: 'Successfully delete menu',
      deleteMenu: deleteMenu,
    }, {
      status: 200,
    });
  } catch (error) {
    console.error('Error delete menu:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to delete menu',
    }, {
      status: 500,
    });
  }
}
