// "use client"
// import React, { useEffect, useState } from 'react';
// import { useParams, usePathname } from 'next/navigation';
// import Link from 'next/link';
// import axios from 'axios';
// import Loading from '@/components/global/loading';

// const Layout = ({ children }) => {
//     const params = useParams();
//     const pathname = usePathname();
//     const [loading, setLoading] = useState(true);
//     const [matchData, setMatchData] = useState(null);
//     const { param1, slug, slugMn, param2, param3, slugMd } = params;

//     useEffect(() => {
//         const fetchMatchData = async () => {
//             try {
//                 const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE}/api/match/scrapper/layout/${param1}/${slug}/${slugMn}/${param2}/${param3}/${slugMd}`);

//                 const normalizeTeamData = (team) => {
//                     const isOversFormat = (value) => /^[0-9]+\.[0-9]+$/.test(value);

//                     let score, overs;

//                     if (!team.score && !team.overs) {
//                         score = "N/A";
//                         overs = "N/A";
//                     } else if (isOversFormat(team.overs)) {
//                         overs = team.overs;
//                         score = team.score;
//                     } else {
//                         overs = team.score;
//                         score = team.overs;
//                     }

//                     return {
//                         ...team,
//                         score,
//                         overs,
//                         imageUrl: team.imageUrl || 'defaultImageUrl',
//                     };
//                 };

//                 const normalizedData = {
//                     ...response.data,
//                     team1: normalizeTeamData(response.data.team1),
//                     team2: normalizeTeamData(response.data.team2),
//                 };

//                 setMatchData(normalizedData);
//                 console.log(normalizedData);
//             } catch (error) {
//                 console.error('Error fetching match data:', error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchMatchData();
//     }, [params]);


//     if (loading) {
//         return <Loading />;
//     }
//     const renderTeamInfo = (team, align) => (
//         <div className={`flex items-center space-x-3 ${align === 'right' ? 'flex-row-reverse' : ''}`}>
//             {team.score !== "N/A" && <div
//                 className={`w-12 h-12 bg-white rounded-full ${align === 'right' ? 'ml-3' : 'mr-3'}`}
//                 style={{ backgroundImage: `url(${team.imageUrl})`, backgroundSize: 'cover' }}
//             ></div>}
//             <div className={align === 'right' ? 'text-right' : ''}>
//                 <div className="font-bold">{team.name}</div>
//                 {team.score !== "N/A" && <div className="text-3xl font-bold">{team.score}</div>}
//                 {team.overs !== "N/A" && <div className="text-green-200">{team.overs}</div>}
//             </div>
//         </div>
//     );

//     const renderMatchStatus = () => {
//         if (matchData.team2.name.includes('need')) {
//             return (
//                 <div className="text-center text-sm">
//                     <div>{matchData.team2.name}</div>
//                 </div>
//             );
//         }
//         return (
//             <div className="text-center">
//                 <div className="text-white text-xl font-bold flex items-center justify-center space-x-2 mb-4">
//                     {/* <Trophy size={24} /> */}
//                     <span>{matchData.result}</span>
//                 </div>
//             </div>
//         );
//     };

//     const isActive = (path) => pathname.includes(path);

//     return (
//         <div className="">
//             <div className="mb-6 w-full bg-green-800">
//                 <div className="text-white h-96 flex flex-col">
//                     <header className="p-4 text-center text-sm text-green-200">
//                         {matchData?.matchName || 'Match Details'}
//                     </header>

//                     <main className="flex-grow container flex flex-col items-center justify-center px-4">
//                         <div className="flex justify-between items-center w-full">
//                             {renderTeamInfo(matchData.team1, 'left')}
//                             {renderMatchStatus()}
//                             {renderTeamInfo(matchData.team2, 'right')}
//                         </div>
//                     </main>

//                     <nav className="bg-green-700 p-4">
//                         <ul className="container flex justify-around max-w-md mx-auto">
//                             {['info', 'live', 'scorecard'].map((tab) => (
//                                 <li key={tab} className={isActive(tab) ? 'text-white border-b-2 border-white pb-1' : 'text-green-200 hover:text-white transition-colors'}>
//                                     <Link href={`/scoreboard/${param1}/${slug}/${slugMn}/${param2}/${param3}/${slugMd}/${tab}`}>
//                                         {tab.charAt(0).toUpperCase() + tab.slice(1)}
//                                     </Link>
//                                 </li>
//                             ))}
//                         </ul>
//                     </nav>
//                 </div>
//             </div>

//             <div className="container">
//                 {children}
//             </div>
//         </div>
//     );
// };

// export default Layout;

"use client"
import React, { useEffect, useState } from 'react';
import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import Loading from '@/components/global/loading';

const Layout = ({ children }) => {
    const params = useParams();
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);
    const [matchData, setMatchData] = useState(null);
    const [error, setError] = useState(null);

    // Safely destructure params with default values
    const { param1, slug, slugMn, param2, param3, slugMd } = params ?? {};

    useEffect(() => {
        const fetchMatchData = async () => {
            // Verify all required params are present
            if (!param1 || !slug || !slugMn || !param2 || !param3 || !slugMd) {
                setError('Missing required parameters');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.post(
                    `${process.env.NEXT_PUBLIC_BASE}/api/match/scrapper/layout/${param1}/${slug}/${slugMn}/${param2}/${param3}/${slugMd}`
                );

                const normalizeTeamData = (team = {}) => {
                    const isOversFormat = (value) => {
                        if (!value) return false;
                        return /^[0-9]+\.[0-9]+$/.test(value.toString());
                    };

                    // Provide default values for all properties
                    const defaultTeam = {
                        name: 'Team Name Not Available',
                        score: 'N/A',
                        overs: 'N/A',
                        imageUrl: '/default-team-image.png', // Ensure this default image exists
                    };

                    // Merge provided data with defaults
                    team = { ...defaultTeam, ...team };

                    let score, overs;

                    if (!team.score && !team.overs) {
                        score = "N/A";
                        overs = "N/A";
                    } else if (isOversFormat(team.overs)) {
                        overs = team.overs;
                        score = team.score ?? "N/A";
                    } else {
                        overs = team.score ?? "N/A";
                        score = team.overs ?? "N/A";
                    }

                    return {
                        ...team,
                        score,
                        overs,
                        imageUrl: team.imageUrl || defaultTeam.imageUrl,
                    };
                };

                const normalizedData = {
                    matchName: response.data?.matchName ?? 'Match Details',
                    result: response.data?.result ?? 'Result pending',
                    team1: normalizeTeamData(response.data?.team1),
                    team2: normalizeTeamData(response.data?.team2),
                };

                setMatchData(normalizedData);
                setError(null);
            } catch (error) {
                console.error('Error fetching match data:', error);
                setError('Failed to load match data');
                setMatchData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchMatchData();
    }, [param1, slug, slugMn, param2, param3, slugMd]);

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return (
            <div className="container mx-auto p-4">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            </div>
        );
    }

    if (!matchData) {
        return (
            <div className="container mx-auto p-4">
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative">
                    <span className="block sm:inline">No match data available</span>
                </div>
            </div>
        );
    }

    const renderTeamInfo = (team, align) => {
        if (!team) return null;

        return (
            <div className={`flex items-center space-x-3 ${align === 'right' ? 'flex-row-reverse' : ''}`}>
                {team.score !== "N/A" && (
                    <div
                        className={`w-12 h-12 bg-white rounded-full ${align === 'right' ? 'ml-3' : 'mr-3'}`}
                        style={{
                            backgroundImage: `url(${team.imageUrl})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat'
                        }}
                    />
                )}
                <div className={align === 'right' ? 'text-right' : ''}>
                    <div className="font-bold">{team.name}</div>
                    {team.score !== "N/A" && <div className="text-3xl font-bold">{team.score}</div>}
                    {team.overs !== "N/A" && <div className="text-green-200">{team.overs}</div>}
                </div>
            </div>
        );
    };

    const renderMatchStatus = () => {
        if (!matchData?.team2?.name) return null;

        if (matchData.team2.name.includes('need')) {
            return (
                <div className="text-center text-sm">
                    <div>{matchData.team2.name}</div>
                </div>
            );
        }

        return (
            <div className="text-center">
                <div className="text-white text-xl font-bold flex items-center justify-center space-x-2 mb-4">
                    <span>{matchData.result}</span>
                </div>
            </div>
        );
    };

    const isActive = (path) => {
        if (!pathname) return false;
        return pathname.includes(path);
    };

    return (
        <div className="">
            <div className="mb-6 w-full bg-green-800">
                <div className="text-white h-96 flex flex-col">
                    <header className="p-4 text-center text-sm text-green-200">
                        {matchData?.matchName}
                    </header>

                    <main className="flex-grow container flex flex-col items-center justify-center px-4">
                        <div className="flex justify-between items-center w-full">
                            {renderTeamInfo(matchData.team1, 'left')}
                            {renderMatchStatus()}
                            {renderTeamInfo(matchData.team2, 'right')}
                        </div>
                    </main>

                    <nav className="bg-green-700 p-4">
                        <ul className="container flex justify-around max-w-md mx-auto">
                            {['info', 'live', 'scorecard'].map((tab) => (
                                <li
                                    key={tab}
                                    className={isActive(tab) ? 'text-white border-b-2 border-white pb-1' : 'text-green-200 hover:text-white transition-colors'}
                                >
                                    <Link href={`/scoreboard/${param1}/${slug}/${slugMn}/${param2}/${param3}/${slugMd}/${tab}`}>
                                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>

            <div className="container">
                {children}
            </div>
        </div>
    );
};

export default Layout;