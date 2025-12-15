import { useEffect, useState } from 'react';
import { AuthAPI } from '../api/auth';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export function Profile() {
  const [name, setName] = useState('');
  useEffect(() => { AuthAPI.me().then(u => setName(u.name)); }, []);
  const save = async () => {
    await AuthAPI.updateProfile({ name });
    alert('Saved');
  };
  return (
    <div className="max-w-sm card">
      <h1 className="text-xl font-semibold mb-3">Profile</h1>
      <Input value={name} onChange={(e) => setName(e.target.value)} label="Display Name" />
      <Button onClick={save} full className="mt-3">Save</Button>
    </div>
  );
}