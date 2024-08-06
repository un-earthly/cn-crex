import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const BowlingStatsPage = () => {
  const bowlingStats = [
    { rank: 1, player: 'Jasprit Bumrah', matches: 67, innings: 67, overs: 591.3, wickets: 121, average: 24.30, economy: 4.63, strikeRate: 31.5 },
    { rank: 2, player: 'Mohammed Shami', matches: 79, innings: 79, overs: 675.2, wickets: 148, average: 25.56, economy: 5.59, strikeRate: 27.4 },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Bowling Statistics</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rank</TableHead>
              <TableHead>Player</TableHead>
              <TableHead>Matches</TableHead>
              <TableHead>Innings</TableHead>
              <TableHead>Overs</TableHead>
              <TableHead>Wickets</TableHead>
              <TableHead>Average</TableHead>
              <TableHead>Economy</TableHead>
              <TableHead>Strike Rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bowlingStats.map((stat) => (
              <TableRow key={stat.rank}>
                <TableCell>{stat.rank}</TableCell>
                <TableCell className="font-medium">{stat.player}</TableCell>
                <TableCell>{stat.matches}</TableCell>
                <TableCell>{stat.innings}</TableCell>
                <TableCell>{stat.overs}</TableCell>
                <TableCell>{stat.wickets}</TableCell>
                <TableCell>{stat.average.toFixed(2)}</TableCell>
                <TableCell>{stat.economy.toFixed(2)}</TableCell>
                <TableCell>{stat.strikeRate.toFixed(1)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default BowlingStatsPage;