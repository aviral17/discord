// import { redirectToSignIn } from "@clerk/nextjs";
// import { redirect } from "next/navigation";

// import { db } from "@/lib/db";
// import { currentProfile } from "@/lib/current-profile";

// interface InviteCodePageProps {
//   params: {
//     inviteCode: string; // please ensure inviteCode must match the params name [inviteCode] as we passing this as arg {params}
//   };
// }

// const InviteCodePage = async ({ params }: InviteCodePageProps) => {
//   const profile = await currentProfile();

//   if (!profile) {
//     return redirectToSignIn();
//   }

//   if (!params.inviteCode) {
//     return redirect("/");
//   }

//   //   if already a member of that server whose invite code we have or we clicked then just redirect to that server
//   const existingServer = await db.server.findFirst({
//     where: {
//       inviteCode: params.inviteCode,
//       members: {
//         some: {
//           profileId: profile.id,
//         },
//       },
//     },
//   });

//   if (existingServer) {
//     return redirect(`/servers/${existingServer.id}`);
//   }

//   const server = await db.server.update({
//     where: {
//       inviteCode: params.inviteCode,
//     },
//     data: {
//       members: {
//         create: [
//           {
//             profileId: profile.id, // by default anyone joining will be GUEST only so we don't need to explicitly define it again here
//           },
//         ],
//       },
//     },
//   });

//   if (server) {
//     return redirect(`/servers/${server.id}`);
//   }

//   return null;
// };

// export default InviteCodePage;

import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";

interface InviteCodePageProps {
  params: {
    inviteCode: string;
  };
}

const InviteCodePage = async ({ params }: InviteCodePageProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  if (!params.inviteCode) {
    return redirect("/");
  }

  const existingServer = await db.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (existingServer) {
    return redirect(`/servers/${existingServer.id}`);
  }

  const server = await db.server.update({
    where: {
      inviteCode: params.inviteCode,
    },
    data: {
      members: {
        create: [
          {
            profileId: profile.id,
          },
        ],
      },
    },
  });

  if (server) {
    return redirect(`/servers/${server.id}`);
  }

  return null;
};

export default InviteCodePage;
