import React, { useState } from 'react';
import { ArrowLeft, ThumbsUp, ThumbsDown, Eye, Star, Users, Calendar, Filter } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface CommunitySubmission {
  id: string;
  name: string;
  author: string;
  playstyle: string;
  difficulty: number;
  submittedAt: string;
  votes: {
    upvotes: number;
    downvotes: number;
    userVote?: 'up' | 'down' | null;
  };
  status: 'pending' | 'approved' | 'rejected';
  views: number;
  champions: string[];
}

interface CommunitySubmissionsProps {
  onBack: () => void;
}

const CommunitySubmissions: React.FC<CommunitySubmissionsProps> = ({ onBack }) => {
  const { user } = useAuth();
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'votes' | 'views'>('newest');

  // Mock data - in real app this would come from your backend
  const [submissions, setSubmissions] = useState<CommunitySubmission[]>([
    {
      id: '1',
      name: 'Frost Vanguard Reroll',
      author: 'TFTMaster123',
      playstyle: 'SLOW ROLL',
      difficulty: 3,
      submittedAt: '2024-01-15',
      votes: { upvotes: 24, downvotes: 3, userVote: null },
      status: 'pending',
      views: 156,
      champions: ['Elko', 'Braum', 'Sejuani', 'Ashe', 'Thresh']
    },
    {
      id: '2',
      name: 'Sugarcraft Mage Flex',
      author: 'CompBuilder99',
      playstyle: 'FAST 9',
      difficulty: 4,
      submittedAt: '2024-01-14',
      votes: { upvotes: 18, downvotes: 7, userVote: 'up' },
      status: 'approved',
      views: 203,
      champions: ['Yuumi', 'Annie', 'Ziggs', 'Xerath', 'Nami']
    },
    {
      id: '3',
      name: 'Shapeshifter Carry',
      author: 'MetaBreaker',
      playstyle: 'REROLL',
      difficulty: 2,
      submittedAt: '2024-01-13',
      votes: { upvotes: 31, downvotes: 2, userVote: null },
      status: 'pending',
      views: 89,
      champions: ['Neeko', 'Nadalee', 'Shyvana', 'Swain']
    }
  ]);

  const handleVote = (submissionId: string, voteType: 'up' | 'down') => {
    setSubmissions(prev => prev.map(sub => {
      if (sub.id === submissionId) {
        const currentVote = sub.votes.userVote;
        let newUpvotes = sub.votes.upvotes;
        let newDownvotes = sub.votes.downvotes;
        let newUserVote: 'up' | 'down' | null = voteType;

        // Remove previous vote if exists
        if (currentVote === 'up') newUpvotes--;
        if (currentVote === 'down') newDownvotes--;

        // Add new vote or remove if same
        if (currentVote === voteType) {
          newUserVote = null;
        } else {
          if (voteType === 'up') newUpvotes++;
          if (voteType === 'down') newDownvotes++;
        }

        return {
          ...sub,
          votes: {
            upvotes: newUpvotes,
            downvotes: newDownvotes,
            userVote: newUserVote
          }
        };
      }
      return sub;
    }));
  };

  const handleAdminAction = (submissionId: string, action: 'approve' | 'reject') => {
    setSubmissions(prev => prev.map(sub => 
      sub.id === submissionId 
        ? { ...sub, status: action === 'approve' ? 'approved' : 'rejected' }
        : sub
    ));
  };

  const filteredSubmissions = submissions
    .filter(sub => filter === 'all' || sub.status === filter)
    .sort((a, b) => {
      switch (sortBy) {
        case 'votes':
          return (b.votes.upvotes - b.votes.downvotes) - (a.votes.upvotes - a.votes.downvotes);
        case 'views':
          return b.views - a.views;
        case 'newest':
        default:
          return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
      }
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'rejected': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'pending': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-3 text-gray-400 hover:text-white transition-all duration-300 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-xl border border-gray-700"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Comps
          </button>
          <h1 className="text-white text-3xl font-bold">Community Submissions</h1>
          {user?.isAdmin && (
            <span className="bg-purple-600 text-white px-3 py-1 rounded-lg text-sm font-medium">
              ADMIN
            </span>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="newest">Newest First</option>
            <option value="votes">Most Voted</option>
            <option value="views">Most Viewed</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-purple-400" />
            <span className="text-gray-300 font-medium">Total Submissions</span>
          </div>
          <span className="text-white text-2xl font-bold">{submissions.length}</span>
        </div>

        <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-5 h-5 text-yellow-400" />
            <span className="text-gray-300 font-medium">Pending Review</span>
          </div>
          <span className="text-white text-2xl font-bold">
            {submissions.filter(s => s.status === 'pending').length}
          </span>
        </div>

        <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <ThumbsUp className="w-5 h-5 text-green-400" />
            <span className="text-gray-300 font-medium">Approved</span>
          </div>
          <span className="text-white text-2xl font-bold">
            {submissions.filter(s => s.status === 'approved').length}
          </span>
        </div>

        <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <Eye className="w-5 h-5 text-blue-400" />
            <span className="text-gray-300 font-medium">Total Views</span>
          </div>
          <span className="text-white text-2xl font-bold">
            {submissions.reduce((sum, s) => sum + s.views, 0)}
          </span>
        </div>
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        {filteredSubmissions.map(submission => (
          <div key={submission.id} className="bg-gray-900 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-3">
                  <h3 className="text-white text-xl font-semibold">{submission.name}</h3>
                  <span className={`px-3 py-1 rounded-lg text-sm font-medium border ${getStatusColor(submission.status)}`}>
                    {submission.status.toUpperCase()}
                  </span>
                  <span className="text-gray-400 text-sm">by {submission.author}</span>
                </div>

                <div className="flex items-center gap-6 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-300 text-sm">Playstyle:</span>
                    <span className="text-purple-400 font-medium">{submission.playstyle}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-gray-300 text-sm">Difficulty:</span>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star
                          key={idx}
                          className={`w-4 h-4 ${idx < submission.difficulty ? 'text-yellow-400 fill-current' : 'text-gray-600'}`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-400 text-sm">{submission.views} views</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-400 text-sm">{submission.submittedAt}</span>
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap mb-4">
                  {submission.champions.map((champion, idx) => (
                    <span key={idx} className="bg-gray-800 text-gray-300 px-3 py-1 rounded-lg text-sm">
                      {champion}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Voting */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleVote(submission.id, 'up')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                      submission.votes.userVote === 'up'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span className="text-sm font-medium">{submission.votes.upvotes}</span>
                  </button>
                  
                  <button
                    onClick={() => handleVote(submission.id, 'down')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                      submission.votes.userVote === 'down'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <ThumbsDown className="w-4 h-4" />
                    <span className="text-sm font-medium">{submission.votes.downvotes}</span>
                  </button>
                </div>

                {/* Admin Actions */}
                {user?.isAdmin && submission.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAdminAction(submission.id, 'approve')}
                      className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleAdminAction(submission.id, 'reject')}
                      className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                )}

                <button className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredSubmissions.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">No submissions found</div>
          <div className="text-gray-500 text-sm">Try adjusting your filters</div>
        </div>
      )}
    </div>
  );
};

export default CommunitySubmissions;