import { TrashIcon, SpeakerWaveIcon } from "@heroicons/react/24/outline"; // Importing icons
import { motion, AnimatePresence } from "framer-motion"; // For animations

const WordTable = ({ words, onDelete, onPlayAudio }) => {
  return (
    <div className="mt-8 bg-slate-800 rounded-lg overflow-x-auto shadow-lg">
      <table className="w-full border-collapse">
        <thead className="bg-slate-700">
          <tr className="border-b border-slate-600">
            <th className="p-4 text-left text-yellow-400 text-lg">English</th>
            <th className="p-4 text-left text-yellow-400 text-lg">Hebrew</th>
            <th className="p-4 text-left text-yellow-400 text-lg">Pronunciation</th>
            <th className="p-4 text-left text-yellow-400 text-lg">Audio</th>
            <th className="p-4 text-left text-yellow-400 text-lg">Actions</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {words.map((word, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="border-b border-slate-600 transition hover:bg-slate-700"
              >
                <td className="p-4 text-white text-lg">{word.english}</td>
                <td className="p-4 text-white text-lg">{word.hebrew}</td>
                <td className="p-4 text-white text-lg">{word.pronunciation || "N/A"}</td>
                <td className="p-4">
                  <button
                    onClick={() => onPlayAudio(word.hebrew)}
                    className="flex items-center gap-1 text-blue-400 hover:text-blue-300"
                  >
                    <SpeakerWaveIcon className="w-5 h-5" />
                    <span className="hidden sm:inline">Play</span>
                  </button>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => onDelete(index)}
                    className="flex items-center gap-1 text-red-400 hover:text-red-300"
                  >
                    <TrashIcon className="w-5 h-5" />
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
          {words.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center py-6 text-gray-400">
                <div className="flex flex-col items-center">
                  <span className="text-5xl">📚</span>
                  <p className="mt-2">No words or sentences saved yet.</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default WordTable;
