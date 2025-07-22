import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Call your own backend, not Shiprocket directly
    const backendResponse = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE}/shiprocket`,
      body
    );

    return NextResponse.json(backendResponse.data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      error: error.response?.data || error.message || 'Unknown error',
    }, { status: error.response?.status || 500 });
  }
}
