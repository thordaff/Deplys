'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ResultPage() {
  const [result, setResult] = useState({
    new_depression_level: 'Tidak diketahui',
    new_score: 'Tidak diketahui',
    similarity_level: 'Tidak diketahui',
    similarity_range: 'Tidak diketahui'
  });

  const [summary, setSummary] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Retrieve the result from local storage
    const storedResult = localStorage.getItem('result');
    if (storedResult) {
      const parsedResult = JSON.parse(storedResult);
      setResult(parsedResult);
      generateSummary(parsedResult);
    } else {
      // Redirect to the test page if no result is found
      router.push('/take-a-test');
    }
  }, [router]);

  const generateSummary = (result: any) => {
    let summaryText = '';
    const score = parseInt(result.new_score);
  
    // Example logic for generating detailed summary
    if (score >= 0 && score <= 4) {
      summaryText = `
        Hasil tes menunjukkan bahwa Anda tidak mengalami depresi. 
        Ini berarti Anda tidak menghadapi tantangan emosional yang signifikan saat ini.
        Jika Anda merasa khawatir di masa depan, pertimbangkan untuk berbicara dengan seorang profesional kesehatan mental 
        untuk strategi pengelolaan yang dapat membantu Anda.
      `;
    } else if (score <= 9) {
      summaryText = `
        Hasil tes menunjukkan bahwa Anda mungkin mengalami depresi ringan. 
        Ini mungkin berarti Anda menghadapi tantangan emosional, tetapi tidak pada tingkat yang serius.
        Jika Anda merasa khawatir, pertimbangkan untuk berbicara dengan seorang profesional kesehatan mental 
        untuk strategi pengelolaan yang dapat membantu Anda.
      `;
    } else if (score <= 19) {
      summaryText = `
        Hasil tes menunjukkan bahwa Anda mungkin mengalami depresi sedang. 
        Anda mungkin mengalami kesulitan dengan perasaan dan motivasi Anda. 
        Mencari dukungan dari seorang profesional bisa membantu Anda mengatasi tantangan ini 
        dan menemukan cara untuk merasa lebih baik.
      `;
    } else {
      summaryText = `
        Hasil tes menunjukkan bahwa Anda mengalami depresi berat. 
        Ini adalah kondisi serius yang memerlukan perhatian segera dari seorang profesional kesehatan mental. 
        Pertimbangkan untuk mencari bantuan segera untuk mendapatkan dukungan yang Anda butuhkan.
      `;
    }
    
    setSummary(summaryText);
  };  

  const handleRetakeTest = () => {
    // Clear the result from local storage
    localStorage.removeItem('result');
    // Redirect to the test page
    router.push('/take-a-test');
  };

  return (
    <div className="py-2 px-5 space-y-5 mt-[3em]">
      <div className="result card w-full border-2 rounded-xl py-5">
        <div className="flex flex-col items-center">
          <div className="text-start">
            <div className="text-description">
              <p className="text-xs">Hasil test kamu</p>
            </div>
            <div className="result">
              <h1 className="font-bold text-2xl tracking-widest">{result.new_depression_level}</h1>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between space-x-5">
        <div className="w-full border-2 rounded-md card-1 py-5">
          <div className="flex flex-col items-center">
            <div className="text-center">
              <div className="text-description">
                <p className="text-xs">Hasil PHQ-9</p>
              </div>
              <div className="result">
                <h1 className="font-bold">{result.new_score}</h1>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full border-2 rounded-md card-2 py-5">
          <div className="flex flex-col items-center">
            <div className="text-start">
              <div className="text-description">
                <p className="text-xs">Similarity Level</p>
              </div>
              <div className="result">
                <h1 className="font-bold">{result.similarity_level}</h1>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full border-2 rounded-md card-3 py-5">
          <div className="flex flex-col items-center">
            <div className="text-start">
              <div className="text-description">
                <p className="text-xs">Similarity Range</p>
              </div>
              <div className="result">
                <h1 className="font-bold">{result.similarity_range}</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Display the detailed summary */}
      <div className="summary mt-5 p-4 border-2 p-5 rounded-xl">
        <h2 className="text-xl font-bold mb-2">Analisis dan Ringkasan</h2>
        <p>{summary}</p>
      </div>
      <button
        onClick={handleRetakeTest}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
      >
        Ambil Test Ulang
      </button>
    </div>
  );
}
