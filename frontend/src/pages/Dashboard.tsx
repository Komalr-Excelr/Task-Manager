import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { TasksAPI } from '../api/tasks';
import { TaskCard } from '../components/TaskCard';
import { useSocket } from '../hooks/useSocket';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { UsersAPI } from '../api/users';
import { AuthAPI } from '../api/auth';

export function Dashboard() {
  const client = useQueryClient();
  const { data, refetch, isLoading } = useQuery({ queryKey: ['dashboard'], queryFn: TasksAPI.dashboard });
  const { data: users } = useQuery({ queryKey: ['users'], queryFn: UsersAPI.list, retry: 0 });
  const { data: me } = useQuery({ queryKey: ['me'], queryFn: AuthAPI.me, retry: 0 });

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
    onSuccess: async () => { reset(); await Promise.all([refetch(), client.invalidateQueries({ queryKey: ['tasks'] })]); },
  });

  useSocket((s) => {
    s.on('task.updated', () => refetch());
  });

  if (isLoading || !data) {
    return (
      <div className="grid gap-6">
        {[1,2,3].map(i => (
          <div key={i} className="card">
            <div className="card-body space-y-3">
              <div className="h-5 w-40 skeleton" />
              <div className="grid md:grid-cols-3 gap-3">
                {[1,2,3].map(j => <div key={j} className="h-32 skeleton" />)}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  const { assignedToMe, createdByMe, overdue } = data;
  return (
    <div className="grid gap-6">
      {!me ? (
        <section className="card">
          <div className="card-body flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Welcome to TaskManager</h2>
              <p className="text-sm text-gray-600">Please login or create an account to start managing tasks.</p>
            </div>
            <div className="flex gap-2">
              <a href="/login" className="btn btn-primary">Login</a>
              <a href="/register" className="btn btn-ghost">Register</a>
            </div>
          </div>
        </section>
      ) : (
        <section className="card">
          <div className="card-body">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Quick Create Task</h2>
              <a href="/tasks#create-task" className="btn btn-ghost">Go to full form</a>
            </div>
            <form onSubmit={handleSubmit((d) => createMutation.mutate(d))} className="grid md:grid-cols-5 gap-2 items-end">
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
          </div>
        </section>
      )}
      <section className="card">
        <div className="card-body">
          <h2 className="text-lg font-semibold mb-3">Assigned to Me</h2>
          {assignedToMe.length === 0 ? (
            <div className="text-sm text-gray-500">No tasks assigned to you.</div>
          ) : (
            <div className="grid md:grid-cols-3 gap-3">
              {assignedToMe.map(t => <TaskCard key={t.id} task={t} />)}
            </div>
          )}
        </div>
      </section>
      <section className="card">
        <div className="card-body">
          <h2 className="text-lg font-semibold mb-3">Created by Me</h2>
          {createdByMe.length === 0 ? (
            <div className="text-sm text-gray-500">You haven't created any tasks yet.</div>
          ) : (
            <div className="grid md:grid-cols-3 gap-3">
              {createdByMe.map(t => <TaskCard key={t.id} task={t} />)}
            </div>
          )}
        </div>
      </section>
      <section className="card">
        <div className="card-body">
          <h2 className="text-lg font-semibold mb-3">Overdue</h2>
          {overdue.length === 0 ? (
            <div className="text-sm text-gray-500">Great! No overdue tasks.</div>
          ) : (
            <div className="grid md:grid-cols-3 gap-3">
              {overdue.map(t => <TaskCard key={t.id} task={t} />)}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}