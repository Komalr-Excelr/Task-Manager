import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthAPI } from '../api/auth';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

const schema = z.object({ email: z.string().email(), name: z.string().min(1).max(100), password: z.string().min(6) });

export function Register() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<{ email: string; name: string; password: string }>({ resolver: zodResolver(schema) });
  const onSubmit = async (data: { email: string; name: string; password: string }) => {
    try { await AuthAPI.register(data); navigate('/'); } catch (e: any) { alert(e.message || 'Registration failed'); }
  };
  return (
    <div className="max-w-sm mx-auto mt-10 card">
      <h1 className="text-xl font-semibold mb-4">Create account</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <Input {...register('email')} placeholder="you@example.com" label="Email" />
        {errors.email && <p className="text-red-600 text-xs">{errors.email.message as any}</p>}
        <Input {...register('name')} placeholder="Your name" label="Name" />
        {errors.name && <p className="text-red-600 text-xs">{errors.name.message as any}</p>}
        <Input type="password" {...register('password')} placeholder="••••••••" label="Password" />
        {errors.password && <p className="text-red-600 text-xs">{errors.password.message as any}</p>}
        <Button disabled={isSubmitting} full>Create account</Button>
      </form>
      <div className="text-sm mt-3">Have an account? <Link className="text-brand-700 hover:underline" to="/login">Login</Link></div>
    </div>
  );
}