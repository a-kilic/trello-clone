import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task, Priority } from "../types";
import { Calendar, User, Trash2 } from "lucide-react";

interface TaskCardProps {
  task: Task;
  onDelete?: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const priorityStyles: Record<Priority, string> = {
    low: "bg-blue-100 text-blue-800",
    medium: "bg-amber-100 text-amber-800",
    high: "bg-rose-100 text-rose-800",
  };

  const isDeadlinePast = () => {
    if (!task.deadline) return false;
    const deadline = new Date(task.deadline);
    return deadline < new Date();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(task.id);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group bg-white rounded-md shadow-sm border border-gray-200 p-3 cursor-grab
                 hover:shadow-md transition-shadow duration-200 ${
                   isDragging ? "opacity-50" : ""
                 }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-start justify-between flex-1 gap-2">
          <h4 className="font-medium leading-tight text-gray-800">
            {task.title}
          </h4>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              priorityStyles[task.priority]
            }`}
          >
            {task.priority}
          </span>
        </div>
        <button
          onClick={handleDelete}
          className="p-1 text-gray-400 transition-opacity duration-200 rounded-full opacity-0 group-hover:opacity-100 hover:bg-gray-100 hover:text-rose-500"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {task.description && (
        <p className="mb-3 text-sm text-gray-600 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
        {task.assignee && (
          <div className="flex items-center gap-1">
            <User size={12} />
            <span>{task.assignee}</span>
          </div>
        )}

        {task.deadline && (
          <div
            className={`flex items-center gap-1 ${
              isDeadlinePast() ? "text-rose-500" : ""
            }`}
          >
            <Calendar size={12} />
            <span>{formatDate(task.deadline)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
