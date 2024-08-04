"use client";
import { useParams } from "next/navigation";
import React from "react";

const Item = () => {
  const { id } = useParams();

  console.log(id);
  return <div>Item</div>;
};

export default Item;
