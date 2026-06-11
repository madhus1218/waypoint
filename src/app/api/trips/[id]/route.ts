import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    const trip = await prisma.trip.findUnique({
      where: {
        id,
      },
      include: {
        photoPoints: {
          orderBy: {
            takenAt: "asc",
          },
        },
      },
    });

    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    return NextResponse.json({ trip });
  } catch (error) {
    console.error("Failed to fetch trip:", error);

    return NextResponse.json(
      { error: "Failed to fetch trip" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    const existingTrip = await prisma.trip.findUnique({
      where: {
        id,
      },
    });

    if (!existingTrip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    await prisma.trip.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ message: "Trip deleted successfully" });
  } catch (error) {
    console.error("Failed to delete trip:", error);

    return NextResponse.json(
      { error: "Failed to delete trip" },
      { status: 500 }
    );
  }

  export async function PATCH(request: Request, { params }: RouteParams) {
    try {
        const { id } = await params;
        const body = await request.json();

        const { title, city, country, notes } = body;

        if (!title || title.trim().length === 0) {
        return NextResponse.json(
            { error: "Trip title is required" },
            { status: 400 }
        );
        }

        const existingTrip = await prisma.trip.findUnique({
        where: {
            id,
        },
        });

        if (!existingTrip) {
        return NextResponse.json({ error: "Trip not found" }, { status: 404 });
        }

        const updatedTrip = await prisma.trip.update({
        where: {
            id,
        },
        data: {
            title: title.trim(),
            city: city?.trim() || null,
            country: country?.trim() || null,
            notes: notes?.trim() || null,
        },
        include: {
            photoPoints: {
            orderBy: {
                takenAt: "asc",
            },
            },
        },
        });

        return NextResponse.json({ trip: updatedTrip });
    } catch (error) {
        console.error("Failed to update trip:", error);

        return NextResponse.json(
        { error: "Failed to update trip" },
        { status: 500 }
        );
    }
  }
}