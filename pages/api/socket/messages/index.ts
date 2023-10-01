import { NextApiRequest } from "next";

import { NextApiResponseServerIo } from "@/types";
import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const profile = await currentProfilePages(req);
    const { content, fileUrl } = req.body;
    const { serverId, channelId } = req.query;

    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!serverId) {
      return res.status(400).json({ error: "Server ID missing" });
    }

    if (!channelId) {
      return res.status(400).json({ error: "Channel ID missing" });
    }

    if (!content) {
      return res.status(400).json({ error: "Content missing" });
    }

    const server = await db.server.findFirst({
      where: {
        id: serverId as string,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        members: true,
      },
    });

    if (!server) {
      return res.status(404).json({ message: "Server not found" });
    }

    const channel = await db.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: serverId as string,
      },
    });

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    const member = server.members.find(
      (member) => member.profileId === profile.id
    );

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    const message = await db.message.create({
      data: {
        content,
        fileUrl,
        channelId: channelId as string,
        memberId: member.id,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    const channelKey = `chat:${channelId}:messages`; // NOTE: TODO: TIP: Check  Below

    res?.socket?.server?.io?.emit(channelKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log("[MESSAGES_POST]", error);
    return res.status(500).json({ message: "Internal Error" });
  }
}

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/* 

The line `const channelKey = `chat:${channelId}:messages`;` is creating a unique key for each channel's messages. This key is used to emit events specifically for this channel.

In this context, `socket.io` is being used to facilitate real-time communication. When a new message is created, it's emitted to all connected clients using `res?.socket?.server?.io?.emit(channelKey, message);`.

The `channelKey` is a string that's unique for each channel's messages. It's constructed using the `channelId` from the request query. The prefix `chat:` and suffix `:messages` are just added for namespacing purposes, to avoid potential key collisions and make the keys more descriptive.

So, whenever a new message is posted in a specific channel, an event with the key `chat:${channelId}:messages` is emitted. On the client side, you would listen for events with this key to update the chat in real-time whenever a new message is posted.

*/

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
