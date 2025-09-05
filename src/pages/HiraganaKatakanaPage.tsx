import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { hiraganaData, rowOptions, 默写类型选项, formatOptions } from "@/data/hiraganaData";

export default function HiraganaKatakanaPage() {
  // 状态管理
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [默写类型, set默写类型] = useState<string>("romaji-to-hiragana");
  const [默写个数, set默写个数] = useState<number>(20);
  const [随机排序, set随机排序] = useState<boolean>(false);
  const [排版格式, set排版格式] = useState<string>("a4");
  const [generatedItems, setGeneratedItems] = useState<any[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [answers, setAnswers] = useState<any[]>([]);

  // 页面加载时默认选择所有行
  useEffect(() => {
    setSelectedRows(rowOptions.map(row => row.value));
  }, []);

  // 计算总项目数量
  useEffect(() => {
    let count = 0;
    selectedRows.forEach(rowKey => {
      const row = hiraganaData.find(r => r.rowRomaji === rowKey);
      if (row) {
        count += row.characters.length;
      }
    });
    setTotalItems(count);
    // 确保默写个数不超过总项目数量
    if (默写个数 > count) {
      set默写个数(count);
    }
  }, [selectedRows, 默写类型]);

  // 生成默写内容
  const generatePractice = () => {
    if (selectedRows.length === 0) {
      alert("请至少选择一行五十音图");
      return;
    }

    // 收集选中行的所有字符
    let allItems: any[] = [];
    selectedRows.forEach(rowKey => {
      const row = hiraganaData.find(r => r.rowRomaji === rowKey);
      if (row) {
        // 根据默写类型生成不同的题目格式
        row.characters.forEach(char => {
          switch (默写类型) {
            case "romaji-to-hiragana":
              allItems.push({
                question: char.romaji,
                answer: char.hiragana,
                type: "romaji-to-hiragana"
              });
              break;
            case "romaji-to-katakana":
              allItems.push({
                question: char.romaji,
                answer: char.katakana,
                type: "romaji-to-katakana"
              });
              break;
            case "hiragana-to-romaji":
              allItems.push({
                question: char.hiragana,
                answer: char.romaji,
                type: "hiragana-to-romaji"
              });
              break;
            case "katakana-to-romaji":
              allItems.push({
                question: char.katakana,
                answer: char.romaji,
                type: "katakana-to-romaji"
              });
              break;
            case "mixed":
              // 混合类型，随机选择一种类型
              const types = ["romaji-to-hiragana", "romaji-to-katakana", "hiragana-to-romaji", "katakana-to-romaji"];
              const randomType = types[Math.floor(Math.random() * types.length)];
              
              switch (randomType) {
                case "romaji-to-hiragana":
                  allItems.push({
                    question: char.romaji,
                    answer: char.hiragana,
                    type: randomType
                  });
                  break;
                case "romaji-to-katakana":
                  allItems.push({
                    question: char.romaji,
                    answer: char.katakana,
                    type: randomType
                  });
                  break;
                case "hiragana-to-romaji":
                  allItems.push({
                    question: char.hiragana,
                    answer: char.romaji,
                    type: randomType
                  });
                  break;
                case "katakana-to-romaji":
                  allItems.push({
                    question: char.katakana,
                    answer: char.romaji,
                    type: randomType
                  });
                  break;
              }
              break;
          }
        });
      }
    });

     // 限制默写个数不超过实际可用数量
    const actualCount = Math.min(默写个数, allItems.length);
    let itemsToUse = allItems.slice(0, actualCount);
    
    // 如果需要随机排序
    if (随机排序) {
      itemsToUse = shuffleArray(itemsToUse);
    }
    
    // 保存答案用于后续显示
    setAnswers(itemsToUse.map(item => ({
      question: item.question,
      answer: item.answer,
      type: item.type
    })));
    
    // 设置生成的项目
    setGeneratedItems(itemsToUse);
    setShowPreview(true);
  };

  // 随机打乱数组顺序
  const shuffleArray = (array: any[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]]; // 交换元素
    }
    return newArray;
  };

  // 添加/移除选中的行
  const toggleRowSelection = (rowKey: string) => {
    setSelectedRows(prev => 
      prev.includes(rowKey)
        ? prev.filter(key => key !== rowKey)
        : [...prev, rowKey]
    );
  };

  // 打印功能
  const handlePrint = () => {
    // 确保打印内容已生成
    if (generatedItems.length === 0) {
      alert("请先生成默写练习内容");
      return;
    }
    
    // 触发打印对话框
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <header className="bg-white shadow-sm py-4 px-6 no-print">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-blue-500 hover:text-blue-600 flex items-center">
            <i className="fa-solid fa-arrow-left mr-2"></i>
            <span>返回首页</span>
          </Link>
          <h1 className="text-xl font-bold text-gray-800">五十音图默写练习</h1>
          <div></div> {/*占位元素،保持标题居中 */}
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 sm:p-6">
        {!showPreview ? ( 
          // 选项表单
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">选择五十音图行</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                  {rowOptions.map(row => (
                    <button
                      key={row.value}
                      onClick={() => toggleRowSelection(row.value)}
                      className={`py-2 px-3 rounded-lg text-sm transition-colors duration-200 ${
                        selectedRows.includes(row.value)
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {row.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow p-6 space-y-4">
                <h2 className="text-xl font-bold text-gray-800 mb-4">默写选项</h2>
                
                <div>
                  <label className="form-label">默写类型</label>
                  <select 
                    className="form-select"
                    value={默写类型}
                    onChange={(e) => set默写类型(e.target.value)}
                  >
                    {默写类型选项.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="form-label">默写个数</label>
                     <input 
                      type="number" 
                      min="5" 
                       max={totalItems}
                      className="form-input"
                      value={默写个数}
                       onChange={(e) => set默写个数(Math.min(Number(e.target.value), totalItems))}
                    />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="randomOrder"
                    className="mr-2"
                    checked={随机排序}
                    onChange={(e) => set随机排序(e.target.checked)}
                  />
                  <label htmlFor="randomOrder" className="text-gray-700">随机排序</label>
                </div>
                
                <div>
                  <label className="form-label">排版格式</label>
                  <select 
                    className="form-select"
                    value={排版格式}
                    onChange={(e) => set排版格式(e.target.value)}
                  >
                    {formatOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 预览卡片 */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow p-6 sticky top-4">
                <h2 className="text-xl font-bold text-gray-800 mb-4">预览</h2>
                <div className={`p-4 border-2 border-dashed ${排版格式 === 'a4' ? 'w-full h-64' : 'w-32 h-64 mx-auto'}`}>
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <i className="fa-solid fa-file-pdf-o text-4xl mb-2"></i>
                    <p className="text-center">设置完成后，点击下方按钮生成预览</p>
                  </div>
                </div>
                
                <motion.button
                  onClick={generatePractice}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg transition-colors duration-300 font-medium"
                >
                  生成默写练习
                </motion.button>
              </div>
            </div>
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
                   <h3 className="text-center text-lg font-bold mb-4">五十音图默写练习</h3>
                   <p className="text-sm text-gray-500 text-center mb-6">
                     {默写类型选项.find(opt => opt.value === 默写类型)?.label} · {随机排序 ? '随机顺序' : '正常顺序'}
                   </p>
                   
                    <div className={`${排版格式 === 'a4' ? 'a4-grid' : 'three-inch-grid'}`}>
                     {generatedItems.map((item, index) => (
                       <div key={index} className="默写-item flex items-center">
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
        <div className={`print-only ${排版格式 === 'a4' ? 'print-container-a4' : 'print-container-3inch'}`}>
          <div className="text-center text-lg font-bold mb-4">五十音图默写练习</div>
          <p className="text-sm text-gray-500 text-center mb-6">
            {默写类型选项.find(opt => opt.value === 默写类型)?.label} · {随机排序 ? '随机顺序' : '正常顺序'}
          </p>
          
          <div className={`${排版格式 === 'a4' ? 'a4-grid' : 'three-inch-grid'}`}>
           {generatedItems.map((item, index) => (
             <div key={index} className="默写-item flex items-center">
               <span className="text-xs font-medium text-gray-700 w-6">{index + 1}.</span>
               <span className="text-xs text-gray-800 mr-2">{item.question}</span>
               <div className="flex-1 border-b-2 border-gray-300 h-4"></div>
             </div>
           ))}
          </div>
          
          {/* 答案区域 */}
          <div className="答案区域">
            <div className="text-center text-lg font-bold mb-4">答案</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {answers.map((item, index) => (
                <div key={index} className="text-sm">
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
