export interface OperatorExample {
  id: string;
  name: string;
  category: OperatorCategory;
  difficulty: DifficultyLevel;
  description: string;
  useCase: string;
  code: string;
  explanation: string;
  marbleInput?: string;
  marbleOutput?: string;
  relatedOperators?: string[];
  commonMistakes?: string[];
  bestPractices?: string[];
}

export enum OperatorCategory {
  TRANSFORMATION = 'transformation',
  FILTERING = 'filtering',
  COMBINATION = 'combination',
  ERROR_HANDLING = 'error-handling',
  UTILITY = 'utility',
  CREATION = 'creation'
}

export enum DifficultyLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced'
}

export interface ApiResponse<T> {
  data: T;
  timestamp: number;
  executionTime: number;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  age?: number;
  role?: string;
  isActive?: boolean;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
  description?: string;
}

export interface Order {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  total: number;
  status: OrderStatus;
  createdAt: Date;
}

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface ExampleResult {
  success: boolean;
  data?: any;
  error?: string;
  executionTime: number;
  operatorUsed: string;
}

// Made with Bob
