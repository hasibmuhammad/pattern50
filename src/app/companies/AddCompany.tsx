"use client";
import { X } from "@phosphor-icons/react";
import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";

const AddCompany = () => {
  const [phone, setPhone] = useState("");
  return (
    <div className="absolute top-0 right-0 z-10 max-w-lg rounded-lg overflow-hidden shadow-lg">
      <div className="bg-slate-50 px-5 py-10 flex justify-between">
        <div>
          <h1 className="text-2xl font-bold">Add Company</h1>
          <p className="text-slate-400">
            Get started by filling in the information to add new company
          </p>
        </div>
        <X size={28} className="cursor-pointer" />
      </div>
      <div className="px-5 py-2 bg-white">
        <h2 className="text-lg font-bold">Company Information</h2>
        <form className="my-4 space-y-4">
          <div className="flex gap-4 items-center justify-between">
            <label className="w-[200px] text-nowrap">
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full border outline-none rounded-md px-3 py-2"
              type="text"
              placeholder="Company Name"
            />
          </div>
          <div className="flex gap-4 items-center justify-between">
            <label className="w-[200px] text-nowrap">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full border outline-none rounded-md px-3 py-2"
              type="email"
              placeholder="Email address"
            />
          </div>
          <div className="flex gap-4 items-center justify-between">
            <label className="w-[200px] text-nowrap">
              Phone Number <span className="text-red-500">*</span>
            </label>
            {/* <input
              className="w-full border outline-none rounded-md px-3 py-2"
              type="email"
              placeholder="Email address"
            /> */}

            <PhoneInput
              value={phone}
              onChange={(phone) => setPhone(phone)}
              country={"us"}
              placeholder={"000 000 0000"}
            />
          </div>
          <div className="flex gap-4 items-center justify-between">
            <label className="w-[200px] text-nowrap">
              EIN <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full border outline-none rounded-md px-3 py-2"
              type="email"
              placeholder="EIN"
            />
          </div>
          <div className="flex gap-4 items-center justify-between">
            <label className="w-[200px] text-nowrap">
              Address <span className="text-red-500">*</span>
            </label>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCompany;
