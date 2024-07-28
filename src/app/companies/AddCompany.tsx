"use client";
import { CalendarBlank, X } from "@phosphor-icons/react";
import { useState } from "react";
import DatePicker from "react-datepicker";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import "react-datepicker/dist/react-datepicker.css";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const AddCompany = ({ isOpen, onClose }: Props) => {
  const [phone, setPhone] = useState("");
  const [startMonth, setStartMonth] = useState<any>();
  const [endMonth, setEndMonth] = useState<any>("");
  return (
    <div
      className={`fixed inset-0 z-50 transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-300 ease-in-out`}
    >
      <div className="fixed right-0 top-0 bottom-0 max-w-lg rounded-lg overflow-hidden shadow-xl overflow-y-auto">
        <div>
          <div className="bg-slate-50 p-5 flex justify-between">
            <div>
              <h1 className="text-2xl font-bold">Add Company</h1>
              <p className="text-slate-400">
                Get started by filling in the information to add new company
              </p>
            </div>
            <X onClick={onClose} size={28} className="cursor-pointer" />
          </div>
          <div className="bg-white">
            <h2 className="px-10 pt-10 text-xl font-bold">
              Company Information
            </h2>
            <form className="mt-4">
              <div className="px-10">
                <div className="space-y-8">
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
                      type="text"
                      placeholder="EIN"
                    />
                  </div>
                  <div className="flex justify-between">
                    <label className="w-[175px] text-nowrap">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      <input
                        className="w-full border outline-none rounded-md px-3 py-2"
                        type="text"
                        placeholder="Address line"
                      />
                      <div className="flex gap-2">
                        <input
                          className="w-1/2 border outline-none rounded-md px-3 py-2"
                          type="text"
                          placeholder="Zip code"
                        />

                        <select className="w-1/2 border outline-none rounded-md px-3 py-2">
                          <option value="">City</option>
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <select className="w-1/2 border outline-none rounded-md px-3 py-2">
                          <option className="text-slate-300" value="">
                            State
                          </option>
                        </select>
                        <select className="w-1/2 border outline-none rounded-md px-3 py-2">
                          <option className="text-slate-300" value="">
                            Country
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-10">
                  <h2 className="text-xl font-bold">Master Account</h2>
                  <div className="mt-5">
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
                  </div>
                </div>
                <div className="my-10">
                  <h2 className="text-xl font-bold">Billing Information</h2>
                  <div className="mt-5 space-y-8">
                    <div className="flex gap-4 items-center justify-between">
                      <label className="w-[200px] text-nowrap">
                        Start Month <span className="text-red-500">*</span>
                      </label>
                      <div className="w-full">
                        <DatePicker
                          className="w-full border outline-none rounded-md px-3 py-2"
                          placeholderText="Pick a month"
                          showIcon
                          icon={<CalendarBlank className="text-slate-500" />}
                          dateFormat={"MMMM yyyy"}
                          showMonthYearPicker
                          onChange={(month) => setStartMonth(month)}
                          selected={startMonth}
                        />
                      </div>
                    </div>
                    <div className="flex gap-4 items-center justify-between">
                      <label className="w-[200px] text-nowrap">End Month</label>
                      <div className="w-full">
                        <DatePicker
                          className="w-full border outline-none rounded-md px-3 py-2"
                          placeholderText="Pick a month"
                          showIcon
                          icon={<CalendarBlank className="text-slate-500" />}
                          dateFormat={"MMMM yyyy"}
                          showMonthYearPicker
                          onChange={(month) => setEndMonth(month)}
                          selected={endMonth}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="py-5 pr-10 bg-slate-50 flex gap-5 justify-end">
                <button
                  onClick={onClose}
                  type="button"
                  className="bg-white border-2 rounded-md font-semibold px-3 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 rounded-md font-semibold px-3 py-2 text-white"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCompany;
