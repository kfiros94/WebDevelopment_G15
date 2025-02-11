import { TrashIcon, SpeakerWaveIcon } from "@heroicons/react/24/outline" // Icons for delete & audio
import { motion, AnimatePresence } from "framer-motion" // For row animations
import { Box, Typography, Paper } from "@mui/material"

/**
 * WordTable
 *
 * Renders a table of words (or sentences) with columns:
 *  - English
 *  - Hebrew
 *  - Pronunciation
 *  - Audio button
 *  - Actions (delete)
 *
 * Uses Framer Motion to animate row entries on mount/unmount.
 * If the table is empty, shows a simple "No words saved" message.
 */
const WordTable = ({ words, onDelete, onPlayAudio }) => {
    return (
        <div className="mt-8 bg-slate-800 rounded-lg shadow-lg p-4">
            <table className="w-full border-collapse">
                <thead className="bg-slate-800">
                    <tr className="border-b border-slate-600 text-yellow-600">
                        {/* Table Headers */}
                        <th className="p-4 text-left text-lg">English</th>
                        <th className="p-4 text-left text-lg">Hebrew</th>
                        <th className="p-4 text-left text-lg">Pronunciation</th>
                        <th className="p-4 text-left text-lg">Audio</th>
                        <th className="p-4 text-left text-lg">Actions</th>
                    </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                    {/* AnimatePresence allows Framer Motion to handle enter/exit animations */}
                    <AnimatePresence>
                        {words.map((word, index) => (
                            <motion.tr
                                key={index}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                className={`border-b border-slate-600 ${index % 2 === 0 ? "bg-slate-700" : "bg-slate-800"} hover:none`}
                            >
                                {/* English Column */}
                                <td className="p-4 text-white text-lg">{word.english}</td>

                                {/* Hebrew Column */}
                                <td className="p-4 text-white text-lg">{word.hebrew}</td>

                                {/* Pronunciation (fallback to N/A) */}
                                <td className="p-4 text-white text-lg">{word.pronunciation || "N/A"}</td>

                                {/* Play Audio Button */}
                                <td className="p-4">
                                    <button
                                        onClick={() => onPlayAudio(word.hebrew)}
                                        className="flex items-center gap-1 text-blue-400 hover:text-blue-300"
                                    >
                                        <SpeakerWaveIcon className="w-5 h-5" />
                                        <span className="hidden sm:inline">Play</span>
                                    </button>
                                </td>

                                {/* Delete Button */}
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

                    {/* If no words, display a fallback message */}
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
    )
}

export default WordTable
