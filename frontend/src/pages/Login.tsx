import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthAPI } from '../api/auth';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

const schema = z.object({ email: z.string().email(), password: z.string().min(6) });

export function Login() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<{ email: string; password: string }>({ resolver: zodResolver(schema) });
  const onSubmit = async (data: { email: string; password: string }) => {
    try { await AuthAPI.login(data); navigate('/'); } catch { alert('Invalid credentials'); }
  };
  return (
    <div className="max-w-sm mx-auto mt-10 card">
      <h1 className="text-xl font-semibold mb-4">Login</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <Input {...register('email')} placeholder="you@example.com" label="Email" />
        {errors.email && <p className="text-red-600 text-xs">{errors.email.message as any}</p>}
        <Input type="password" {...register('password')} placeholder="••••••••" label="Password" />
        {errors.password && <p className="text-red-600 text-xs">{errors.password.message as any}</p>}
        <Button disabled={isSubmitting} full>Login</Button>
      </form>
      <div className="text-sm mt-3">No account? <Link className="text-brand-700 hover:underline" to="/register">Register</Link></div>
    </div>
  );
}