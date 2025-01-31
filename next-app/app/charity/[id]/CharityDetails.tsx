"use client";

import { useEffect, useState } from "react";
import DonateButton from "@/components/DonateButton";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Heart, Trophy, Clock, DollarSign } from "lucide-react";
import { donateToCharity } from "@/lib/contractInteractions";
import { charityType } from "@/lib/types";
import { GET_CHARITY_BY_ID } from "@/lib/apollo-client";
import { useRouter } from "next/router";
export default function CharityDetails(id) {
  const [donationAmount, setDonationAmount] = useState("");
  // const router = useRouter();
  // const { id } = router.query;
  const [charity, setCharity] = useState<charityType>();
  const { loading, error, data } = useQuery(GET_CHARITY_BY_ID, {
    variables: {
      id: id,
    },
  });
  useEffect(() => {
    if (data) {
      setCharity(data.charity);
    }
  }, [data]);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  // const handleDonate = () => {
  //   // TODO: Implement donation logic
  //   console.log(`Donating ${donationAmount} ETH to ${charity.name}`)
  //   donateToCharity(charity.contractInstance, charity.id, donationAmount)
  // }

  // Convert transactions to chart data
  const chartData = charity.transactions
    .map((tx: any) => ({
      date: tx.date,
      amount: parseFloat(tx.amount),
    }))
    .slice(-7); // Last 7 transactions

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">
          {charity.name}
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {charity.description}
        </p>
      </div>

      {/* Donation Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-blue-600" />
              <span>Total Raised</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">
              {charity.totalRaised} ETH
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-green-600" />
              <span>Total Donors</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              {charity.topDonors.length}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-purple-600" />
              <span>Highest Donation</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-600">
              {Math.max(
                ...charity.transactions.map((tx: any) => parseFloat(tx.amount))
              )}{" "}
              ETH
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Donation Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Make a Donation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <Input
              type="number"
              placeholder="Amount in ETH"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
              className="md:w-64"
            />
            <DonateButton />
          </div>
        </CardContent>
      </Card>

      {/* Donation Chart */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Donation History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#2563eb"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions and Top Donors */}
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Recent Transactions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {charity.transactions.map((tx: any) => (
                <li
                  key={tx.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-900">{tx.donor}</p>
                    <p className="text-sm text-gray-500">{tx.date}</p>
                  </div>
                  <span className="font-semibold text-blue-600">
                    {tx.amount} ETH
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="w-5 h-5" />
              <span>Top Donors</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {charity.topDonors.map((donor: any, index: number) => (
                <li
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                        index === 0
                          ? "bg-yellow-100 text-yellow-800"
                          : index === 1
                          ? "bg-gray-100 text-gray-800"
                          : index === 2
                          ? "bg-orange-100 text-orange-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <p className="font-medium text-gray-900">{donor.address}</p>
                  </div>
                  <span className="font-semibold text-blue-600">
                    {donor.totalDonated} ETH
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
