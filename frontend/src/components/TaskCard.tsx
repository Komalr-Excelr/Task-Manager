import { Link } from 'react-router-dom';
import { Task } from '../api/tasks';

function priorityBadge(p: Task['priority']) {
  const map: Record<string, string> = {
    Low: 'badge badge-info',
    Medium: 'badge badge-success',
    High: 'badge badge-warning',
    Urgent: 'badge badge-danger',
  };
  return <span className={map[p] || 'badge'}>{p}</span>;
}

function statusBadge(s: Task['status']) {
  const map: Record<string, string> = {
    ToDo: 'badge',
    InProgress: 'badge badge-info',
    Review: 'badge badge-warning',
    Completed: 'badge badge-success',
  };
  return <span className={map[s] || 'badge'}>{s}</span>;
}

export function TaskCard({ task }: { task: Task }) {
  return (
    <Link to={`/tasks/${task.id}`} className="card hover:shadow-md transition">
      <div className="card-body space-y-2">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold leading-tight line-clamp-2">{task.title}</h3>
          <div className="flex gap-1">{priorityBadge(task.priority)}{statusBadge(task.status)}</div>
        </div>
        <div className="text-xs text-gray-500">Due {new Date(task.dueDate).toLocaleString()}</div>
      </div>
    </Link>
  );
}