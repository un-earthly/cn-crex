"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Flag from "react-flagkit";

const teams = [
  { value: "india", label: "India" },
  { value: "australia", label: "Australia" },
  { value: "england", label: "England" },
  { value: "southAfrica", label: "South Africa" },
];

const formats = [
  { value: "test", label: "Test" },
  { value: "odi", label: "ODI" },
  { value: "t20", label: "T20" },
];

const seasons = [
  { value: "2023", label: "2023" },
  { value: "2022", label: "2022" },
  { value: "2021", label: "2021" },
];

const tournaments = [
  { value: "ipl", label: "IPL" },
  { value: "worldCup", label: "World Cup" },
  { value: "t20WorldCup", label: "T20 World Cup" },
];

const stats = [
  { value: "runs", label: "Runs" },
  { value: "wickets", label: "Wickets" },
  { value: "fifties", label: "Fifties" },
  { value: "sixes", label: "Sixes" },
  { value: "strikeRate", label: "Strike Rate" },
];
const battingStats = [
  {
    rank: 1,
    player: "Virat Kohli",
    team: "India",
    countryCode: "IN",
    matches: 254,
    innings: 242,
    runs: 12169,
    average: 59.07,
    strikeRate: 93.17,
    hundreds: 43,
    fifties: 58,
  },
  {
    rank: 2,
    player: "Rohit Sharma",
    team: "India",
    countryCode: "IN",
    matches: 227,
    innings: 220,
    runs: 9205,
    average: 48.96,
    strikeRate: 88.90,
    hundreds: 29,
    fifties: 43,
  },
  {
    rank: 3,
    player: "Steve Smith",
    team: "Australia",
    countryCode: "AU",
    matches: 128,
    innings: 124,
    runs: 4378,
    average: 42.46,
    strikeRate: 85.46,
    hundreds: 11,
    fifties: 25,
  },
  {
    rank: 4,
    player: "Kane Williamson",
    team: "New Zealand",
    countryCode: "NZ",
    matches: 151,
    innings: 144,
    runs: 6173,
    average: 47.83,
    strikeRate: 81.75,
    hundreds: 13,
    fifties: 39,
  },
  {
    rank: 5,
    player: "David Warner",
    team: "Australia",
    countryCode: "AU",
    matches: 128,
    innings: 125,
    runs: 5455,
    average: 45.37,
    strikeRate: 95.76,
    hundreds: 18,
    fifties: 24,
  },
  {
    rank: 6,
    player: "Joe Root",
    team: "England",
    countryCode: "GB",
    matches: 152,
    innings: 145,
    runs: 6109,
    average: 51.34,
    strikeRate: 87.36,
    hundreds: 16,
    fifties: 36,
  },
  {
    rank: 7,
    player: "Babar Azam",
    team: "Pakistan",
    countryCode: "PK",
    matches: 74,
    innings: 72,
    runs: 3359,
    average: 56.61,
    strikeRate: 87.09,
    hundreds: 11,
    fifties: 15,
  },
  {
    rank: 8,
    player: "Quinton de Kock",
    team: "South Africa",
    countryCode: "ZA",
    matches: 121,
    innings: 118,
    runs: 5200,
    average: 44.14,
    strikeRate: 95.29,
    hundreds: 15,
    fifties: 26,
  },
  {
    rank: 9,
    player: "Faf du Plessis",
    team: "South Africa",
    countryCode: "ZA",
    matches: 143,
    innings: 135,
    runs: 5507,
    average: 47.47,
    strikeRate: 88.60,
    hundreds: 12,
    fifties: 35,
  },
  {
    rank: 10,
    player: "Ross Taylor",
    team: "New Zealand",
    countryCode: "NZ",
    matches: 233,
    innings: 217,
    runs: 8026,
    average: 47.01,
    strikeRate: 83.40,
    hundreds: 21,
    fifties: 51,
  },
  {
    rank: 11,
    player: "Shikhar Dhawan",
    team: "India",
    countryCode: "IN",
    matches: 145,
    innings: 142,
    runs: 6105,
    average: 45.96,
    strikeRate: 93.55,
    hundreds: 17,
    fifties: 32,
  },
  {
    rank: 12,
    player: "Aaron Finch",
    team: "Australia",
    countryCode: "AU",
    matches: 129,
    innings: 127,
    runs: 5232,
    average: 41.10,
    strikeRate: 88.92,
    hundreds: 17,
    fifties: 26,
  },
];
const bowlingStats = [
  {
    rank: 1,
    player: "Mitchell Starc",
    team: "Australia",
    countryCode: "AU",
    matches: 100,
    innings: 98,
    wickets: 195,
    average: 22.23,
    economy: 4.85,
    strikeRate: 27.4,
    best: "6/28",
    fiveWickets: 8,
  },
  {
    rank: 2,
    player: "Jasprit Bumrah",
    team: "India",
    countryCode: "IN",
    matches: 67,
    innings: 65,
    wickets: 108,
    average: 24.39,
    economy: 4.49,
    strikeRate: 32.6,
    best: "5/27",
    fiveWickets: 2,
  },
  {
    rank: 3,
    player: "Trent Boult",
    team: "New Zealand",
    countryCode: "NZ",
    matches: 93,
    innings: 91,
    wickets: 169,
    average: 25.16,
    economy: 4.74,
    strikeRate: 31.7,
    best: "7/34",
    fiveWickets: 5,
  },
  {
    rank: 4,
    player: "Kagiso Rabada",
    team: "South Africa",
    countryCode: "ZA",
    matches: 81,
    innings: 78,
    wickets: 126,
    average: 27.37,
    economy: 4.98,
    strikeRate: 33.0,
    best: "6/16",
    fiveWickets: 2,
  },
  {
    rank: 5,
    player: "Pat Cummins",
    team: "Australia",
    countryCode: "AU",
    matches: 73,
    innings: 70,
    wickets: 111,
    average: 27.92,
    economy: 5.16,
    strikeRate: 32.4,
    best: "5/70",
    fiveWickets: 1,
  },
  {
    rank: 6,
    player: "Rashid Khan",
    team: "Afghanistan",
    countryCode: "AF",
    matches: 80,
    innings: 79,
    wickets: 140,
    average: 18.57,
    economy: 4.16,
    strikeRate: 26.8,
    best: "7/18",
    fiveWickets: 4,
  },
  {
    rank: 7,
    player: "Mujeeb Ur Rahman",
    team: "Afghanistan",
    countryCode: "AF",
    matches: 55,
    innings: 54,
    wickets: 85,
    average: 23.36,
    economy: 3.94,
    strikeRate: 35.5,
    best: "5/50",
    fiveWickets: 1,
  },
  {
    rank: 8,
    player: "Imran Tahir",
    team: "South Africa",
    countryCode: "ZA",
    matches: 107,
    innings: 106,
    wickets: 173,
    average: 24.83,
    economy: 4.65,
    strikeRate: 32.0,
    best: "7/45",
    fiveWickets: 3,
  },
  {
    rank: 9,
    player: "Mohammad Shami",
    team: "India",
    countryCode: "IN",
    matches: 79,
    innings: 78,
    wickets: 144,
    average: 25.42,
    economy: 5.40,
    strikeRate: 28.2,
    best: "5/69",
    fiveWickets: 1,
  },
  {
    rank: 10,
    player: "Lockie Ferguson",
    team: "New Zealand",
    countryCode: "NZ",
    matches: 45,
    innings: 45,
    wickets: 77,
    average: 25.39,
    economy: 5.51,
    strikeRate: 27.6,
    best: "5/45",
    fiveWickets: 1,
  },
  {
    rank: 11,
    player: "Shaheen Afridi",
    team: "Pakistan",
    countryCode: "PK",
    matches: 30,
    innings: 29,
    wickets: 59,
    average: 23.67,
    economy: 5.45,
    strikeRate: 26.1,
    best: "6/35",
    fiveWickets: 2,
  },
  {
    rank: 12,
    player: "Adil Rashid",
    team: "England",
    countryCode: "GB",
    matches: 111,
    innings: 109,
    wickets: 159,
    average: 31.78,
    economy: 5.60,
    strikeRate: 34.0,
    best: "5/27",
    fiveWickets: 1,
  },
];


const fetchDummyData = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
};

const BattingStatsPage = () => {
  const [loading, setLoading] = useState(true);
  const [selectedStat, setSelectedStat] = useState("");
  const [selectedTournament, setSelectedTournament] = useState("");
  const [selectedSeason, setSelectedSeason] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [isBatting, setIsBatting] = useState(true);
  const [headerTitle, setHeaderTitle] = useState("Stats");

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

  useEffect(() => {
    fetchDummyData().then((result) => {
      // setData(result);
      setLoading(false);
    });
  }, [selectedStat, selectedTournament, selectedSeason, selectedFormat, selectedTeam]);

  return (
    <div>
      <header className="relative bg-gradient-to-r from-green-800 to-green-900 text-white py-12 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.icc-cricket.com/image/upload/t_ratio21_9-size60/prd/tevxytyonxrsx90jpnqq"
            alt="Cricket match"
            className="opacity-30 object-cover w-full h-full"
            layout="fill"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <Link href="/" className="inline-flex items-center text-green-100 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold mb-8">{headerTitle}</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            <Select onValueChange={(value) => { setSelectedStat(value); setIsBatting(value !== 'wickets'); }}>
              <SelectTrigger className="w-full bg-white bg-opacity-20 border-none text-white">
                <SelectValue placeholder="Select Stat" />
              </SelectTrigger>
              <SelectContent>
                {stats.map((stat) => (
                  <SelectItem key={stat.value} value={stat.value}>
                    {stat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select onValueChange={setSelectedTournament}>
              <SelectTrigger className="w-full bg-white bg-opacity-20 border-none text-white">
                <SelectValue placeholder="Select Tournament" />
              </SelectTrigger>
              <SelectContent>
                {tournaments.map((tournament) => (
                  <SelectItem key={tournament.value} value={tournament.value}>
                    {tournament.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select onValueChange={setSelectedSeason}>
              <SelectTrigger className="w-full bg-white bg-opacity-20 border-none text-white">
                <SelectValue placeholder="Select Season" />
              </SelectTrigger>
              <SelectContent>
                {seasons.map((season) => (
                  <SelectItem key={season.value} value={season.value}>
                    {season.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select onValueChange={setSelectedFormat}>
              <SelectTrigger className="w-full bg-white bg-opacity-20 border-none text-white">
                <SelectValue placeholder="Select Format" />
              </SelectTrigger>
              <SelectContent>
                {formats.map((format) => (
                  <SelectItem key={format.value} value={format.value}>
                    {format.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select onValueChange={setSelectedTeam}>
              <SelectTrigger className="w-full bg-white bg-opacity-20 border-none text-white">
                <SelectValue placeholder="Select Team" />
              </SelectTrigger>
              <SelectContent>
                {teams.map((team) => (
                  <SelectItem key={team.value} value={team.value}>
                    {team.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>
      <div className="container mx-auto px-4 py-8 space-y-12 sm:space-y-16">
        <div className="bg-white shadow-md rounded-lg p-6">
          {loading ? (
            <div className="text-center py-10">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
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
                  {(isBatting ? battingStats : bowlingStats).map((stat) => (
                    <TableRow key={stat.rank}>
                      <TableCell>{stat.rank}</TableCell>
                      <TableCell className="font-medium">{stat.player}</TableCell>
                      <TableCell> <div className="flex gap-2">
                        <Flag country={stat.countryCode} />{stat.team}</div></TableCell>
                      <TableCell>{stat.matches}</TableCell>
                      <TableCell>{stat.innings}</TableCell>
                      {isBatting ? (
                        <>
                          <TableCell>{stat.runs}</TableCell>
                          <TableCell>{stat.average.toFixed(2)}</TableCell>
                          <TableCell>{stat.strikeRate.toFixed(2)}</TableCell>
                          <TableCell>{stat.hundreds}</TableCell>
                          <TableCell>{stat.fifties}</TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell>{stat.wickets}</TableCell>
                          <TableCell>{stat.average.toFixed(2)}</TableCell>
                          <TableCell>{stat.economy.toFixed(2)}</TableCell>
                          <TableCell>{stat.strikeRate.toFixed(2)}</TableCell>
                          <TableCell>{stat.best}</TableCell>
                          <TableCell>{stat.fiveWickets}</TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
