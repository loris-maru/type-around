import Account from "@/components/segments/account";
import { ErrorBoundary } from "@/components/global/error-boundary";

export default function AccountPage() {
  return (
    <ErrorBoundary>
      <div className="relative w-full">
        <Account />
      </div>
    </ErrorBoundary>
  );
}
