import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log('Fetching cars from backend:', process.env.BACKEND_URL);
    const response = await fetch(`${process.env.BACKEND_URL}/api/cars`);
    if (!response.ok) {
      throw new Error('Failed to fetch cars from backend');
    }
    const cars = await response.json();
    console.log('Cars fetched from backend:', cars.length, 'cars');
    console.log('First few cars:', cars.slice(0, 3));
    return NextResponse.json(cars);
  } catch (error) {
    console.error("Error fetching cars:", error);
    return NextResponse.json(
      { error: "Failed to fetch cars" },
      { status: 500 }
    );
  }
} 