import { NextApiRequest } from "next";
import { getAuth } from "@clerk/nextjs/server";

import { db } from "@/lib/db";

// NOTE: we already have current-provide.ts file still we created this file bacuase we are also using `pages` folder for socket.io to work, so nextjs 12 also has different style of defining AUTH, so created this extra file specially for the pages folder

export const currentProfilePages = async (req: NextApiRequest) => {
  const { userId } = getAuth(req);

  if (!userId) {
    return null;
  }

  const profile = await db.profile.findUnique({
    where: {
      userId,
    },
  });

  return profile;
};
