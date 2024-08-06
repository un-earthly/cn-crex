// pages/stats/batting.jsx
import React from 'react';
// import StatsLayout from '../../components/layouts/StatsLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const BattingStatsPage = () => {
  const battingStats = [
    { rank: 1, player: 'Virat Kohli', matches: 254, innings: 242, runs: 12169, average: 59.07, strikeRate: 93.17, hundreds: 43, fifties: 58 },
    { rank: 2, player: 'Rohit Sharma', matches: 227, innings: 220, runs: 9205, average: 48.96, strikeRate: 88.90, hundreds: 29, fifties: 43 },
    // Add more players...
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Batting Statistics</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rank</TableHead>
              <TableHead>Player</TableHead>
              <TableHead>Matches</TableHead>
              <TableHead>Innings</TableHead>
              <TableHead>Runs</TableHead>
              <TableHead>Average</TableHead>
              <TableHead>Strike Rate</TableHead>
              <TableHead>100s</TableHead>
              <TableHead>50s</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {battingStats.map((stat) => (
              <TableRow key={stat.rank}>
                <TableCell>{stat.rank}</TableCell>
                <TableCell className="font-medium">{stat.player}</TableCell>
                <TableCell>{stat.matches}</TableCell>
                <TableCell>{stat.innings}</TableCell>
                <TableCell>{stat.runs}</TableCell>
                <TableCell>{stat.average.toFixed(2)}</TableCell>
                <TableCell>{stat.strikeRate.toFixed(2)}</TableCell>
                <TableCell>{stat.hundreds}</TableCell>
                <TableCell>{stat.fifties}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default BattingStatsPage;