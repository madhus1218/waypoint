import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const trips = await prisma.trip.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        photoPoints: true,
      },
    });

    return NextResponse.json({ trips });
  } catch (error) {
    console.error("Failed to fetch trips:", error);

    return NextResponse.json(
      { error: "Failed to fetch trips" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      title,
      startDate,
      endDate,
      city,
      country,
      notes,
      photoPoints,
    } = body;

    if (!title || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Missing required trip fields" },
        { status: 400 }
      );
    }

    const existingTrip = await prisma.trip.findFirst({
      where: {
        title,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
      include: {
        photoPoints: true,
      },
    });

    if (existingTrip) {
      return NextResponse.json(
        {
          trip: existingTrip,
          message: "Trip already exists",
        },
        { status: 200 }
      );
    }

    const trip = await prisma.trip.create({
      data: {
        title,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        city: city || null,
        country: country || null,
        notes: notes || null,
        photoPoints: {
          create:
            photoPoints?.map(
              (point: {
                filename?: string;
                latitude: number;
                longitude: number;
                takenAt: string;
              }) => ({
                filename: point.filename || null,
                latitude: Number(point.latitude),
                longitude: Number(point.longitude),
                takenAt: new Date(point.takenAt),
              })
            ) || [],
        },
      },
      include: {
        photoPoints: true,
      },
    });

    return NextResponse.json({ trip }, { status: 201 });
  } catch (error) {
    console.error("Failed to create trip:", error);

    return NextResponse.json(
      { error: "Failed to create trip" },
      { status: 500 }
    );
  }
}