"use client";

import { Suspense, type ComponentType } from "react";
import { useSearchParams } from "next/navigation";
import { DEFAULT_MY_ACCOUNT_NAV } from "@/constant/MY_ACCOUNT_NAV_ITEMS";
import MyAccountPurchases from "./purchases";
import MyAccountInvoices from "./invoices";
import MyAccountFontsInUse from "./fonts-in-use";

const NAV_COMPONENTS: Record<string, ComponentType> = {
  "my-purchases": MyAccountPurchases,
  invoices: MyAccountInvoices,
  "fonts-in-use": MyAccountFontsInUse,
};

function MyAccountContent() {
  const searchParams = useSearchParams();
  const nav =
    searchParams.get("nav") || DEFAULT_MY_ACCOUNT_NAV;

  const Component =
    NAV_COMPONENTS[nav] ??
    NAV_COMPONENTS[DEFAULT_MY_ACCOUNT_NAV];

  return <Component />;
}

export default function MyAccount() {
  return (
    <div className="relative w-full min-h-screen">
      <Suspense fallback={<div>Loading...</div>}>
        <MyAccountContent />
      </Suspense>
    </div>
  );
}
