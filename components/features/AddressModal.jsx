"use client";
import { XIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { addAddress as addAddressToStore, setAddresses } from "@/lib/features/address/addressSlice";
import { vi } from "@/lib/i18n";
import { addAddress, updateAddress } from "./actions/address";

const AddressModal = ({ setShowAddressModal, editingAddress = null }) => {
  const dispatch = useDispatch();
  const addressList = useSelector((state) => state.address.list);
  const isEditing = !!editingAddress;

  const [address, setAddress] = useState({
    name: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    phone: "",
  });

  useEffect(() => {
    if (editingAddress) {
      setAddress({
        name: editingAddress.name || "",
        email: editingAddress.email || "",
        street: editingAddress.street || "",
        city: editingAddress.city || "",
        state: editingAddress.state || "",
        zip: editingAddress.zip || "",
        country: editingAddress.country || "",
        phone: editingAddress.phone || "",
      });
    }
  }, [editingAddress]);

  const handleAddressChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let result;
      
      if (isEditing) {
        // Update existing address
        result = await updateAddress(editingAddress.id, address);
        
        if (!result.success) {
          return toast.error(result.error);
        }
        
        // Update Redux
        const updatedList = addressList.map((addr) =>
          addr.id === editingAddress.id ? result.address : addr
        );
        dispatch(setAddresses(updatedList));
      } else {
        // Add new address
        result = await addAddress(address);
        
        if (!result.success) {
          return toast.error(result.error);
        }
        
        dispatch(addAddressToStore(result.newAddress));
      }
      
      toast.success(result.message);
      setShowAddressModal(false);
    } catch (error) {
      toast.error(error.message || "Có lỗi xảy ra");
    }
  };

  return (
    <form
      onSubmit={(e) =>
        toast.promise(handleSubmit(e), { 
          loading: isEditing ? "Đang cập nhật..." : "Đang thêm địa chỉ..." 
        })
      }
      className="fixed inset-0 z-50 bg-white/60 backdrop-blur h-screen flex items-center justify-center"
    >
      <div className="flex flex-col gap-5 text-slate-700 w-full max-w-sm mx-6">
        <h2 className="text-3xl ">
          {isEditing ? "Chỉnh sửa địa chỉ" : vi.address.addAddress}
        </h2>
        <input
          name="name"
          onChange={handleAddressChange}
          value={address.name}
          className="p-2 px-4 outline-none border border-slate-200 rounded w-full"
          type="text"
          placeholder={vi.address.name}
          required
        />
        <input
          name="email"
          onChange={handleAddressChange}
          value={address.email}
          className="p-2 px-4 outline-none border border-slate-200 rounded w-full"
          type="email"
          placeholder={vi.address.email}
          required
        />
        <input
          name="street"
          onChange={handleAddressChange}
          value={address.street}
          className="p-2 px-4 outline-none border border-slate-200 rounded w-full"
          type="text"
          placeholder={vi.address.street}
          required
        />
        <div className="flex gap-4">
          <input
            name="city"
            onChange={handleAddressChange}
            value={address.city}
            className="p-2 px-4 outline-none border border-slate-200 rounded w-full"
            type="text"
            placeholder={vi.address.city}
            required
          />
          <input
            name="state"
            onChange={handleAddressChange}
            value={address.state}
            className="p-2 px-4 outline-none border border-slate-200 rounded w-full"
            type="text"
            placeholder={vi.address.state}
            required
          />
        </div>
        <div className="flex gap-4">
          <input
            name="zip"
            onChange={handleAddressChange}
            value={address.zip}
            className="p-2 px-4 outline-none border border-slate-200 rounded w-full"
            type="number"
            placeholder={vi.address.zip}
            required
          />
          <input
            name="country"
            onChange={handleAddressChange}
            value={address.country}
            className="p-2 px-4 outline-none border border-slate-200 rounded w-full"
            type="text"
            placeholder={vi.address.country}
            required
          />
        </div>
        <input
          name="phone"
          onChange={handleAddressChange}
          value={address.phone}
          className="p-2 px-4 outline-none border border-slate-200 rounded w-full"
          type="text"
          placeholder={vi.address.phone}
          required
        />
        <button className="bg-slate-800 text-white text-sm font-medium py-2.5 rounded-md hover:bg-slate-900 active:scale-95 transition-all">
          {isEditing ? "CẬP NHẬT" : vi.common.save.toUpperCase()}
        </button>
      </div>
      <XIcon
        size={30}
        className="absolute top-5 right-5 text-slate-500 hover:text-slate-700 cursor-pointer"
        onClick={() => setShowAddressModal(false)}
      />
    </form>
  );
};

export default AddressModal;
