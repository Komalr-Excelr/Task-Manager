import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { TasksAPI } from '../api/tasks';
import { useSocket } from '../hooks/useSocket';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';

export function TaskDetail() {
  const { id } = useParams();
  const client = useQueryClient();
  const { data: task, isLoading, refetch } = useQuery({ queryKey: ['task', id], queryFn: () => TasksAPI.get(id!) });
  useSocket(s => s.on('task.updated', (p: any) => { if (p.id === id) refetch(); }));

  const mutate = useMutation({
    mutationFn: (patch: any) => TasksAPI.update(id!, patch),
    onMutate: async (patch) => {
      // Optimistic UI (bonus): update cache
      await client.cancelQueries({ queryKey: ['task', id] });
      const prev = client.getQueryData(['task', id]);
      client.setQueryData(['task', id], (old: any) => ({ ...old, ...patch }));
      return { prev };
    },
    onError: (_err, _vars, context) => {
      if (context?.prev) client.setQueryData(['task', id], context.prev);
    },
    onSettled: () => refetch(),
  });

  if (isLoading || !task) return <div className="card animate-pulse">Loading task...</div>;

  return (
    <div className="card space-y-3">
      <h1 className="text-xl font-semibold">{task.title}</h1>
      <p className="text-sm text-gray-700 whitespace-pre-wrap">{task.description}</p>
      <div className="text-sm">Due: {new Date(task.dueDate).toLocaleString()}</div>
      <div className="flex gap-3 items-center">
        <div className="w-40">
          <Select label="Status" value={task.status} onChange={e => mutate.mutate({ status: e.target.value })}>
            <option>ToDo</option>
            <option>InProgress</option>
            <option>Review</option>
            <option>Completed</option>
          </Select>
        </div>
        <div className="w-40">
          <Select label="Priority" value={task.priority} onChange={e => mutate.mutate({ priority: e.target.value })}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
            <option>Urgent</option>
          </Select>
        </div>
      </div>
      <div>
        <Button variant="danger" onClick={async () => { await TasksAPI.remove(id!); window.history.back(); }}>Delete Task</Button>
      </div>
    </div>
  );
}