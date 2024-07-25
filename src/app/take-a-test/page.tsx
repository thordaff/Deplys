'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter dari next/navigation

const Test = () => {
  const [responses, setResponses] = useState<number[]>(Array(9).fill(-1)); // -1 berarti tidak ada jawaban
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const router = useRouter(); // Gunakan useRouter dari next/navigation

  const questions = [
    'Sedikit minat atau kesenangan dalam melakukan sesuatu?',
    'Merasa sedih, murung, atau putus asa?',
    'Sulit tidur, atau tidur terlalu banyak?',
    'Merasa lelah atau kurang energi?',
    'Kurang nafsu makan atau makan terlalu banyak?',
    'Merasa buruk tentang diri sendiri - atau berpikir bahwa Anda adalah seorang yang gagal atau telah mengecewakan diri sendiri atau keluarga Anda?',
    'Kesulitan berkonsentrasi pada hal-hal, seperti membaca koran atau menonton televisi?',
    'Bergerak atau berbicara sangat lambat sehingga orang lain mungkin memperhatikan? Atau sebaliknya - sangat gelisah atau tidak bisa diam?',
    'Berpikiran bahwa Anda lebih baik mati atau menyakiti diri sendiri dengan cara tertentu?'
  ];

  const handleChange = (value: string) => {
    const newResponses = [...responses];
    newResponses[currentQuestionIndex] = parseInt(value);
    setResponses(newResponses);
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch('https://flaskapp-production-5ced.up.railway.app/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ responses }),
      });

      if (!res.ok) {
        throw new Error('Failed to analyze responses');
      }

      const result = await res.json();

      // Save result to localStorage
      localStorage.setItem('result', JSON.stringify(result));

      // Redirect to the result page
      router.push('/result');
      
      setError(null);
    } catch (error) {
      console.error('Error:', error);
      setError('Error occurred during analysis');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen overflow-x-hidden">
      <form>
        <div className="flex flex-col items-center w-full max-w-lg">
          <label className="text-2xl font-bold text-center mb-5 lg:w-[25em] w-[20em]">
            {questions[currentQuestionIndex]}
          </label>
          <div className="flex flex-col items-start justify-center space-y-4 mb-10 pb-3 ml-5 pl-3">
            {[0, 1, 2, 3].map((value) => (
              <div key={value}>
                <input
                  type="radio"
                  id={`${currentQuestionIndex}-${value}`}
                  name={`question-${currentQuestionIndex}`}
                  value={value}
                  checked={responses[currentQuestionIndex] === value}
                  onChange={() => handleChange(value.toString())}
                />
                <label htmlFor={`${currentQuestionIndex}-${value}`} className="ml-2">
                  {value === 0 && 'Tidak sama sekali'}
                  {value === 1 && 'Beberapa hari'}
                  {value === 2 && 'Lebih dari setengah hari'}
                  {value === 3 && 'Hampir setiap hari'}
                </label>
              </div>
            ))}
          </div>

          <div className="flex space-x-4">
            {currentQuestionIndex > 0 && (
              <button
                type="button"
                onClick={handlePrevious}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Previous
              </button>
            )}
            <button
              type="button"
              onClick={handleNext}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Submit'}
            </button>
          </div>
        </div>
      </form>
      {error && <div className="mt-4 text-red-500">Error: {error}</div>}
    </div>
  );
};

export default Test;
