"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  CardContent,
} from "@/components/ui/card";
import { Heart, Users, TrendingUp, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import CreateCharityModal from "./components/CreateCharityModal";
import { useQuery } from "@apollo/client";
import { GET_CHARITIES } from "./lib/apollo-client";
import { charityType } from "./lib/types";
import DonateButton from "@/components/DonateButton";
export default function Home() {
  const [featuredCharities, setFeaturedCharities] = useState<charityType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const { loading, error, data } = useQuery(GET_CHARITIES);
  useEffect(() => {
    if (data) {
      setFeaturedCharities([...data.charities]);
    }
  }, [data]);
  if (error) {
    console.log(error);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Welcome to Ntoboa - Decentralized Crowdfunding
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Support causes you care about with transparent, blockchain-based
            donations. Every transaction is traceable, ensuring your
            contribution makes a real impact.
          </p>
          <div className="flex justify-center gap-4">
            <Button className="bg-blue-600 hover:bg-blue-700" size="lg">
              Start Donating
            </Button>
            <CreateCharityModal />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-blue-50">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Heart className="text-red-500" />
                Total Donations
              </CardTitle>
              <CardDescription className="text-3xl font-bold text-blue-600">
                45.8 ETH
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-purple-50">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Users className="text-purple-500" />
                Active Donors
              </CardTitle>
              <CardDescription className="text-3xl font-bold text-purple-600">
                457
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-green-50">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <TrendingUp className="text-green-500" />
                Success Rate
              </CardTitle>
              <CardDescription className="text-3xl font-bold text-green-600">
                98%
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Featured Charities Section */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Charities</h2>
            <div className="flex items-center gap-4">
              <Search className="text-gray-400" />
              <Input
                placeholder="Search charities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading && <p>Loading...</p>}
            {featuredCharities.map((charity) => (
              <Card
                key={charity.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl mb-2">
                        {charity.name}
                      </CardTitle>
                      <CardDescription>{charity.description}</CardDescription>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {charity.category}
                    </span>
                  </div>
                </CardHeader>
                {/* <CardContent>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Raised: {charity.raisedAmount}</span>
                    <span>{charity.supporters} Supporters</span>
                  </div>
                </CardContent> */}
                <CardFooter>
                  <Link href={`/charity/${charity.id}`} className="w-full">
                    <Button className="w-full" variant="outline">
                      Learn More
                    </Button>
                  </Link>
                  <DonateButton address={String(charity.id)} />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
