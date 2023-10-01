import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { ServerSidebar } from "@/components/server/server-sidebar";

const ServerIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { serverId: string };
}) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  // Find servers, which the current profile  is a member of, we have a member array in servers, see below for more
  // NOTE: We know that members is an array inside server, so we used `some` here to find the current logged in profile id inside members array of server
  // We get `serverId` from url params via (setup) -> page.tsx file which pushes servers/serverId to the url params
  const server = await db.server.findUnique({
    where: {
      id: params.serverId, // id of this particular server,check below page
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (!server) {
    return redirect("/");
  }

  return (
    <div className="h-full">
      <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
        <ServerSidebar serverId={params.serverId} />
      </div>
      <main className="h-full md:pl-60">{children}</main>
    </div>
  );
};

export default ServerIdLayout;

// We know that this is `Server Component` of nextjs,  so it automatically get the `params` in the function argument, and the params we are getting is the serverId  as in the form `localhost:3000/servers/serverId` ---> we can check and match with the serverId of nextJs FOLDER Structure and in the Url ---> so in the folder, its defined as `[serverId]`, so here we accessing it with the same name as `serverId`

// It means that server contain an array of member List, and that member list must have atleast one profile in it that matches with the current profile (the user currently logged in) whose id we are accessing via using clerk
