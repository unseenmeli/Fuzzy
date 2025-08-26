import { Alert } from 'react-native';

export class AppError extends Error {
  code?: string;
  details?: any;

  constructor(message: string, code?: string, details?: any) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.details = details;
  }
}

export function handleError(error: any, context?: string) {
  console.error(`Error${context ? ` in ${context}` : ''}:`, error);
  
  let message = 'An unexpected error occurred';
  
  if (error instanceof AppError) {
    message = error.message;
  } else if (error?.message) {
    message = error.message;
  } else if (error?.body?.message) {
    message = error.body.message;
  } else if (typeof error === 'string') {
    message = error;
  }
  
  Alert.alert(
    'Error',
    message,
    [{ text: 'OK' }]
  );
}

export function handleAsyncError(promise: Promise<any>, context?: string) {
  return promise.catch(error => handleError(error, context));
}