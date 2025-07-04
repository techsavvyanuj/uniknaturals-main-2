import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const token = process.env.SHIPROCKET_TOKEN;
    if (!token) {
      return NextResponse.json({ error: 'Shiprocket token not configured' }, { status: 500 });
    }
    const shiprocketRes = await axios.post(
      'https://apiv2.shiprocket.in/v1/external/orders/create/adhoc',
      body,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    return NextResponse.json(shiprocketRes.data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      error: error.response?.data || error.message || 'Unknown error',
    }, { status: error.response?.status || 500 });
  }
}
