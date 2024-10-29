"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import Loading from '@/components/global/loading';

const ErrorAlert = ({ message }) => (
  <Alert variant="destructive" className="mb-4">
    <AlertCircleIcon className="h-4 w-4" />
    <AlertTitle>Error</AlertTitle>
    <AlertDescription>{message}</AlertDescription>
  </Alert>
);

const SafeAvatar = ({ team }) => (
  <Avatar>
    <AvatarImage src={team.img} alt={team.text?.split('\n')?.[0] || 'Team'} />
    <AvatarFallback>{(team.text?.split('\n')?.[0] || 'T')?.[0]}</AvatarFallback>
  </Avatar>
);

function Scorecard({ data = [] }) {
  const [activeTab, setActiveTab] = useState("0");

  const teamData = data.map((team = {}) => ({
    tabName: team.tabName || 'Team',
    tabIndex: team.tabIndex?.toString() || '0',
    ...team.data
  }));

  return (
    <div className="container mx-auto p-4 bg-white text-gray-900">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Cricket Match Scorecard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center space-x-4">
            {teamData[0]?.activeTabData?.map((team, index) => (
              <div key={index} className="flex items-center space-x-2">
                <SafeAvatar team={team} />
                <span>{team.text?.split('\n')?.[0] || 'Team Name'}</span>
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
                  {team.sectionsData?.map((section, index) => {
                    if (!section?.data?.length) return null;

                    const headers = Object.keys(section.data[0] || {});
                    if (!headers.length) return null;

                    return (
                      <div key={index}>
                        <h3 className="text-lg font-semibold mb-2">
                          {section.title || 'Untitled Section'}
                        </h3>
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                {headers.map((key) => (
                                  <TableHead key={key}>
                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                  </TableHead>
                                ))}
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {section.data.map((row, rowIndex) => (
                                <TableRow key={rowIndex}>
                                  {headers.map((key, cellIndex) => (
                                    <TableCell key={cellIndex}>
                                      {row[key] || '-'}
                                    </TableCell>
                                  ))}
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {team.partnerShipRows?.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Partnerships</h3>
                    <div className="overflow-x-auto">
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
                              <TableCell>{partnership.wicket || '-'}</TableCell>
                              <TableCell>
                                {partnership.batsman1?.name || 'Unknown'} 
                                ({partnership.batsman1?.runs || 0})
                              </TableCell>
                              <TableCell>
                                {partnership.batsman2?.name || 'Unknown'} 
                                ({partnership.batsman2?.runs || 0})
                              </TableCell>
                              <TableCell>{partnership.partnershipRuns || 0}</TableCell>
                              <TableCell>{partnership.partnershipBalls || 0}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

export default function MatchPage({ params }) {
  const { param1, slug, slugMn, param2, param3, slugMd } = params ?? {};
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!param1?.trim() || !slug?.trim() || !slugMn?.trim() || !param2?.trim() || !param3?.trim() || !slugMd?.trim()) {
        setState(prev => ({
          ...prev,
          error: 'Invalid match parameters',
          loading: false
        }));
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE}/api/match/scoreboard/${param1}/${slug}/${slugMn}/${param2}/${param3}/${slugMd}/scorecard`
        );

        if (!response?.data) {
          throw new Error('Invalid data format received');
        }

        setState(prev => ({
          ...prev,
          data: response.data,
          error: null,
          loading: false
        }));
      } catch (err) {
        console.error('Error fetching scorecard:', err);
        setState(prev => ({
          ...prev,
          error: err.response?.data?.message || 'Failed to load scorecard',
          loading: false
        }));
      }
    };

    fetchData();
  }, [param1, slug, slugMn, param2, param3, slugMd]);

  if (state.loading) return <Loading />;

  if (state.error) {
    return (
      <div className="container mx-auto p-4">
        <ErrorAlert message={state.error} />
      </div>
    );
  }

  if (!state.data) {
    return (
      <div className="container mx-auto p-4">
        <Card className="p-6 text-center text-gray-500">
          <CardContent>No scorecard data available</CardContent>
        </Card>
      </div>
    );
  }

  return <Scorecard data={state.data} />;
}