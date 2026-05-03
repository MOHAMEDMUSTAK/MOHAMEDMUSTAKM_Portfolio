import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAdmin } from '@/contexts/AdminContext';
import { toast } from 'sonner';
import { Lock, User } from 'lucide-react';

interface AdminLoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AdminLoginDialog({ open, onOpenChange }: AdminLoginDialogProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAdmin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(username, password)) {
      toast.success('Welcome back, Admin!');
      onOpenChange(false);
      setUsername('');
      setPassword('');
    } else {
      toast.error('Invalid credentials');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-white/10 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display gradient-text-cyan-purple text-center">
            Admin Access
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 focus:border-primary"
                placeholder="Enter username"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 focus:border-primary"
                placeholder="Enter password"
              />
            </div>
          </div>
          
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground font-semibold"
          >
            Login
          </Button>
          
        </form>
      </DialogContent>
    </Dialog>
  );
}
