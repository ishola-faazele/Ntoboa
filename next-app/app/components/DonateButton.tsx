import { Button } from "@/components/ui/button";
import { donateToCharity } from "@/lib/contractInteractions";
const handleDonate = (e:Event) => {
    console.log("donate");
    // donateToCharity(,e.target.id, e.target.value);
};
export default function DonateButton(): JSX.Element {
  return (
    <>
      <Button
        onClick={handleDonate}
        className="bg-blue-600 hover:bg-blue-700"
        size="lg"
      >
        Donate Now
      </Button>
    </>
  );
}
