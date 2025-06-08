"use client";
import React from "react";

import {SignOutButton} from "@/components/auth/authButtons";
import SettingsGroup from "@/components/settings/SettingsGroup";

const SettingsPage = () => {


  return (
    <div className="text-white h-full overflow-auto flex flex-col justify-between p-4">
      <div>
          <SettingsGroup />
      </div>
      <SignOutButton />
    </div>
  );
};

export default SettingsPage;
