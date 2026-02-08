import MyAccountNavigation from "@/components/segments/my-account/navigation";

export default function MyAccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative w-full px-10 py-44">
      <div className="fixed z-50 w-68">
        <MyAccountNavigation />
      </div>
      <div className="relative z-20 pl-[320px]">
        {children}
      </div>
      <div
        className="fixed top-0 right-0 z-0 w-screen h-screen"
        style={{
          background:
            "linear-gradient(180deg, #FFF8E8 29.33%, #F2F2F2 100%)",
        }}
      />
    </div>
  );
}
