import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">日语学习助手</h1>
        <p className="text-gray-600 max-w-md mx-auto">专注于五十音图和单词默写练习，简单高效的日语学习工具</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        {/* 五十音图卡片 */}
        <motion.div 
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
        >
          <div className="h-48 bg-blue-500 flex items-center justify-center">
            <i className="fa-solid fa-language text-white text-6xl"></i>
          </div>
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2">五十音图默写</h2>
            <p className="text-gray-600 mb-4">练习平假名和片假名的读写，可自定义打印内容和格式</p>
            <Link 
              to="/hiragana-katakana"
              className="block w-full bg-blue-500 hover:bg-blue-600 text-white text-center py-2 px-4 rounded-lg transition-colors duration-300"
            >
              开始练习
            </Link>
          </div>
        </motion.div>
        
        {/* 单词默写卡片 */}
        <motion.div 
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
        >
          <div className="h-48 bg-orange-500 flex items-center justify-center">
            <i className="fa-solid fa-book text-white text-6xl"></i>
          </div>
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2">单词默写</h2>
            <p className="text-gray-600 mb-4">上传自定义单词表，生成中日互译或五十音-中文默写练习</p>
            <Link 
              to="/vocabulary"
              className="block w-full bg-orange-500 hover:bg-orange-600 text-white text-center py-2 px-4 rounded-lg transition-colors duration-300"
            >
              开始练习
            </Link>
          </div>
        </motion.div>
      </div>
      
      <footer className="mt-16 text-center text-gray-500 text-sm">
        <p>日语学习助手 &copy; {new Date().getFullYear()} - 无需注册，完全免费</p>
      </footer>
    </div>
  );
}