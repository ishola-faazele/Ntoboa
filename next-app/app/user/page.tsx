'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Heart, PiggyBank, Trophy, Target, Calendar, ArrowUpRight } from "lucide-react";

export default function UserAccount() {
  // Sample data - would come from API/blockchain
  const donationHistory = [
    { date: '2024-01', amount: 1.2 },
    { date: '2024-02', amount: 2.5 },
    { date: '2024-03', amount: 1.8 },
    { date: '2024-04', amount: 3.2 },
  ];

  const charityDistribution = [
    { name: 'Education', value: 40 },
    { name: 'Environment', value: 30 },
    { name: 'Healthcare', value: 20 },
    { name: 'Food Security', value: 10 },
  ];

  const COLORS = ['#2563eb', '#16a34a', '#dc2626', '#f59e0b'];

  const createdCharities = [
    { id: 1, name: "Tech Education Fund", raised: "5.2 ETH", donors: 45 },
    { id: 2, name: "Clean Water Initiative", raised: "3.8 ETH", donors: 32 },
  ];

  const contributedCharities = [
    { id: 1, name: "Save the Oceans", donated: "2.1 ETH", date: "2024-03-15" },
    { id: 2, name: "Education for All", donated: "1.5 ETH", date: "2024-02-28" },
    { id: 3, name: "Hunger Relief", donated: "0.8 ETH", date: "2024-01-20" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="text-blue-600" />
              Total Donated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">4.4 ETH</p>
          </CardContent>
        </Card>

        <Card className="bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PiggyBank className="text-green-600" />
              Total Raised
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">9.0 ETH</p>
          </CardContent>
        </Card>

        <Card className="bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="text-red-600" />
              Charities Created
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">2</p>
          </CardContent>
        </Card>

        <Card className="bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="text-orange-600" />
              Charities Supported
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-600">3</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Donation History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={donationHistory}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="amount" stroke="#2563eb" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Donation Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charityDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {charityDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Lists */}
      <Tabs defaultValue="created" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="created">Charities Created</TabsTrigger>
          <TabsTrigger value="contributed">Charities Supported</TabsTrigger>
        </TabsList>

        <TabsContent value="created">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {createdCharities.map((charity) => (
                  <div
                    key={charity.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div>
                      <h3 className="font-semibold">{charity.name}</h3>
                      <p className="text-sm text-gray-600">
                        {charity.donors} donors
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-blue-600">{charity.raised}</p>
                      <p className="text-sm text-gray-600">raised</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contributed">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {contributedCharities.map((charity) => (
                  <div
                    key={charity.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div>
                      <h3 className="font-semibold">{charity.name}</h3>
                      <p className="text-sm text-gray-600">
                        Donated on {charity.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">{charity.donated}</p>
                      <p className="text-sm text-gray-600">donated</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}