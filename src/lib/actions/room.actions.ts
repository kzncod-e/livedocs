"use server";
import { nanoid } from "nanoid";

import { liveblocks } from "../liveblocks";
import { revalidatePath } from "next/cache";
import { parseStringify } from "../utils";
export const createDocument = async ({
  userId,
  email,
}: CreateDocumentParams) => {
  const roomId = nanoid();
  try {
    const metadata = {
      creatorId: userId,
      email,
      title: "untitled",
    };
    const usersAccesses: RoomAccesses = {
      [email]: ["room:write"],
    };
    const room = await liveblocks.createRoom(roomId, {
      metadata,
      usersAccesses,
      //so other user can collaborative
      defaultAccesses: ["room:write"],
    });
    revalidatePath("/");
    //you have to stringify when you return on server action
    return parseStringify(room);
  } catch (error) {
    console.log("Error happen when create a romm ", error);
  }
};
export const getDocument = async ({
  roomId,
  userId,
}: {
  roomId: string;
  userId: string;
}) => {
  try {
    const room = await liveblocks.getRoom(roomId);
    // check id user has the access to the room
    //this is an arrray of diffrent object
    //check if the array  inbclude the user id
    const hasAccess = Object.keys(room.usersAccesses).includes(userId);
    if (!hasAccess) {
      throw new Error("You don't have access to this room");
    }
    return parseStringify(room);
  } catch (error) {
    console.log(`error hapened while getting a room :${error}`);
  }
};

export const updateDocument = async (roomId: string, title: string) => {
  try {
    const updatedRoom = await liveblocks.updateRoom(roomId, {
      metadata: {
        title,
      },
    });
    revalidatePath(`/documents/${roomId}`);
    return parseStringify(updatedRoom);
  } catch (error) {
    console.log(`error happen when updating the room${error}`);
  }
};

export const getDocuments = async (email: string) => {
  try {
    const rooms = await liveblocks.getRooms({ userId: email });
    return parseStringify(rooms);
  } catch (error) {
    console.log(`error hapened while getting a rooms :${error}`);
  }
};
