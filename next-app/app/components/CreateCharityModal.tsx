"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Image as ImageIcon } from "lucide-react";
import { ethers } from "ethers";
import { initializeContract, addCharity } from "@/lib/contractInteractions";
import { useContract } from "@/lib/ContractContext";
interface FormData {
  name: string;
  description: string;
  category: string;
  goal: string;
  website: string;
  image: File | null;
}
export default function CreateCharityModal() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    category: "",
    goal: "",
    website: "",
    image: null,
  });
  const contract = useContract();
  // useEffect(() => {
  //   const loadContract = async () => {
  //     try {
  //       const contractInstance = await initializeContract();
  //       setContract(contractInstance);
  //     } catch (error) {
  //       if (error instanceof Error) {
  //         console.error("Failed to initialize contract:", error.message);
  //       } else {
  //         console.error("Unknown error occurred:", error);
  //       }
  //     }
  //   };
  //   loadContract();
  // }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (parseFloat(formData.goal) <= 0) {
      alert("The fundraising goal must be greater than 0.");
      return; 
    }
    setIsLoading(true);

    try {
      if (contract) {
        console.log("Function arguments:", {
          name: formData.name,
          description: formData.description,
          goal: ethers.parseEther(formData.goal),
        });
        const tx = await addCharity(
          contract,
          formData.name,
          formData.description,
          ethers.parseEther(formData.goal)
        );
        console.log("Transaction:", tx);

        // Wait for transaction to be mined
        const receipt = await tx.wait();
        console.log("Transaction receipt:", receipt);

        // Reset form after successful creation
        setFormData({
          name: "",
          description: "",
          category: "",
          goal: "",
          website: "",
          image: null,
        });
      }
    } catch (error: any) {
      // console.error("Error creating charity:", error);
      console.error("Detailed error:", {
        error,
        code: error.code,
        message: error.message,
        data: error.data,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg">
          Create a Charity
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto
 bg-gradient-to-br from-white via-gray-100 to-gray-50 rounded-lg shadow-xl border border-gray-200"
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800">
            Create New Charity
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Launch your charitable campaign on the blockchain. Fill in the
            details below to get started.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Charity Name */}
            <div>
              <Label
                htmlFor="name"
                className="text-sm font-semibold text-gray-700"
              >
                Charity Name
              </Label>
              <Input
                id="name"
                placeholder="Enter charity name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="mt-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Description */}
            <div>
              <Label
                htmlFor="description"
                className="text-sm font-semibold text-gray-700"
              >
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Describe your charity's mission and goals"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
                className="mt-1 h-32 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Category & Goal */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="category"
                  className="text-sm font-semibold text-gray-700"
                >
                  Category
                </Label>
                <Select
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                  value={formData.category}
                >
                  <SelectTrigger className="mt-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="environment">Environment</SelectItem>
                    <SelectItem value="health">Healthcare</SelectItem>
                    <SelectItem value="poverty">Poverty Relief</SelectItem>
                    <SelectItem value="disaster">Disaster Relief</SelectItem>
                    <SelectItem value="animals">Animal Welfare</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label
                  htmlFor="goal"
                  className="text-sm font-semibold text-gray-700"
                >
                  Fundraising Goal (ETH)
                </Label>
                <Input
                  id="goal"
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  value={formData.goal}
                  onChange={(e) =>
                    setFormData({ ...formData, goal: e.target.value })
                  }
                  required
                  className="mt-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Website */}
            <div>
              <Label
                htmlFor="website"
                className="text-sm font-semibold text-gray-700"
              >
                Website (Optional)
              </Label>
              <Input
                id="website"
                type="url"
                placeholder="https://"
                value={formData.website}
                onChange={(e) =>
                  setFormData({ ...formData, website: e.target.value })
                }
                className="mt-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Charity Image */}
            <div>
              <Label className="text-sm font-semibold text-gray-700">
                Charity Image
              </Label>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 px-6 py-10">
                <div className="text-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-blue-50 font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setFormData({ ...formData, image: file });
                          }
                        }}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs leading-5 text-gray-600">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="sticky bottom-0 bg-white shadow-lg">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Creating...
                </div>
              ) : (
                "Create Charity"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
