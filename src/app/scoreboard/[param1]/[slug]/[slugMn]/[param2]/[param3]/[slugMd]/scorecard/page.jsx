"use client"

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Loading from '@/components/global/loading'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function MatchPage({ params }) {
  const { param1, slug, slugMn, param2, param3, slugMd } = params;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE}/api/match/scoreboard/${param1}/${slug}/${slugMn}/${param2}/${param3}/${slugMd}/scorecard`);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [param1, slug, slugMn, param2, param3, slugMd]);

  if (loading) {
    return <Loading />;
  }

  if (!data) {
    return <p className="text-center text-red-500">Failed to load data.</p>;
  }

  return <Scorecard data={data} />;
}


function Scorecard({ data }) {
  const [activeTab, setActiveTab] = useState("0")

  if (!data) {
    return <Loading />
  }

  const teamData = data.map((team) => ({
    tabName: team.tabName,
    tabIndex: team.tabIndex.toString(),
    ...team.data
  }))

  return (
    <div className="container mx-auto p-4 bg-white text-gray-900">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Cricket Match Scorecard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center space-x-4">
            {teamData[0].activeTabData && teamData[0].activeTabData.map((team, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Avatar>
                  <AvatarImage src={team.img} alt={team.text.split('\n')[0]} />
                  <AvatarFallback>{team.text.split('\n')[0]}</AvatarFallback>
                </Avatar>
                <span>{team.text.split('\n')[0]}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          {teamData.map((team) => (
            <TabsTrigger key={team.tabIndex} value={team.tabIndex}>
              {team.tabName}
            </TabsTrigger>
          ))}
        </TabsList>
        {teamData.map((team) => (
          <TabsContent key={team.tabIndex} value={team.tabIndex}>
            <Card>
              <CardHeader>
                <CardTitle>{team.tabName}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {team.sectionsData && team.sectionsData.map((section, index) => {
                    if (!section || !section.data || section.data.length === 0) return null;
                    return (
                      <div key={index}>
                        <h3 className="text-lg font-semibold mb-2">{section.title || 'Untitled Section'}</h3>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              {Object.keys(section.data[0]).map((key) => (
                                <TableHead key={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</TableHead>
                              ))}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {section.data.map((row, rowIndex) => (
                              <TableRow key={rowIndex}>
                                {Object.values(row).map((value, cellIndex) => (
                                  <TableCell key={cellIndex}>{value}</TableCell>
                                ))}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    );
                  })}
                </div>

                {team.partnerShipRows && team.partnerShipRows.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Partnerships</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Wicket</TableHead>
                          <TableHead>Batsman 1</TableHead>
                          <TableHead>Batsman 2</TableHead>
                          <TableHead>Runs</TableHead>
                          <TableHead>Balls</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {team.partnerShipRows.map((partnership, index) => (
                          <TableRow key={index}>
                            <TableCell>{partnership.wicket}</TableCell>
                            <TableCell>{partnership.batsman1.name} ({partnership.batsman1.runs})</TableCell>
                            <TableCell>{partnership.batsman2.name} ({partnership.batsman2.runs})</TableCell>
                            <TableCell>{partnership.partnershipRuns}</TableCell>
                            <TableCell>{partnership.partnershipBalls}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}