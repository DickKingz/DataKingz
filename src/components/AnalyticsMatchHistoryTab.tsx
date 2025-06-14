import React from 'react';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const AnalyticsMatchHistoryTab = ({
  searchQuery,
  setSearchQuery,
  handlePlayerSearch,
  playerStats,
  searchedPlayer,
  playerMatches,
  expandedMatchIdx,
  setExpandedMatchIdx,
  getAvatarColor,
  getDuration,
  getWinner,
  TooltipComponent,
  recentMatches,
  recentMatchesFilter,
  setRecentMatchesFilter
}: {
  searchQuery: any;
  setSearchQuery: any;
  handlePlayerSearch: any;
  playerStats: any;
  searchedPlayer: any;
  playerMatches: any;
  expandedMatchIdx: any;
  setExpandedMatchIdx: any;
  getAvatarColor: any;
  getDuration: any;
  getWinner: any;
  TooltipComponent: any;
  recentMatches: any;
  recentMatchesFilter: any;
  setRecentMatchesFilter: any;
}) => (
  <div className="bg-gray-900 rounded-2xl p-6 shadow-lg mb-12">
    <h2 className="text-xl font-bold mb-4">Player Search</h2>
    <div className="flex gap-2 mb-4 items-center">
      <input
        type="text"
        className="px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-400"
        placeholder="Enter player name (exact match)..."
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') handlePlayerSearch(); }}
      />
      <button
        className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all"
        onClick={handlePlayerSearch}
      >
        Search
      </button>
      <div className="flex gap-1 ml-4">
        {['24h', '3d', '1w', '30d'].map(range => (
          <button
            key={range}
            onClick={() => setRecentMatchesFilter(range)}
            className={`px-2 py-1 rounded text-xs font-bold transition-all duration-150 ${recentMatchesFilter === range ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-blue-600 hover:text-white'}`}
          >
            {range}
          </button>
        ))}
      </div>
    </div>
    {playerStats && (
      <div className="bg-gray-800 rounded-xl p-4 mb-6 flex flex-col md:flex-row md:items-center md:gap-8">
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <span className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold uppercase ${getAvatarColor(playerStats.name)} shadow-inner border-2 border-gray-700`}>{playerStats.name.slice(0,2)}</span>
          <span className="text-xl font-bold text-white">{playerStats.name}</span>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-slate-300">
          <span><span className="font-bold text-blue-400">Matches:</span> {playerStats.total}</span>
          <span><span className="font-bold text-blue-400">Wins:</span> {playerStats.wins}</span>
          <span><span className="font-bold text-blue-400">Avg Rank:</span> {playerStats.avgRank}</span>
          <span><span className="font-bold text-blue-400">Win Rate:</span> {playerStats.winRate}</span>
          <span><span className="font-bold text-blue-400">Most Played Region:</span> {playerStats.mostPlayedRegion}</span>
        </div>
      </div>
    )}
    {searchedPlayer && (
      <div className="bg-gray-800 rounded-xl p-4 mb-8">
        <h3 className="text-lg font-bold mb-2 text-blue-300">Match History</h3>
        {playerMatches.length === 0 ? (
          <div className="text-slate-400">No matches found for <span className="font-bold">{searchedPlayer}</span>.</div>
        ) : (
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="text-blue-400 text-xs uppercase">
                <th className="py-2 px-2"></th>
                <th className="py-2 px-2">Date</th>
                <th className="py-2 px-2">Region</th>
                <th className="py-2 px-2">Duration</th>
                <th className="py-2 px-2">Rank</th>
                <th className="py-2 px-2">Rating</th>
                <th className="py-2 px-2">Δ Rating</th>
                <th className="py-2 px-2">Winner</th>
              </tr>
            </thead>
            <tbody>
              {playerMatches.map((game: any, idx: any) => {
                const playerResult = Array.isArray(game.results) ? game.results.find((r: any) => (r.player || '').toLowerCase() === searchedPlayer.toLowerCase()) : null;
                const isWinner = playerResult && playerResult.rank === 1;
                return (
                  <React.Fragment key={game.gameId || game.id || idx}>
                    <tr className={`border-b border-gray-800 ${isWinner ? 'bg-yellow-900/10 ring-2 ring-yellow-400/60' : idx % 2 === 0 ? 'bg-gray-900/60' : 'bg-gray-950/60'}`}>
                      <td className="py-2 px-2 align-middle">
                        <button onClick={() => setExpandedMatchIdx(expandedMatchIdx === idx ? null : idx)} className="focus:outline-none">
                          {expandedMatchIdx === idx ? <ChevronDownIcon className="w-5 h-5 text-blue-400" /> : <ChevronRightIcon className="w-5 h-5 text-blue-400" />}
                        </button>
                      </td>
                      <td className="py-2 px-2">{game.startTime ? new Date(game.startTime).toLocaleString() : '-'}</td>
                      <td className="py-2 px-2">{game.regionId || game.region || '-'}</td>
                      <td className="py-2 px-2">{getDuration(game)}</td>
                      <td className="py-2 px-2 font-bold text-white">{playerResult?.rank ?? '-'}</td>
                      <td className="py-2 px-2">{playerResult?.rating ?? '-'}</td>
                      <td className={`py-2 px-2 font-mono ${playerResult?.ratingChange > 0 ? 'text-green-400' : playerResult?.ratingChange < 0 ? 'text-red-400' : 'text-slate-300'}`}>{playerResult?.ratingChange > 0 ? '+' : ''}{playerResult?.ratingChange ?? '-'}</td>
                      <td className="py-2 px-2 font-bold text-green-400">{getWinner(game)}</td>
                    </tr>
                    {expandedMatchIdx === idx && (
                      <tr className="bg-gray-800/80 transition-all duration-300 animate-fade-in">
                        <td colSpan={8} className="p-4">
                          {/* Reuse facepile and stats from above */}
                          <div className="mb-4">
                            <div className="flex flex-row gap-6 items-end justify-start flex-wrap">
                              {Array.isArray(game.results) && game.results.length > 0 ? (
                                game.results.map((result: any, i: any) => {
                                  const isWinner = result.player === getWinner(game);
                                  return (
                                    <div key={i} className={`flex flex-col items-center px-3 py-2 rounded-xl ${isWinner ? 'ring-2 ring-yellow-400/80 bg-yellow-900/10' : 'bg-gray-900/60'} shadow transition-all`}>
                                      <span className={`w-12 h-12 mb-1 rounded-full flex items-center justify-center text-base font-bold uppercase ${getAvatarColor(result.player || '')} shadow-inner border-2 border-gray-800`} title={result.player}>
                                        {result.player?.slice(0,2) || '?'}
                                      </span>
                                      <span className="text-xs font-bold text-white mb-2 text-center truncate max-w-[80px]">{result.player}</span>
                                      <div className="flex flex-col gap-1 w-full">
                                        <span className="flex items-center justify-between text-xs text-slate-400"><span>Rank</span><span className="font-bold text-white">{result.rank ?? '-'}</span></span>
                                        <span className="flex items-center justify-between text-xs text-slate-400"><span>Rating</span><span className="font-bold text-white">{result.rating ?? '-'}</span></span>
                                        <span className={`flex items-center justify-between text-xs font-mono ${result.ratingChange > 0 ? 'text-green-400' : result.ratingChange < 0 ? 'text-red-400' : 'text-slate-300'}`}><span>Δ Rating</span><span>{result.ratingChange > 0 ? '+' : ''}{result.ratingChange ?? '-'}</span></span>
                                        <span className="flex items-center justify-between text-xs text-slate-400"><span>Level</span><span className="font-bold text-white">{result.level ?? '-'}</span></span>
                                        <span className="flex items-center justify-between text-xs text-slate-400"><span>Drone HP</span><span className="font-bold text-white">{result.droneHealth ?? '-'}</span></span>
                                      </div>
                                    </div>
                                  );
                                })
                              ) : (
                                <span className="text-slate-400">No player stats available.</span>
                              )}
                            </div>
                          </div>
                          {/* Rounds Breakdown */}
                          {Array.isArray(game.rounds) && game.rounds.length > 0 && (
                            <div className="mt-6">
                              <h3 className="text-lg font-bold mb-2 text-purple-300">Rounds Breakdown</h3>
                              <table className="min-w-full text-left text-sm">
                                <thead>
                                  <tr className="text-purple-400">
                                    <TooltipComponent text="Round number"><th className="py-1 px-2">Round</th></TooltipComponent>
                                    <TooltipComponent text="Winner of the round"><th className="py-1 px-2">Winner</th></TooltipComponent>
                                    {/* Add more round stats if available */}
                                  </tr>
                                </thead>
                                <tbody>
                                  {game.rounds.map((round: any, j: any) => (
                                    <tr key={j} className={j % 2 === 0 ? 'bg-gray-900/40' : 'bg-gray-950/40'}>
                                      <td className="py-1 px-2">{round.roundNumber ?? j + 1}</td>
                                      <td className="py-1 px-2">{round.winner ?? '-'}</td>
                                      {/* Add more round stats here if available */}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    )}
    {/* Recent Matches Section */}
    <div className="bg-gray-800 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-lg font-bold text-blue-300">Recent Matches</h3>
      </div>
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="text-blue-400 text-xs uppercase">
            <th className="py-2 px-2"></th>
            <th className="py-2 px-2">Date</th>
            <th className="py-2 px-2">Region</th>
            <th className="py-2 px-2">Duration</th>
            <th className="py-2 px-2">Winner</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(recentMatches) && recentMatches.length > 0 ? recentMatches.map((game: any, idx: any) => {
            const isExpanded = expandedMatchIdx === `recent-${idx}`;
            return (
              <React.Fragment key={game.gameId || game.id || idx}>
                <tr className={`border-b border-gray-800 ${idx % 2 === 0 ? 'bg-gray-900/60' : 'bg-gray-950/60'}`}>
                  <td className="py-2 px-2 align-middle">
                    <button onClick={() => setExpandedMatchIdx(isExpanded ? null : `recent-${idx}`)} className="focus:outline-none">
                      {isExpanded ? <ChevronDownIcon className="w-5 h-5 text-blue-400" /> : <ChevronRightIcon className="w-5 h-5 text-blue-400" />}
                    </button>
                  </td>
                  <td className="py-2 px-2">{game.startTime ? new Date(game.startTime).toLocaleString() : '-'}</td>
                  <td className="py-2 px-2">{game.regionId || game.region || '-'}</td>
                  <td className="py-2 px-2">{getDuration(game)}</td>
                  <td className="py-2 px-2 font-bold text-green-400">{getWinner(game)}</td>
                </tr>
                {isExpanded && (
                  <tr className="bg-gray-800/80 transition-all duration-300 animate-fade-in">
                    <td colSpan={5} className="p-4">
                      <div className="mb-4">
                        <div className="flex flex-row gap-6 items-end justify-start flex-wrap">
                          {Array.isArray(game.results) && game.results.length > 0 ? (
                            game.results.map((result: any, i: any) => {
                              const isWinner = result.player === getWinner(game);
                              return (
                                <div key={i} className={`flex flex-col items-center px-3 py-2 rounded-xl ${isWinner ? 'ring-2 ring-yellow-400/80 bg-yellow-900/10' : 'bg-gray-900/60'} shadow transition-all`}>
                                  <span className={`w-12 h-12 mb-1 rounded-full flex items-center justify-center text-base font-bold uppercase ${getAvatarColor(result.player || '')} shadow-inner border-2 border-gray-800`} title={result.player}>
                                    {result.player?.slice(0,2) || '?'}
                                  </span>
                                  <span className="text-xs font-bold text-white mb-2 text-center truncate max-w-[80px]">{result.player}</span>
                                  <div className="flex flex-col gap-1 w-full">
                                    <span className="flex items-center justify-between text-xs text-slate-400"><span>Rank</span><span className="font-bold text-white">{result.rank ?? '-'}</span></span>
                                    <span className="flex items-center justify-between text-xs text-slate-400"><span>Rating</span><span className="font-bold text-white">{result.rating ?? '-'}</span></span>
                                    <span className={`flex items-center justify-between text-xs font-mono ${result.ratingChange > 0 ? 'text-green-400' : result.ratingChange < 0 ? 'text-red-400' : 'text-slate-300'}`}><span>Δ Rating</span><span>{result.ratingChange > 0 ? '+' : ''}{result.ratingChange ?? '-'}</span></span>
                                    <span className="flex items-center justify-between text-xs text-slate-400"><span>Level</span><span className="font-bold text-white">{result.level ?? '-'}</span></span>
                                    <span className="flex items-center justify-between text-xs text-slate-400"><span>Drone HP</span><span className="font-bold text-white">{result.droneHealth ?? '-'}</span></span>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <span className="text-slate-400">No player stats available.</span>
                          )}
                        </div>
                      </div>
                      {/* Rounds Breakdown */}
                      {Array.isArray(game.rounds) && game.rounds.length > 0 && (
                        <div className="mt-6">
                          <h3 className="text-lg font-bold mb-2 text-purple-300">Rounds Breakdown</h3>
                          <table className="min-w-full text-left text-sm">
                            <thead>
                              <tr className="text-purple-400">
                                <TooltipComponent text="Round number"><th className="py-1 px-2">Round</th></TooltipComponent>
                                <TooltipComponent text="Winner of the round"><th className="py-1 px-2">Winner</th></TooltipComponent>
                                {/* Add more round stats if available */}
                              </tr>
                            </thead>
                            <tbody>
                              {game.rounds.map((round: any, j: any) => (
                                <tr key={j} className={j % 2 === 0 ? 'bg-gray-900/40' : 'bg-gray-950/40'}>
                                  <td className="py-1 px-2">{round.roundNumber ?? j + 1}</td>
                                  <td className="py-1 px-2">{round.winner ?? '-'}</td>
                                  {/* Add more round stats here if available */}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          }) : <tr><td colSpan={5} className="text-slate-400">No recent matches found.</td></tr>}
        </tbody>
      </table>
      <div className="flex justify-center items-center mt-4 gap-2">
        {/* Pagination buttons will go here */}
      </div>
    </div>
  </div>
);

export default AnalyticsMatchHistoryTab; 