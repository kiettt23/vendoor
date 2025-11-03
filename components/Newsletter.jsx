import React from "react";
import ViewMore from "./ViewMore";

const Newsletter = () => {
  return (
    <div className="flex flex-col items-center mx-4 my-36">
      <ViewMore
        title="Join Newsletter"
        description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio non et sit, nam eum incidunt!"
        visibleButton={false}
      />
      <div className="flex bg-slate-100 text-sm p-1 rounded-full w-full max-w-xl my-10 border-2 border-white ring ring-slate-200">
        <input
          className="flex-1 pl-5 outline-none"
          type="text"
          placeholder="Enter your email address"
        />
        <button className="font-medium bg-purple-500 text-white px-7 py-3 rounded-full hover:scale-103 active:scale-95 transition">
          Get Updates
        </button>
      </div>
    </div>
  );
};

export default Newsletter;
