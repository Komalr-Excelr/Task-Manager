import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { TasksAPI } from '../api/tasks';
import { TaskCard } from '../components/TaskCard';
import { useState } from 'react';
import { useSocket } from '../hooks/useSocket';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { UsersAPI } from '../api/users';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { Button } from '../components/ui/Button';

export function Tasks() {
  const [status, setStatus] = useState<string>('');
  const [priority, setPriority] = useState<string>('');
  const [sort, setSort] = useState<string>('dueDate:asc');
  const client = useQueryClient();
  const { data, isLoading, refetch } = useQuery({ queryKey: ['tasks', status, priority, sort], queryFn: () => TasksAPI.list({ status: status || undefined, priority: priority || undefined, sort }) });
  const { data: users } = useQuery({ queryKey: ['users'], queryFn: UsersAPI.list });
  const createSchema = z.object({
    title: z.string().min(1).max(100),
    description: z.string().min(1),
    dueDate: z.string().min(1),
    priority: z.enum(['Low','Medium','High','Urgent']),
    assignedToId: z.string().optional().nullable(),
  });
  const { register, handleSubmit, reset } = useForm<z.infer<typeof createSchema>>({ resolver: zodResolver(createSchema) });
  const createMutation = useMutation({
    mutationFn: (payload: any) => TasksAPI.create(payload),
    onSuccess: async () => { reset(); await refetch(); },
  });

  useSocket((s) => {
    s.on('task.updated', () => refetch());
  });

  if (isLoading || !data) return <div className="card animate-pulse">Loading tasks...</div>;

  return (
    <div>
      <form id="create-task" onSubmit={handleSubmit((d) => createMutation.mutate(d))} className="card mb-4 grid md:grid-cols-5 gap-2 items-end">
        <div className="md:col-span-1"><Input {...register('title')} placeholder="Task title" label="Title" /></div>
        <div className="md:col-span-2"><Textarea {...register('description')} placeholder="Short description" label="Description" /></div>
        <div className="md:col-span-1"><Input type="datetime-local" {...register('dueDate')} label="Due Date" /></div>
        <div className="md:col-span-1">
          <Select {...register('priority')} label="Priority">
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
            <option>Urgent</option>
          </Select>
        </div>
        <div className="md:col-span-1">
          <Select {...register('assignedToId')} label="Assignee">
            <option value="">Unassigned</option>
            {users?.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </Select>
        </div>
        <div className="md:col-span-1"><Button>Create</Button></div>
      </form>
      <div className="card flex flex-wrap gap-3 mb-4 items-end">
        <div className="w-40"><Select value={status} onChange={e => setStatus(e.target.value)} label="Status">
          <option value="">All Status</option>
          <option>ToDo</option>
          <option>InProgress</option>
          <option>Review</option>
          <option>Completed</option>
        </Select></div>
        <div className="w-40"><Select value={priority} onChange={e => setPriority(e.target.value)} label="Priority">
          <option value="">All Priority</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
          <option>Urgent</option>
        </Select></div>
        <div className="w-48"><Select value={sort} onChange={e => setSort(e.target.value)} label="Sort By">
          <option value="dueDate:asc">Due Date Asc</option>
          <option value="dueDate:desc">Due Date Desc</option>
        </Select></div>
        <Button variant="ghost" onClick={() => client.invalidateQueries({ queryKey: ['tasks'] })}>Refresh</Button>
      </div>
      <div className="grid md:grid-cols-3 gap-3">
        {data.map(t => <TaskCard key={t.id} task={t} />)}
      </div>
    </div>
  );
}