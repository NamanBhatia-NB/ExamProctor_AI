import { examService } from '@/services/examService';
import { Exam } from '@/types';

export const initializeSampleData = () => {
  const exams = examService.getExams();
  
  if (exams.length === 0) {
    // Sample Exam 1: Data Structures
    examService.createExam({
      title: 'Advanced Data Structures',
      duration: 60,
      createdBy: 'admin',
      questions: [
        {
          id: crypto.randomUUID(),
          text: 'Which data structure is most optimal for implementing a priority queue?',
          options: ['Array', 'Linked List', 'Binary Heap', 'Binary Search Tree'],
          correctAnswer: 2,
        },
        {
          id: crypto.randomUUID(),
          text: 'What is the time complexity of searching in a balanced BST?',
          options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
          correctAnswer: 1,
        },
        {
          id: crypto.randomUUID(),
          text: 'Which data structure uses LIFO principle?',
          options: ['Queue', 'Stack', 'Tree', 'Graph'],
          correctAnswer: 1,
        },
        {
          id: crypto.randomUUID(),
          text: 'What is the worst-case time complexity of QuickSort?',
          options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
          correctAnswer: 2,
        },
        {
          id: crypto.randomUUID(),
          text: 'Which traversal visits the root node first?',
          options: ['Inorder', 'Preorder', 'Postorder', 'Level-order'],
          correctAnswer: 1,
        },
      ],
    });
    
    // Sample Exam 2: Algorithms
    examService.createExam({
      title: 'Algorithm Analysis',
      duration: 45,
      createdBy: 'admin',
      questions: [
        {
          id: crypto.randomUUID(),
          text: 'Which algorithm uses divide and conquer strategy?',
          options: ['Bubble Sort', 'Merge Sort', 'Selection Sort', 'Insertion Sort'],
          correctAnswer: 1,
        },
        {
          id: crypto.randomUUID(),
          text: 'What is the space complexity of recursive Fibonacci?',
          options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
          correctAnswer: 2,
        },
        {
          id: crypto.randomUUID(),
          text: 'Which algorithm is used for finding shortest path in weighted graphs?',
          options: ['BFS', 'DFS', 'Dijkstra', 'Kruskal'],
          correctAnswer: 2,
        },
      ],
    });
    
    // console.log('Sample exams initialized');
  }
};
