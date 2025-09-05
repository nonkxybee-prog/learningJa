import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import HiraganaKatakanaPage from "@/pages/HiraganaKatakanaPage";
import VocabularyPage from "@/pages/VocabularyPage";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hiragana-katakana" element={<HiraganaKatakanaPage />} />
        <Route path="/vocabulary" element={<VocabularyPage />} />
      </Routes>
    </div>
  );
}
