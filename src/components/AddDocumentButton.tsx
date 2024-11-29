"use client";
import React from "react";
import { Button } from "./ui/button";

import Image from "next/image";
import plus from "../public/assets/icons/add.svg";
import { createDocument } from "@/lib/actions/room.actions";
import { useRouter } from "next/navigation";
const AddDocumentButton = ({ userId, email }: AddDocumentBtnProps) => {
  const router = useRouter();
  const addDocumentHandler = async () => {
    try {
      const room = await createDocument({ userId, email });
      if (room) router.push(`documents/${room.id}`);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Button
        className="gradient-blue flex gap-1 shadow-md"
        type="submit"
        onClick={addDocumentHandler}>
        <Image src={plus} alt="add" width={24} height={24}></Image>
        <p className="hidden sm:block"> start a blank document</p>
      </Button>
    </>
  );
};

export default AddDocumentButton;
