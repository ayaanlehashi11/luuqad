import { NextResponse } from "next/server"
import { options } from "@auth/[...nextauth]/options"
import { getServerSession } from "next-auth/next"

import { prisma } from "@/lib/prisma"

// using next js 13 api routes, send post request to create user with prisma
export async function GET() {
  try {
    const session = await getServerSession(options)

    if (!session) {
      return NextResponse.json(
        {
          error:
            "Nah, you're not authorized, what you doing here? Trying to be a hacker?",
        },
        { status: 401 },
      )
    }

    const userId = Number(session.user?.id)
    // Get all points
    const points = await prisma.point.findMany({
      where: {
        user_id: userId,
      },
      select: {
        points: true,
      },
    })

    return NextResponse.json({
      points,
    })
  } catch (error) {
    // You might want to return a proper response in case of an error
    return NextResponse.json(
      {
        error: "Sorry, something went wrong.",
      },
      { status: 500 },
    )
  }
}
