import { NextRequest, NextResponse } from "next/server";

const fetchMenus = async (menuId?: string) => {
  try {
    const url = menuId 
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/menus?menuId=${menuId}&timestamp=${new Date().getTime()}` 
      : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/menus?timestamp=${new Date().getTime()}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response || !response.ok) {
      throw new Error(`Failed to fetch menus: ${response ? response.statusText : 'No response'}`);
    }

    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching menus:', error);
    throw error;
  }
};

const createMenu = async (menuData: { name: string; parentId?: string | null }) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/menus`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(menuData),
    });

    if (!response || !response.ok) {
      throw new Error(`Failed to create menu: ${response ? response.statusText : 'No response'}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating menu:', error);
    throw error;
  }
};

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const menuId = url.searchParams.get('menuId');
    const menus = await fetchMenus(menuId || undefined);

    return NextResponse.json({
        success: true,
        message: 'Successfully fetch menus',
        menus: menus
    }, {
        status: 200,
        headers: {
          'Cache-Control': 'no-store',
          'Pragma': 'no-cache',
          'Expires': '0', 
        },
    })
  } catch (error) {
    console.error('Error fetching menus:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch menus'
    }, {
        status: 500,
    })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.name || typeof body.name !== 'string') {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid menu data. "name" is required.',
        },
        {
          status: 400,
        }
      );
    }

    const newMenu = await createMenu({
      name: body.name,
      parentId: body.parentId || null,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Successfully created menu',
        menu: newMenu,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error('Error creating menu:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create menu',
      },
      {
        status: 500,
      }
    );
  }
}