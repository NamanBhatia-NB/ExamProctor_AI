import { examService } from '@/services/examService';

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
          optionA: 'Array',
          optionB: 'Linked List',
          optionC: 'Binary Heap',
          optionD: 'Binary Search Tree',
          correctAnswer: 2,
        },
        {
          id: crypto.randomUUID(),
          text: 'What is the time complexity of searching in a balanced BST?',
          options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
          optionA: 'O(1)',
          optionB: 'O(log n)',
          optionC: 'O(n)',
          optionD: 'O(n log n)',
          correctAnswer: 1,
        },
        {
          id: crypto.randomUUID(),
          text: 'Which data structure uses LIFO principle?',
          options: ['Queue', 'Stack', 'Tree', 'Graph'],
          optionA: 'Queue',
          optionB: 'Stack',
          optionC: 'Tree',
          optionD: 'Graph',
          correctAnswer: 1,
        },
        {
          id: crypto.randomUUID(),
          text: 'What is the worst-case time complexity of QuickSort?',
          options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
          optionA: 'O(n)',
          optionB: 'O(n log n)',
          optionC: 'O(n²)',
          optionD: 'O(log n)',
          correctAnswer: 2,
        },
        {
          id: crypto.randomUUID(),
          text: 'Which traversal visits the root node first?',
          options: ['Inorder', 'Preorder', 'Postorder', 'Level-order'],
          optionA: 'Inorder',
          optionB: 'Preorder',
          optionC: 'Postorder',
          optionD: 'Level-order',
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
          optionA: 'Bubble Sort',
          optionB: 'Merge Sort',
          optionC: 'Selection Sort',
          optionD: 'Insertion Sort',
          correctAnswer: 1,
        },
        {
          id: crypto.randomUUID(),
          text: 'What is the space complexity of recursive Fibonacci?',
          options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
          optionA: 'O(1)',
          optionB: 'O(log n)',
          optionC: 'O(n)',
          optionD: 'O(n²)',
          correctAnswer: 2,
        },
        {
          id: crypto.randomUUID(),
          text: 'Which algorithm is used for finding shortest path in weighted graphs?',
          options: ['BFS', 'DFS', 'Dijkstra', 'Kruskal'],
          optionA: 'BFS',
          optionB: 'DFS',
          optionC: 'Dijkstra',
          optionD: 'Kruskal',
          correctAnswer: 2,
        },
      ],
    });
    
    // console.log('Sample exams initialized');
  }
};