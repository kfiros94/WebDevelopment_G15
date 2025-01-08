'use client';

const WordTable = ({ words, onDelete, onPlayAudio }) => {
  return (
    <div className="mt-8 bg-slate-800 rounded-lg overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-600">
            <th className="p-4 text-left">English</th>
            <th className="p-4 text-left">Hebrew</th>
            <th className="p-4 text-left">Pronunciation</th>
            <th className="p-4 text-left">Audio</th>
            <th className="p-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {words.map((word, index) => (
            <tr key={index} className="border-b border-slate-600">
              <td className="p-4">{word.english}</td>
              <td className="p-4">{word.hebrew}</td>
              {/* Ensure pronunciation displays transliteration or fallback */}
              <td className="p-4">
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
              <td colSpan="6" className="text-center text-gray-400 py-4">
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
