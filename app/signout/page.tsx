import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function Signout() {
  const router = useRouter();
  const handleSignout = async () => {
    try {
      await authClient.signOut();
      toast.success("signed out Successfully");
      router.push("/");
    } catch (e) {
      const error = e as Error;
      toast.error(error.message);
    }
  };
  return (
    <div>
      <Button variant={"ghost"} onClick={handleSignout}>
        Sign out
      </Button>
    </div>
  );
}

export default Signout;
