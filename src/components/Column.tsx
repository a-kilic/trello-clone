import React from 'react';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Column as ColumnType, Task } from '../types';
import TaskCard from './TaskCard';

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
  onDeleteTask?: (taskId: string) => void;
}

const Column: React.FC<ColumnProps> = ({ column, tasks, onDeleteTask }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: column.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Define column header colors
  const columnStyles = {
    todo: 'bg-blue-50 border-blue-200',
    inProgress: 'bg-amber-50 border-amber-200',
    done: 'bg-emerald-50 border-emerald-200',
  };

  // Column titles with icons and count
  const columnTitles = {
    todo: 'To Do',
    inProgress: 'In Progress',
    done: 'Done',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-gray-50 rounded-lg shadow-sm flex flex-col w-72 h-full min-h-[28rem] max-h-full"
      {...attributes}
    >
      <div
        className={`p-3 ${columnStyles[column.id]} border-b rounded-t-lg flex justify-between items-center sticky top-0 z-10`}
        {...listeners}
      >
        <h3 className="font-medium text-gray-800">{columnTitles[column.id]}</h3>
        <span className="bg-white text-sm text-gray-600 font-medium py-0.5 px-2 rounded-full">
          {tasks.length}
        </span>
      </div>
      
      <div className="flex-1 p-2 overflow-y-auto">
        <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
          {tasks.length ? (
            <div className="flex flex-col gap-2">
              {tasks.map((task) => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onDelete={onDeleteTask}
                />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 text-gray-400 text-sm italic">
              No tasks yet
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
};

export default Column;