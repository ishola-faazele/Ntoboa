import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";