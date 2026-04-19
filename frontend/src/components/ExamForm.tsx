import { SafeAny } from "@/types";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

export default function ExamForm({
  exam,
  onSubmit,
  onCancel,
  userId,
  isSubmitting
}: {
  exam?: SafeAny;
  onSubmit: (data: SafeAny) => void;
  onCancel: () => void;
  userId: string;
  isSubmitting: boolean;
}) {
  const [title, setTitle] = useState(exam?.title || '');
  const [duration, setDuration] = useState(exam?.duration || 60);

  // FIX: Translate Backend Format -> Frontend Format when Editing
  const [questions, setQuestions] = useState<SafeAny[]>(() => {
    if (exam && exam.questions && exam.questions.length > 0) {
      return exam.questions.map((q: SafeAny) => {
        // Convert Backend 'A','B','C','D' back to Frontend Index 0,1,2,3
        let correctIndex = 0;
        if (q.correctAnswer === 'B') correctIndex = 1;
        if (q.correctAnswer === 'C') correctIndex = 2;
        if (q.correctAnswer === 'D') correctIndex = 3;

        return {
          text: q.question || q.text || '',
          options: [
            q.optionA || q.options?.[0] || '',
            q.optionB || q.options?.[1] || '',
            q.optionC || q.options?.[2] || '',
            q.optionD || q.options?.[3] || ''
          ],
          correctAnswer: correctIndex
        };
      });
    }
    // Default empty state for New Exams
    return [{ text: '', options: ['', '', '', ''], correctAnswer: 0 }];
  });

  const handleAddQuestion = () => {
    setQuestions([...questions, { text: '', options: ['', '', '', ''], correctAnswer: 0 }]);
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index: number, field: string, value: SafeAny) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Pass the raw form data up to handleCreateExam/handleUpdateExam to format
    onSubmit({
      title,
      duration,
      questions,
      createdBy: userId,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">
          {exam ? 'Edit Exam' : 'Create New Exam'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Exam Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Duration (minutes)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              min="1"
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-medium text-slate-700">Questions</label>
              <button
                type="button"
                onClick={handleAddQuestion}
                className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                <Plus size={16} />
                Add Question
              </button>
            </div>

            <div className="space-y-6">
              {questions.map((q, qIndex) => (
                <div key={qIndex} className="p-4 border border-slate-300 rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium text-slate-700">Question {qIndex + 1}</h4>
                    {questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(qIndex)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    value={q.text}
                    onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)}
                    placeholder="Enter question text"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg mb-3 focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />

                  <div className="space-y-2">
                    {q.options.map((opt: string, oIndex: number) => (
                      <div key={oIndex} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`correct-${qIndex}`}
                          checked={q.correctAnswer === oIndex}
                          onChange={() => handleQuestionChange(qIndex, 'correctAnswer', oIndex)}
                          className="w-4 h-4"
                        />
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                          placeholder={`Option ${oIndex + 1}`}
                          className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                          required
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-6 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2 rounded-lg text-white transition flex items-center justify-center min-w-[140px] ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </span>
              ) : (
                exam ? 'Update Exam' : 'Create Exam'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}