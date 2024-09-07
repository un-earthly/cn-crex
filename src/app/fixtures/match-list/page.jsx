"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clock, Calendar, ChevronRight } from "lucide-react"
import axios from "axios"
import Loading from "@/components/global/loading"
import Link from "next/link"

const TeamDisplay = ({ team, logo, reverse = false }) => (
  <div className={`flex flex-col items-center w-1/3 ${reverse ? 'flex-col-reverse' : ''}`}>
    {logo && (
      <img
        src={logo}
        alt={team}
        className="w-12 h-12 object-contain mb-2"
      />
    )}
    <span className="font-medium text-center">{team}</span>
  </div>
);

const MatchInfo = ({ result, matchInfo, startTime }) => (
  <div className="flex flex-col items-center justify-center w-1/3">
    {result && (
      <Badge variant="outline" className="mb-2">
        {result}
      </Badge>
    )}
    {matchInfo && (
      <p className="text-sm text-gray-500 text-center mb-2">{matchInfo}</p>
    )}
    {startTime && (
      <div className="flex items-center text-sm text-gray-600">
        <Clock className="w-4 h-4 mr-2" />
        <span>{startTime}</span>
      </div>
    )}
  </div>
);
export default function Component() {
  const [seriesData, setSeriesData] = useState({})
  const [isLoading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE}/api/fixtures/match-list`)
      const groupedData = response.data.reduce((acc, datewiseMatch) => {
        const date = datewiseMatch.date;
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(...datewiseMatch.matches);
        return acc;
      }, {});
      console.log(groupedData)
      setSeriesData(groupedData)
    } catch (err) {
      console.error('Error fetching data:', err)
      setError('Failed to fetch series data. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (isLoading) {
    return <Loading />
  }

  if (error) {
    return <div className="text-red-500 text-center" role="alert">{error}</div>
  }

  return (
    <div className="container mx-auto p-4">
      {/* <h1 className="text-2xl font-bold mb-6">Upcoming Cricket Series</h1> */}
      {Object.entries(seriesData).map(([month, series]) => (
        <div key={month} className="mb-8">
          <h2 className="text-xl font-semibold mb-4">{month}</h2>
          <div className="space-y-4 flex flex-col">
            {series.map((match) => (
              <Link key={match.link} href={match.link}>
                <Card className="w-full hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <TeamDisplay team={match.team1} logo={match.logo1} />
                      <MatchInfo
                        result={match.result}
                        matchInfo={match.matchInfo}
                        startTime={match.startTime}
                      />
                      <TeamDisplay team={match.team2} logo={match.logo2} reverse />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

        </div>
      ))}

    </div>
  )
}