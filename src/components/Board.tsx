import React, { useState, useEffect } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import Column from "./Column";
import TaskCard from "./TaskCard";
import { BoardData, Task, Status } from "../types";
import { initialData } from "../data/initialData";
import { Plus } from "lucide-react";
import TaskForm from "./TaskForm";

const Board: React.FC = () => {
  const [data, setData] = useState<BoardData>(
    JSON.parse(
      localStorage.getItem("kanbanData") || JSON.stringify(initialData)
    )
  );
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("kanbanData", JSON.stringify(data));
  }, [data]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const taskId = active.id as string;
    setActiveTask(data.tasks[taskId]);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    let sourceColumnId: Status | null = null;
    for (const columnId of data.columnOrder) {
      if (data.columns[columnId].taskIds.includes(activeId)) {
        sourceColumnId = columnId;
        break;
      }
    }

    if (!sourceColumnId) return;

    if (data.tasks[overId]) {
      let targetColumnId: Status | null = null;
      for (const columnId of data.columnOrder) {
        if (data.columns[columnId].taskIds.includes(overId)) {
          targetColumnId = columnId;
          break;
        }
      }

      if (!targetColumnId) return;

      const sourceColumn = data.columns[sourceColumnId];
      const sourceTaskIds = [...sourceColumn.taskIds];
      const sourceIndex = sourceTaskIds.indexOf(activeId);

      if (sourceColumnId === targetColumnId) {
        const targetIndex = sourceTaskIds.indexOf(overId);
        const newTaskIds = arrayMove(sourceTaskIds, sourceIndex, targetIndex);

        setData({
          ...data,
          columns: {
            ...data.columns,
            [sourceColumnId]: {
              ...sourceColumn,
              taskIds: newTaskIds,
            },
          },
        });
      } else {
        const targetColumn = data.columns[targetColumnId];
        const targetTaskIds = [...targetColumn.taskIds];
        const targetIndex = targetTaskIds.indexOf(overId);

        sourceTaskIds.splice(sourceIndex, 1);

        targetTaskIds.splice(targetIndex, 0, activeId);

        setData({
          ...data,
          tasks: {
            ...data.tasks,
            [activeId]: {
              ...data.tasks[activeId],
              status: targetColumnId,
            },
          },
          columns: {
            ...data.columns,
            [sourceColumnId]: {
              ...sourceColumn,
              taskIds: sourceTaskIds,
            },
            [targetColumnId]: {
              ...targetColumn,
              taskIds: targetTaskIds,
            },
          },
        });
      }
    } else if (Object.keys(data.columns).includes(overId)) {
      const sourceColumn = data.columns[sourceColumnId];
      const targetColumn = data.columns[overId as Status];

      if (sourceColumnId !== overId) {
        const sourceTaskIds = [...sourceColumn.taskIds];
        const sourceIndex = sourceTaskIds.indexOf(activeId);
        const targetTaskIds = [...targetColumn.taskIds];

        sourceTaskIds.splice(sourceIndex, 1);

        targetTaskIds.push(activeId);

        setData({
          ...data,
          tasks: {
            ...data.tasks,
            [activeId]: {
              ...data.tasks[activeId],
              status: overId as Status,
            },
          },
          columns: {
            ...data.columns,
            [sourceColumnId]: {
              ...sourceColumn,
              taskIds: sourceTaskIds,
            },
            [overId]: {
              ...targetColumn,
              taskIds: targetTaskIds,
            },
          },
        });
      }
    }

    setActiveTask(null);
  };

  const addTask = (task: Omit<Task, "id" | "createdAt">) => {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    const column = data.columns[task.status];

    setData({
      ...data,
      tasks: {
        ...data.tasks,
        [newTask.id]: newTask,
      },
      columns: {
        ...data.columns,
        [task.status]: {
          ...column,
          taskIds: [...column.taskIds, newTask.id],
        },
      },
    });

    setIsFormOpen(false);
  };

  const deleteTask = (taskId: string) => {
    const task = data.tasks[taskId];
    if (!task) return;

    const column = data.columns[task.status];
    const newTaskIds = column.taskIds.filter((id) => id !== taskId);

    const newTasks = { ...data.tasks };
    delete newTasks[taskId];

    setData({
      ...data,
      tasks: newTasks,
      columns: {
        ...data.columns,
        [task.status]: {
          ...column,
          taskIds: newTaskIds,
        },
      },
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Project Board</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-white transition-colors duration-200 bg-blue-500 rounded-md hover:bg-blue-600"
        >
          <Plus size={18} />
          <span>Add Task</span>
        </button>
      </div>

      <div className="flex flex-1 px-4 pb-8 overflow-x-auto">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-6">
            {data.columnOrder.map((columnId) => {
              const column = data.columns[columnId];
              const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);

              return (
                <Column
                  key={column.id}
                  column={column}
                  tasks={tasks}
                  onDeleteTask={deleteTask}
                />
              );
            })}
          </div>

          <DragOverlay>
            {activeTask ? (
              <div className="transform rotate-3 cursor-grabbing">
                <TaskCard task={activeTask} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div
            className="w-full max-w-md overflow-hidden bg-white rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b bg-gray-50">
              <h2 className="text-lg font-medium text-gray-800">
                Add New Task
              </h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <TaskForm
              onSubmit={addTask}
              onCancel={() => setIsFormOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Board;
