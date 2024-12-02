"use server";

import { clerkClient } from "@clerk/nextjs/server";
import { getAccessType, parseStringify } from "../utils";
import { liveblocks } from "../liveblocks";

import { revalidatePath } from "next/cache";

export const getClerkUsers = async ({ userIds }: { userIds: string[] }) => {
  try {
    const client = await clerkClient();
    const { data } = await client.users.getUserList({
      emailAddress: userIds,
    });
    const users = data.map((user) => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.emailAddresses[0].emailAddress,
      avatar: user.imageUrl,
    }));
    const sortUsers = userIds.map((email) =>
      users.find((user) => user.email === email)
    );
    return parseStringify(sortUsers);
  } catch (error) {
    console.log(`error fetching user ${error}`);
  }
};
export const getDocumentUsers = async ({
  roomId,
  currentUser,
  text,
}: {
  roomId: string;
  currentUser: string | undefined;
  text: string;
}) => {
  try {
    const room = await liveblocks.getRoom(roomId);
    //fetach all users in specific room
    const users = Object.keys(room.usersAccesses).filter(
      (email) => email !== currentUser
    );
    if (text.length) {
      const lowerCaseText = text.toLowerCase();
      const fileredUsers = users.filter((email: string) =>
        email.toLowerCase().includes(lowerCaseText)
      );
      return parseStringify(fileredUsers);
    }
    return parseStringify(users);
  } catch (error) {
    console.log(`error fetching Document user${error}`);
  }
};
export const updateDocumentAccess = async ({
  roomId,
  email,
  userType,
  updatedBy,
}: ShareDocumentParams) => {
  try {
    //contain a list of all user access
    const usersAccesses: RoomAccesses = {
      [email]: getAccessType(userType) as AccessType,
    };
    const room = await liveblocks.updateRoom(roomId, { usersAccesses });
    if (room) {
      //todo sent a notificaton to the invited user
    }
    revalidatePath(`documents/${roomId}`);
    return parseStringify(room);
  } catch (error) {
    console.log(`error happednd while updating a room acceess:${error}`);
  }
};
export const removeCollaborator = async ({
  roomId,
  email,
}: {
  roomId: string;
  email: string;
}) => {
  try {
    const room = await liveblocks.getRoom(roomId);
    if (room.metadata.email === email) {
      throw new Error("you cannot remove yourself from the documeny");
    }
    //remove the access
    const updatedRoom = await liveblocks.updateRoom(roomId, {
      usersAccesses: {
        [email]: null,
      },
    });
    revalidatePath(`/documents/${roomId}`);
    return parseStringify(updatedRoom);
  } catch (error) {
    console.log(`error happend whilr removing a collaborator${error}`);
  }
};
