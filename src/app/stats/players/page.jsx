"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Flag from "react-flagkit";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formats, initBattingStats, initBowlingStats, sampleCountries, seasons, stats, teams, tournaments } from "../../../../data";


const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


const BattingStatsPage = () => {
  const [loading, setLoading] = useState(true);
  const [selectedStat, setSelectedStat] = useState("");
  const [selectedTournament, setSelectedTournament] = useState("");
  const [selectedSeason, setSelectedSeason] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [isBatting, setIsBatting] = useState(true);
  const [headerTitle, setHeaderTitle] = useState("Stats");
  const [battingStats, setBattingStats] = useState(initBattingStats);
  const [bowlingStats, setBowlingStats] = useState(initBowlingStats);
  const [infiniteLoading, setInfiniteLoading] = useState(false);

  useEffect(() => {
    const stat = selectedStat
      ? `Most ${stats.find((item) => item.value === selectedStat)?.label}`
      : "Stats";
    const tournament =
      tournaments.find((item) => item.value === selectedTournament)?.label ||
      "";
    const season = selectedSeason ? ` ${selectedSeason}` : "";
    const format = selectedFormat
      ? formats.find((item) => item.value === selectedFormat)?.label
      : "";
    const team = selectedTeam
      ? ` by ${teams.find((item) => item.value === selectedTeam)?.label}`
      : "";

    setHeaderTitle(
      `${stat} in ${capitalize(tournament)}${season} ${format}${team}`.trim()
    );
  }, [
    selectedStat,
    selectedTournament,
    selectedSeason,
    selectedFormat,
    selectedTeam,
  ]);
  const generateSampleData = (isBatting, count = 10) => {


    return Array.from({ length: count }, (_, idx) => {
      const country = sampleCountries[Math.floor(Math.random() * sampleCountries.length)];
      if (isBatting) {
        return {
          rank: battingStats.length + idx + 1,
          player: `Player ${battingStats.length + idx + 1}`,
          team: country.name,
          countryCode: country.code,
          matches: Math.floor(Math.random() * 200),
          innings: Math.floor(Math.random() * 150),
          runs: Math.floor(Math.random() * 10000),
          average: (Math.random() * 50).toFixed(2),
          strikeRate: (Math.random() * 100).toFixed(2),
          hundreds: Math.floor(Math.random() * 25),
          fifties: Math.floor(Math.random() * 50),
        };
      } else {
        return {
          rank: bowlingStats.length + idx + 1,
          player: `Player ${bowlingStats.length + idx + 1}`,
          team: country.name, // Example team name
          countryCode: country.code,
          matches: Math.floor(Math.random() * 200),
          innings: Math.floor(Math.random() * 150),
          wickets: Math.floor(Math.random() * 300),
          average: (Math.random() * 50).toFixed(2),
          economy: (Math.random() * 10).toFixed(2),
          strikeRate: (Math.random() * 100).toFixed(2),
          best: `${Math.floor(Math.random() * 10)}/${Math.floor(Math.random() * 50)}`,
          fiveWickets: Math.floor(Math.random() * 10),
        };
      }
    });
  };

  const fetchDummyData = async (isBatting, isInitialLoad = false) => {
    if (isInitialLoad) {
      setLoading(true);
    } else {
      setInfiniteLoading(true);
    }

    await delay(1000);
    const newData = generateSampleData(isBatting);

    if (isBatting) {
      setBattingStats((prevData) => [...prevData, ...newData]);
    } else {
      setBowlingStats((prevData) => [...prevData, ...newData]);
    }

    if (isInitialLoad) {
      setLoading(false);
    } else {
      setInfiniteLoading(false);
    }
  };

  useEffect(() => {
    fetchDummyData(isBatting, true);
  }, [selectedStat, selectedTournament, selectedSeason, selectedFormat, selectedTeam]);

  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom && !infiniteLoading) {
      fetchDummyData(isBatting);
    }
  };


  return (
    <div>
     
      <div className="container mx-auto px-4 py-8 space-y-12 sm:space-y-16">
        <div className="bg-white shadow-md rounded-lg p-6">
          {loading ? (
            <div className="py-4 text-center text-muted-foreground">
              <Loader2 className="inline animate-spin mr-2" />
              Loading data...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <ScrollArea className="h-[50vh] w-full" onScrollCapture={handleScroll}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rank</TableHead>
                      <TableHead>Player</TableHead>
                      <TableHead>Team</TableHead>
                      <TableHead>Matches</TableHead>
                      <TableHead>Innings</TableHead>
                      {isBatting ? (
                        <>
                          <TableHead>Runs</TableHead>
                          <TableHead>Average</TableHead>
                          <TableHead>Strike Rate</TableHead>
                          <TableHead>100s</TableHead>
                          <TableHead>50s</TableHead>
                        </>
                      ) : (
                        <>
                          <TableHead>Wickets</TableHead>
                          <TableHead>Average</TableHead>
                          <TableHead>Economy</TableHead>
                          <TableHead>Strike Rate</TableHead>
                          <TableHead>Best</TableHead>
                          <TableHead>5W</TableHead>
                        </>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(isBatting ? battingStats : bowlingStats).map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.rank}</TableCell>
                        <TableCell>{item.player}</TableCell>
                        <TableCell className="flex items-center">
                          <Flag country={item.countryCode} className="mr-2 w-4 h-4" />
                          {item.team}
                        </TableCell>
                        <TableCell>{item.matches}</TableCell>
                        <TableCell>{item.innings}</TableCell>
                        {isBatting ? (
                          <>
                            <TableCell>{item.runs}</TableCell>
                            <TableCell>{item.average}</TableCell>
                            <TableCell>{item.strikeRate}</TableCell>
                            <TableCell>{item.hundreds}</TableCell>
                            <TableCell>{item.fifties}</TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell>{item.wickets}</TableCell>
                            <TableCell>{item.average}</TableCell>
                            <TableCell>{item.economy}</TableCell>
                            <TableCell>{item.strikeRate}</TableCell>
                            <TableCell>{item.best}</TableCell>
                            <TableCell>{item.fiveWickets}</TableCell>
                          </>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
              {infiniteLoading && (
                <div className="py-4 text-center text-muted-foreground">
                  <Loader2 className="inline animate-spin mr-2" />
                  Loading more data...
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const capitalize = (s) => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export default BattingStatsPage;
