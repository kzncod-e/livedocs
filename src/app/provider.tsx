"use client";
import Loader from "@/components/Loader";
import {
  ClientSideSuspense,
  LiveblocksProvider,
} from "@liveblocks/react/suspense";
import { ReactNode } from "react";
import { getClerkUsers } from "@/lib/actions/user.action";
import { useUser } from "@clerk/nextjs";
export default function Provider({ children }: { children: ReactNode }) {
  const { user: clerkUser } = useUser();
  return (
    <>
      {/* use resolvers to get colaborative */}
      <LiveblocksProvider
        authEndpoint="/api/liveblocks-auth"
        resolveUsers={async ({ userIds }) => {
          const users = await getClerkUsers({ userIds });
          return users;
        }}>
        <ClientSideSuspense fallback={<Loader />}>
          {children}
        </ClientSideSuspense>
      </LiveblocksProvider>
    </>
  );
}
