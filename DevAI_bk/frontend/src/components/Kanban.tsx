'use client';

import { useState } from 'react';
import { Plus, MoreVertical, Clock, User, MessageSquare, X, Edit2, Trash2 } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee?: string;
  dueDate?: string;
  comments: number;
  createdAt: string;
}

export default function Kanban() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Design authentication flow',
      description: 'Create login and signup pages with validation',
      status: 'todo',
      priority: 'high',
      assignee: 'Alice',
      dueDate: '2024-03-20',
      comments: 3,
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Implement API endpoints',
      description: 'Create REST endpoints for user management',
      status: 'in-progress',
      priority: 'high',
      assignee: 'Bob',
      dueDate: '2024-03-22',
      comments: 5,
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      title: 'Code review for PR #42',
      description: 'Review authentication middleware',
      status: 'review',
      priority: 'medium',
      assignee: 'Charlie',
      dueDate: '2024-03-18',
      comments: 2,
      createdAt: new Date().toISOString()
    },
    {
      id: '4',
      title: 'Update documentation',
      description: 'Add setup instructions to README',
      status: 'done',
      priority: 'low',
      assignee: 'Alice',
      dueDate: '2024-03-15',
      comments: 1,
      createdAt: new Date().toISOString()
    }
  ]);

  const [showAddTask, setShowAddTask] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    assignee: '',
    dueDate: ''
  });

  const columns = [
    { id: 'todo', title: 'To Do', color: '#ffde22' },
    { id: 'in-progress', title: 'In Progress', color: '#ff8928' },
    { id: 'review', title: 'Review', color: '#ff414e' },
    { id: 'done', title: 'Done', color: '#10b981' }
  ];

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, status: status as Task['status'] } : task
    );
    setTasks(updatedTasks);
  };

  const addTask = () => {
    if (!newTask.title.trim()) return;
    
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      status: 'todo',
      priority: newTask.priority,
      assignee: newTask.assignee || undefined,
      dueDate: newTask.dueDate || undefined,
      comments: 0,
      createdAt: new Date().toISOString()
    };
    
    setTasks([...tasks, task]);
    resetForm();
  };

  const updateTask = () => {
    if (!editingTask) return;
    
    const updatedTasks = tasks.map(task => 
      task.id === editingTask.id ? editingTask : task
    );
    setTasks(updatedTasks);
    setEditingTask(null);
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const resetForm = () => {
    setNewTask({ title: '', description: '', priority: 'medium', assignee: '', dueDate: '' });
    setShowAddTask(false);
    setEditingTask(null);
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return '#ff414e';
      case 'medium': return '#ff8928';
      default: return '#ffde22';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Team Kanban</h2>
        <button
          onClick={() => setShowAddTask(true)}
          className="px-4 py-2 bg-gradient-to-r from-[#ffde22] to-[#ff8928] text-black rounded-lg font-semibold flex items-center gap-2 hover:scale-105 transition-all"
        >
          <Plus size={18} />
          Add Task
        </button>
      </div>

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map(column => (
          <div
            key={column.id}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
            className="bg-white/5 rounded-xl p-4 border border-white/10"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold" style={{ color: column.color }}>{column.title}</h3>
              <span className="px-2 py-1 bg-white/10 rounded text-sm text-white/60">
                {tasks.filter(t => t.status === column.id).length}
              </span>
            </div>

            <div className="space-y-3 min-h-[200px]">
              {tasks
                .filter(task => task.status === column.id)
                .map(task => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    className="bg-white/10 rounded-lg p-3 border border-white/10 cursor-move hover:border-[#ffde22]/30 transition-all group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span
                        className="px-2 py-1 rounded text-xs font-medium"
                        style={{ 
                          backgroundColor: `${getPriorityColor(task.priority)}20`,
                          color: getPriorityColor(task.priority)
                        }}
                      >
                        {task.priority}
                      </span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setEditingTask(task)}
                          className="p-1 hover:bg-white/10 rounded"
                        >
                          <Edit2 size={14} className="text-white/60" />
                        </button>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="p-1 hover:bg-white/10 rounded"
                        >
                          <Trash2 size={14} className="text-[#ff414e]" />
                        </button>
                      </div>
                    </div>
                    
                    <h4 className="font-medium text-white mb-1">{task.title}</h4>
                    <p className="text-sm text-white/60 mb-3">{task.description}</p>

                    <div className="flex items-center justify-between text-xs text-white/40">
                      <div className="flex items-center gap-2">
                        {task.assignee && (
                          <div className="flex items-center gap-1">
                            <User size={12} />
                            <span>{task.assignee}</span>
                          </div>
                        )}
                        {task.dueDate && (
                          <div className="flex items-center gap-1">
                            <Clock size={12} />
                            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare size={12} />
                        <span>{task.comments}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Task Modal */}
      {(showAddTask || editingTask) && (
        <>
          <div
            onClick={resetForm}
            className="fixed inset-0 bg-black/80 z-50"
          />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#0a0a0a] border border-[#ffde22]/20 rounded-xl p-6 z-50">
            <h3 className="text-xl font-bold text-white mb-4">
              {editingTask ? 'Edit Task' : 'Create New Task'}
            </h3>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Task title"
                value={editingTask ? editingTask.title : newTask.title}
                onChange={(e) => {
                  if (editingTask) {
                    setEditingTask({ ...editingTask, title: e.target.value });
                  } else {
                    setNewTask({ ...newTask, title: e.target.value });
                  }
                }}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[#ffde22] outline-none"
              />
              
              <textarea
                placeholder="Task description"
                value={editingTask ? editingTask.description : newTask.description}
                onChange={(e) => {
                  if (editingTask) {
                    setEditingTask({ ...editingTask, description: e.target.value });
                  } else {
                    setNewTask({ ...newTask, description: e.target.value });
                  }
                }}
                rows={3}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[#ffde22] outline-none resize-none"
              />
              
              <select
                value={editingTask ? editingTask.priority : newTask.priority}
                onChange={(e) => {
                  const priority = e.target.value as 'low' | 'medium' | 'high';
                  if (editingTask) {
                    setEditingTask({ ...editingTask, priority });
                  } else {
                    setNewTask({ ...newTask, priority });
                  }
                }}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[#ffde22] outline-none"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              
              <input
                type="text"
                placeholder="Assignee"
                value={editingTask ? editingTask.assignee || '' : newTask.assignee}
                onChange={(e) => {
                  if (editingTask) {
                    setEditingTask({ ...editingTask, assignee: e.target.value });
                  } else {
                    setNewTask({ ...newTask, assignee: e.target.value });
                  }
                }}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[#ffde22] outline-none"
              />
              
              <input
                type="date"
                value={editingTask ? editingTask.dueDate || '' : newTask.dueDate}
                onChange={(e) => {
                  if (editingTask) {
                    setEditingTask({ ...editingTask, dueDate: e.target.value });
                  } else {
                    setNewTask({ ...newTask, dueDate: e.target.value });
                  }
                }}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[#ffde22] outline-none"
              />
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={editingTask ? updateTask : addTask}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-[#ffde22] to-[#ff8928] text-black rounded-lg font-semibold hover:scale-105 transition-all"
                >
                  {editingTask ? 'Update Task' : 'Create Task'}
                </button>
                <button
                  onClick={resetForm}
                  className="flex-1 px-4 py-3 border border-[#ffde22]/30 text-white rounded-lg font-semibold hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}