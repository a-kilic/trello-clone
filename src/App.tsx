import React from 'react';
import Board from './components/Board';
import { ClipboardList } from 'lucide-react';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-6 w-6 text-blue-500" />
              <h1 className="text-xl font-semibold text-gray-900">TaskFlow</h1>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Board />
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-gray-500 text-center">
            TaskFlow Project Management • {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;