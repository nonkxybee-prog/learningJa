import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
  import { toast } from "sonner";
  import * as XLSX from 'xlsx';

export default function VocabularyPage() {
  // 状态管理
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string>("");
  const [parsedWords, setParsedWords] = useState<any[]>([]);
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [默写类型, set默写类型] = useState<string>("jp-to-cn");
  const [默写个数, set默写个数] = useState<number>(20);
  const [随机排序, set随机排序] = useState<boolean>(false);
  const [排版格式, set排版格式] = useState<string>("a4");
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [generatedItems, setGeneratedItems] = useState<any[]>([]);
  const [answers, setAnswers] = useState<any[]>([]);

  // 处理文件上传
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadedFile(file);
    
    // 处理文本文件（TXT）
    if (file.type === "text/plain" || file.name.endsWith(".txt")) {
      const reader = new FileReader();
      reader.onload = (event) => { // TXT文件解析
        const content = event.target?.result as string;
        setFileContent(content);
        parseTxtFile(content);
      };
      reader.readAsText(file);
    } 
    // 添加Excel文件处理
    else if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
      const reader = new FileReader();      
      reader.onload = (event) => { // Excel文件解析
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        parseExcelFile(data);
      };
      reader.readAsArrayBuffer(file);
    } else {
      toast.info("目前支持TXT文本文件和Excel文件(.xlsx, .xls)");
    }
    
    // 重置文件输入，允许重复上传同一文件
    e.target.value = "";
  };

// 解析Excel文件
// 判断文本是否包含日语（假名或汉字）
const containsJapanese = (text: string): boolean => {
  return /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(text);
};

// 判断文本是否包含中文
const containsChinese = (text: string): boolean => {
  return /[\u4E00-\u9FAF]/.test(text);
};

// 判断文本是否为罗马音（读音）
const isReading = (text: string): boolean => {
  return /^[a-zA-Z\s-]+$/.test(text) && text.length > 0;
};

// 解析Excel文件
const parseExcelFile = (data: Uint8Array) => {
  setIsParsing(true);
  
  try {
    // 使用xlsx库解析Excel文件
    const workbook = XLSX.read(data, { type: "array" });
    const firstSheetName = workbook.SheetNames[0];    
    const worksheet = workbook.Sheets[firstSheetName];
    
    // 将Excel数据转换为JSONs
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    if (jsonData.length === null) { // 使用null检查替代空数组检查更安全？
      toast.warning("Excel文件为空"); // 需要确认是否应该是jsonData.length === 0
      setIsParsing(false); // 这里设置状态后应该return
      return;
    }
    
    // 分析前几行数据以确定列类型
    const sampleRows = jsonData.slice(0, Math.min(5, jsonData.length)) as string[][];
    const columnTypes = new Array(sampleRows[0]?.length || 0).fill(null);
    
    // 分析每列内容特征
    sampleRows.forEach(row => { // 修复94%行号标记错误
      row.forEach((cell, colIndex) => {
        if (cell == null) return;
        const cellStr = cell.toString().trim();
        
        // 确定列类型优先级：日语 > A中文 > 读音
        if (columnTypes[colIndex] === null) {
          if (containsJapanese(cellStr)) {
            columnTypes[colIndex] = "japanese";
          } else if (containsChinese(cellStr)) {
            columnTypes[colIndex] = "chinese";
          } else if (isReading(cellStr)) {
            columnTypes[colIndex] = "reading";
          }
        } // 修复缺少的右括号
      }); // 修复缺少的右括号
    }); // 修复缺少的右括号
    
    // 确定各列索引
    const japaneseCol = columnTypes.indexOf("japanese");
    const chineseCol = columnTypes.indexOf("chinese");
    const readingCol = columnTypes.indexOf("reading");
    
    // 如果无法通过内容识别，使用默认列顺序 (0:日语, 1:中文, 2:读音)
    const finalJapaneseCol = japaneseCol !== -1 ? japaneseCol : 0;
    let finalChineseCol = chineseCol !== -1 ? chineseCol : 1;
    
    // 如果检测到的中文列和日语列相同，则自动调整
    if (finalChineseCol === finalJapaneseCol) {
      finalChineseCol = finalJapaneseCol === 0 ? 1 : 0;
    }
    
    // 解析单词数据
    const words = [];
    const startRow = 0; // 从第一行开始解析
    
    for (let i = startRow; i < jsonData.length; i++) {
      const row = jsonData[i] as string[];
      if (!row) continue; // 跳过空行
      
      const japanese = row[finalJapaneseCol]?.toString().trim() || "";
      const chinese = row[finalChineseCol]?.toString().trim() || "";
      const reading = readingCol !== -1 ? row[readingCol]?.toString().trim() || "" : ""; // 添加可选的读音字段
      
      if (japanese && chinese) { // 确保有有效的日语和中文才添加
        words.push({ japanese, chinese, reading });
      }
    }
    
    setParsedWords(words);
    
    if (words.length === 0) {
      toast.warning("未解析到单词，请检查文件内容是否包含日语和中文单词");
    } else {
      toast.success(`成功解析 ${words.length} 个单词`);
    }
  } catch (error) {
    console.error("Excel解析错误:", error);
    toast.error("解析Excel文件失败，请检查文件格式");
  } finally {
    setIsParsing(false);
  }
};

  // 解析TXT文件内容
  const parseTxtFile = (content: string) => {
    setIsParsing(true);
    
    // 简单解析：假设每行一个单词，中日文用空格或制表符分隔
    const lines = content.split("\n").filter(line => line.trim() !== "");
    const words = [];
    
    for (const line of lines) {
      // 尝试用多种分隔符分割
      const separators = [/\t/, /\s{2,}/, / /];
      let parts: string[] = [];
      
      for (const separator of separators) {
        if (line.split(separator).length >= 2) { // 确保能分割出至少两部分
          parts = line.split(separator).map(part => part.trim());
          break;
        }
      }
      
      if (parts.length >= 2) {
        words.push({
          japanese: parts[0],
          chinese: parts[1],
          // 简单提取可能的读音（如果有第三部分）
          reading: parts[2] || ""
        });
      }
    }
    
    setParsedWords(words);
    setIsParsing(false);
    
    if (words.length === 0) {
      toast.warning("未解析到单词，请确保文件格式正确（每行一个单词，中日文用空格或制表符分隔）");
    } else {
      toast.success(`成功解析 ${words.length} 个单词`);
    }
  };

  // 生成默写练习
  const generatePractice = () => {
    if (parsedWords.length === 0) {
      toast.warning("请先上传并解析单词表");
      return;
    }
    
    // 限制默写个数不超过实际单词数
    const actualCount = Math.min(默写个数, parsedWords.length);
    
    // 复制并可能打乱顺序
    let items = [...parsedWords];
    if (随机排序) {
      items = shuffleArray(items);
    }
    items = items.slice(0, actualCount);
    
    // 根据默写类型生成题目
    const generated = items.map((word, index) => {
      if (默写类型 === "jp-to-cn") {
        return {
          question: word.japanese,
          answer: word.chinese,
          type: "jp-to-cn"
        };
      } else if (默写类型 === "cn-to-jp") {
        return {
          question: word.chinese,
          answer: word.japanese,
          type: "cn-to-jp"
        };
      } else {
        // 五十音字母-中文
        return {
          question: word.japanese,
          answer: word.chinese,
          type: "jp-char-to-cn"
        };
      }
    });
    
    setGeneratedItems(generated);
    setAnswers(generated); // 答案与题目相同，实际应用中可能需要不同处理
    setShowPreview(true);
  };

  // 随机打乱数组
  const shuffleArray = (array: any[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // 打印功能
const handlePrint = () => {
  // 添加延迟确保打印样式生效
  setTimeout(() => {
    window.print();
  }, 100);
};

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */} {/* 缺少导航组件？ */}
       <header className="bg-white shadow-sm py-4 px-6 no-print">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-blue-500 hover:text-blue-600 flex items-center">
            <i className="fa-solid fa-arrow-left mr-2"></i>
            <span>返回首页</span>
          </Link>
          <h1 className="text-xl font-bold text-gray-800">单词默写练习</h1>
          <div></div> {/* 占位元素，保持标题居中 */}
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 sm:p-6">
        {!showPreview ? (
          // 单词上传和选项设置
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* 文件上传区域 */}
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">上传单词表</h2>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors duration-200 cursor-pointer">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="space-y-2">
                      <i className="fa-solid fa-cloud-upload text-4xl text-gray-400"></i>
                      <p className="text-gray-600">点击或拖拽文件到此处上传</p>
                       <p className="text-gray-400 text-sm">支持Excel(.xlsx, .xls)和TXT文本文件</p>
                       <p className="text-gray-500 text-xs mt-2">Excel格式要求：第一列日语，第二列中文，可选第三列读音</p>
                       <input
                        id="file-upload"
                        type="file"
                        onChange={handleFileUpload}
                        className="hidden"
                       accept=".txt,.text,.xlsx,.xls"
                      />
                    </div>
                  </label>
                </div>
                
                {uploadedFile && (
                  <div className="mt-4 bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                    <div className="flex items-center">
                      <i className="fa-solid fa-file-text-o text-blue-500 mr-3"></i>
                      <div>
                        <p className="font-medium text-gray-800 truncate max-w-md">{uploadedFile.name}</p>
                        <p className="text-sm text-gray-500">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        setUploadedFile(null);
                        setFileContent("");
                        setParsedWords([]);
                      }}
                      className="text-red-500 hover:text-red-600"
                    >
                      <i className="fa-solid fa-times"></i>
                    </button>
                  </div>
                )}
                
                {isParsing && (
                  <div className="mt-4 flex items-center justify-center text-gray-600">
                    <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                    <span>正在解析文件...</span>
                  </div>
                )}
                
                {parsedWords.length > 0 && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center text-green-700">
                      <i className="fa-solid fa-check-circle mr-2"></i>
                      <p>成功解析 {parsedWords.length} 个单词</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* 默写选项 */}
              {parsedWords.length > 0 && (
                <div className="bg-white rounded-xl shadow p-6 space-y-4"> {/* 缺少form-select样式定义 */}
                  <h2 className="text-xl font-bold text-gray-800 mb-4">默写选项</h2>
                  
                  <div>
                    <label className="form-label">默写类型</label>
                    <select 
                      className="form-select"
                      value={默写类型}
                      onChange={(e) => set默写类型(e.target.value)}
                    >
                      <option value="jp-to-cn">日语 → 中文</option>
                      <option value="cn-to-jp">中文 → 日语</option>
                      <option value="jp-reading-to-cn">日语读音 → 中文</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="form-label">默写个数</label>
                    <input 
                      type="number" 
                      min="5" 
                      max={Math.max(5, parsedWords.length)}
                      className="form-select"
                      value={默写个数}
                      onChange={(e) => set默写个数(Math.min(Number(e.target.value), parsedWords.length))}
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="vocab-random"
                      className="mr-2"
                      checked={随机排序}
                      onChange={(e) => set随机排序(e.target.checked)}
                    />
                    <label htmlFor="vocab-random" className="text-gray-700">随机排序</label>
                  </div>
                  
                  <div>
                    <label className="form-label">排版格式</label>
                    <select 
                      className="form-select"
                      value={排版格式}
                      onChange={(e) => set排版格式(e.target.value)}
                    >
                       <option value="a4">A4尺寸</option>
                      <option value="3inch" selected>3寸宽度</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
            
            {/* 预览和生成按钮 */}
            {parsedWords.length > 0 && (
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow p-6 sticky top-4">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">单词预览</h2>
                  
                  <div className="h-64 overflow-y-auto mb-4 border border-gray-200 rounded-lg p-3">
                    {parsedWords.slice(0, 5).map((word, index) => (
                      <div key={index} className="py-1 border-b border-gray-100 last:border-0">
                        <p className="font-medium text-gray-800">{word.japanese}</p>
                        <p className="text-sm text-gray-600">{word.chinese}</p>
                      </div>
                    ))}
                    
                    {parsedWords.length > 5 && (
                      <div className="text-center text-gray-400 text-sm py-2">
                        还有 {parsedWords.length - 5} 个单词...
                      </div>
                    )}
                  </div>
                  
                  <motion.button
                    onClick={generatePractice}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg transition-colors duration-300 font-medium"
                  >
                    生成默写练习
                  </motion.button>
                </div>
              </div>
            )}
          </div>
        ) : (
          // 预览和打印区域
           <div className="space-y-6">
            <div className="bg-white rounded-xl shadow p-4 flex justify-between items-center no-print">
              <button 
                onClick={() => setShowPreview(false)}
                className="text-blue-500 hover:text-blue-600 flex items-center"
              >
                <i className="fa-solid fa-arrow-left mr-1"></i>
                <span>返回设置</span>
              </button>
              
              <div className="flex space-x-3">
                <button 
                  onClick={handlePrint}
                  className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors duration-300 flex items-center"
                >
                  <i className="fa-solid fa-print mr-2"></i>
                  <span>打印</span>
                </button>
              </div>
            </div>
            
            {/* 打印预览 */}
               <div className="no-print bg-white rounded-xl shadow p-6 overflow-hidden">
                 <div className={`print-preview ${排版格式 === 'a4' ? 'print-container-a4' : 'print-container-3inch'}`}>
                   <div className="p-4">
                      {/* 移除红框内的标题内容 */}
                     
                      <div className={`${排版格式 === 'a4' ? 'a4-grid' : 'three-inch-grid'}`}> {/* 缺少CSS类定义 */}
                       {generatedItems.map((item, index) => ( // 缺少key属性
                         <div key={index} className="默写-item flex items-center"> {/* 添加key属性 */}
                           <span className="text-xs font-medium text-gray-700 w-6">{index + 1}.</span>
                           <span className="text-xs text-gray-800 mr-2">{item.question}</span>
                           <div className="flex-1 border-b-2 border-gray-300 h-4"></div>
                         </div>
                       ))}
                     </div>
                   </div>
                 </div>
               </div>
          </div>
        )}

        {/* 打印专用内容 - 不会在屏幕上显示，仅用于打印 */}
        <div className={`print-only hidden ${排版格式 === 'a4' ? 'print-container-a4' : 'print-container-3inch'}`}>
           {/* 移除红框内的标题内容 */}
          
           <div className={`${排版格式 === 'a4' ? 'a4-grid' : 'three-inch-grid'}`}> {/* 缺少CSS类定义 */}
            {generatedItems.map((item, index) => ( // 添加key属性
              <div key={index} className="默写-item flex items-center"> {/* 添加key属性 */}
                <span className="text-xs font-medium text-gray-700 w-6">{index + 1}.</span>
                <span className="text-xs text-gray-800 mr-2">{item.question}</span>
                <div className="flex-1 border-b-2 border-gray-300 h-4"></div>
              </div>
            ))}
          </div>
          
          {/* 答案区域 */}
          <div className="答案区域"> {/* 中文类名可能不符合CSS命名规范 */}
            <div className="text-center text-lg font-bold mb-4">答案</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {answers.map((item, index) => ( // 添加key属性
                <div key={index} className="text-sm"> {/* 添加key属性 */}
                  <span className="font-medium">{index + 1}.</span>
                  <span className="ml-1">{item.question} → {item.answer}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}