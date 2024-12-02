import Header from "@/components/Header";

import { SignedIn, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import aset from "../../public/assets/icons/doc.svg";
import AddDocumentButton from "@/components/AddDocumentButton";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getDocuments } from "@/lib/actions/room.actions";
import Link from "next/link";
import docImage from "../../public/assets/icons/doc.svg";
import { dateConverter } from "@/lib/utils";
import { DeleteModal } from "@/components/DeleteModal";
import { Notification } from "@/components/Notification";
export default async function Home() {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    redirect("/sign-in");
  }
  const roomDocuments = await getDocuments(
    clerkUser?.emailAddresses[0].emailAddress
  );

  return (
    <>
      <main className="home-container">
        <Header className="sticky left-0 top-0">
          <div className="flex items-center gap-2 lg:gap-4">
            <Notification />
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </Header>
        {roomDocuments?.data.length > 0 ? (
          <div className="document-list-container">
            <div className="document-list-title">
              <h3 className="text-28-semibold">All documents</h3>
              <AddDocumentButton
                userId={clerkUser.id}
                email={clerkUser.emailAddresses[0].emailAddress}
              />
            </div>
            <ul className="document-ul">
              {roomDocuments?.data?.map(
                ({
                  id,
                  metadata,
                  createdAt,
                }: {
                  id: string;
                  metadata: RoomMetadata;
                  createdAt: string;
                }) => (
                  <li key={id} className="document-list-item">
                    <Link
                      href={`/documents/${id}`}
                      className="flex flex-1 items-center gap-4">
                      <div className="hidden rounded-md bg-dark-500 p-2 sm:block">
                        <Image
                          src={docImage}
                          alt="file"
                          width={40}
                          height={40}
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="line-clamp-1 text-lg">{metadata.title}</p>
                        <p className="text-sm font-light text-blue-100">
                          {" "}
                          Created about {dateConverter(createdAt)}
                        </p>
                      </div>
                    </Link>
                    <DeleteModal roomId={id} />
                  </li>
                )
              )}
            </ul>
          </div>
        ) : (
          <div className="document-list-empty">
            <Image src={aset} alt="document" width={40} height={40}></Image>
            <AddDocumentButton
              userId={clerkUser.id}
              email={clerkUser.emailAddresses[0].emailAddress}
            />
          </div>
        )}
      </main>
    </>
  );
}
