import { v4 as uuidv4 } from "uuid"; // Using uuid for generating unique ids like for invite or anything like
//  We are calling the uuidv4 function without any arguments, which will return a string of 36 characters that looks something like this:
// "f47ac10b-58cc-4372-a567-0e02b2c3d479"
import { NextResponse } from "next/server";
import { MemberRole } from "@prisma/client";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

// In Next.js 13, the names of the exported functions in a route.ts file correspond to the HTTP methods that the server will respond to for that route. The names GET, POST, PUT, PATCH, DELETE, HEAD, and OPTIONS are reserved for this purpose,  we can also use other names but that is not relevant in this case

export async function POST(req: Request) {
  try {
    const { name, imageUrl } = await req.json(); // TODO: Which we passed using `values` in axios.POST
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // This will create server and save the server including its id (uuid) which lateron as we know we are accessing from [serverId] name
    const server = await db.server.create({
      data: {
        profileId: profile.id,
        name,
        imageUrl,
        inviteCode: uuidv4(),
        channels: {
          create: [{ name: "general", profileId: profile.id }],
        },
        members: {
          create: [{ profileId: profile.id, role: MemberRole.ADMIN }],
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVERS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
