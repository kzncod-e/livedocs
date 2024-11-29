"use client";
import { RoomProvider, ClientSideSuspense } from "@liveblocks/react/suspense";
import { Editor } from "@/components/editor/Editor";
import Header from "@/components/Header";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import ActiveCollaborators from "./ActiveCollaborators";
import { useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";
import edit from "../public/assets/icons/edit.svg";
import { updateDocument } from "@/lib/actions/room.actions";
import Loader from "./Loader";
export default function CollaborativeRoom({
  roomId,
  roomMetadata,
  users,
  currentUserType,
}: CollaborativeRoomProps) {
  const [documentTitle, setDocumentTitle] = useState(roomMetadata.title);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const updateTitleHandler = async (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      setLoading(true);
      try {
        if (documentTitle !== roomMetadata.title) {
          const updatedDocument = await updateDocument(roomId, documentTitle);
          if (updatedDocument) {
            setEditing(false);
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setEditing(false);
        updateDocument(roomId, documentTitle);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [documentTitle]);
  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);
  return (
    <>
      {/* defined the specific id for the room so you can access the room  */}
      <RoomProvider id={roomId}>
        <ClientSideSuspense fallback={<Loader />}>
          <div className="collaborative-room">
            <Header>
              <div
                ref={containerRef}
                className="flex w-fit items-center justify-center gap-2">
                {editing && !loading ? (
                  <Input
                    type="text"
                    value={documentTitle}
                    ref={inputRef}
                    placeholder="enter title"
                    onChange={(e) => setDocumentTitle(e.target.value)}
                    onKeyDown={updateTitleHandler}
                    disabled={!editing}
                    className="document-title-input"
                  />
                ) : (
                  <>
                    <p className="document-title">{documentTitle}</p>
                  </>
                )}
                {currentUserType === "editor" && !editing && (
                  <Image
                    src={edit}
                    height={24}
                    width={24}
                    alt="edit"
                    onClick={() => setEditing(true)}
                    className="pointer"
                  />
                )}
                {currentUserType !== "editor" && !editing && (
                  <p className="view-only-tag">View Only</p>
                )}
                {loading && <p className="text-sm text-gray-400">saving...</p>}
              </div>
              <div className="flex w-full flex-1 justify-end gap-2 sm:gap-3">
                <ActiveCollaborators />
                <SignedOut>
                  <SignInButton />
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </div>
            </Header>
            <Editor roomId={roomId} currentUserType={currentUserType} />
          </div>
        </ClientSideSuspense>
      </RoomProvider>
    </>
  );
}
