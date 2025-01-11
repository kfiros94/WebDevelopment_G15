'use client';

const WordTable = ({ words, onDelete, onPlayAudio }) => {
  return (
    <div className="mt-8 bg-slate-800 rounded-lg overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-600">
            <th className="p-4 text-left text-yellow-400">English</th>
            <th className="p-4 text-left text-yellow-400">Hebrew</th>
            <th className="p-4 text-left text-yellow-400">Pronunciation</th>
            <th className="p-4 text-left text-yellow-400">Audio</th>
            <th className="p-4 text-left text-yellow-400">Actions</th>
          </tr>
        </thead>
        <tbody>
          {words.map((word, index) => (
            <tr key={index} className="border-b border-slate-600">
              <td className="p-4 text-white">{word.english}</td>
              <td className="p-4 text-white">{word.hebrew}</td>
              <td className="p-4 text-white">
                {word.pronunciation || 'Pronunciation not available'}
              </td>
              <td className="p-4">
                <button
                  onClick={() => onPlayAudio(word.hebrew)}
                  className="text-blue-400 hover:text-blue-300"
                >
                  Audio
                </button>
              </td>
              <td className="p-4">
                <button
                  onClick={() => onDelete(index)}
                  className="text-red-400 hover:text-red-300"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {words.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center text-gray-400 py-4">
                No words added yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default WordTable;
