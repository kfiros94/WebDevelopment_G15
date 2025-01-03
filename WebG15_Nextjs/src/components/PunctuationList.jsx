const PunctuationList = ({ punctuations }) => {
  return (
    <div className="bg-gray-100 dark:bg-slate-700 rounded-xl p-5 shadow-lg">
      <h3 className="text-lg font-bold mb-4 text-center text-gray-800 dark:text-white">
        Punctuated Forms
      </h3>
      {punctuations && punctuations.length > 0 ? (
        <ul className="space-y-3">
          {punctuations.map((p, index) => (
            <li
              key={index}
              className="p-3 bg-white dark:bg-slate-600 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-all duration-200"
            >
              {p.word} - {p.meaning}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 dark:text-gray-300 text-center">
          Click on a word to see its punctuated forms.
        </p>
      )}
    </div>
  );
};

export default PunctuationList;