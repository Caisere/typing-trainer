import { Icons } from '../../utils/icons';

type SessionModeSelectorProps = {
  onSelectMode: (mode: 'session' | 'solo' | 'competition') => void;
};

export default function SessionModeSelector({
  onSelectMode,
}: SessionModeSelectorProps) {
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Choose Your Mode
        </h1>
        <p className="text-gray-600">
          Select how you'd like to practice typing today
        </p>
      </header>

      <div className="space-y-4">
        {/* Session Mode */}
        <button
          type="button"
          onClick={() => onSelectMode('session')}
          className="w-full p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border-2 border-blue-200 hover:border-blue-400 transition-all text-left group"
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Icons.Eye className="text-white" size={24} />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-blue-800 mb-2">
                Real-time Session Mode
              </h2>
              <p className="text-blue-600 text-sm">
                Create a typing session or watch someone else type in real-time
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                  Live Spectators
                </span>
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                  Share Sessions
                </span>
              </div>
            </div>
            <div className="flex-shrink-0">
              <Icons.Add className="text-blue-400 group-hover:text-blue-600" size={24} />
            </div>
          </div>
        </button>

        {/* Solo Practice */}
        <button
          type="button"
          onClick={() => onSelectMode('solo')}
          className="w-full p-6 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg border-2 border-gray-200 hover:border-gray-400 transition-all text-left group"
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gray-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Icons.Person className="text-white" size={24} />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Solo Practice
              </h2>
              <p className="text-gray-600 text-sm">
                Practice typing on your own without real-time features
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                  Offline Mode
                </span>
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                  No Distractions
                </span>
              </div>
            </div>
            <div className="flex-shrink-0">
              <Icons.Add className="text-gray-400 group-hover:text-gray-600" size={24} />
            </div>
          </div>
        </button>

        {/* Competition Mode */}
        <button
          type="button"
          onClick={() => onSelectMode('competition')}
          className="w-full p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border-2 border-orange-200 hover:border-orange-400 transition-all text-left group"
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Icons.Flag className="text-white" size={24} />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-orange-800 mb-2">
                Competition Mode
              </h2>
              <p className="text-orange-600 text-sm">
                Race against friends in real-time typing competitions
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full">
                  Multiplayer
                </span>
                <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full">
                  Leaderboards
                </span>
                <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full">
                  Live Racing
                </span>
              </div>
            </div>
            <div className="flex-shrink-0">
              <Icons.Add className="text-orange-400 group-hover:text-orange-600" size={24} />
            </div>
          </div>
        </button>
      </div>

      {/* Info Section */}
      <div className="mt-8 bg-purple-50 p-4 rounded-lg border border-purple-200">
        <p className="text-sm text-purple-800 text-center">
          <Icons.Target size={16} className="inline mr-1" />
          Choose your practice mode and start improving your typing skills today!
        </p>
      </div>
    </div>
  );
}
