import Image from "next/image";
import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { HeroSection } from "@/components/HeroSection";

export default function Home() {
  return (
    <div>
      <HeroSection />
    </div>
  );
}
