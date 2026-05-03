import { useState } from 'react';
import { useContacts, Contact } from '@/hooks/usePortfolioData';
import { useAdmin } from '@/contexts/AdminContext';
import { Mail, Phone, Linkedin, Github, MessageCircle, Pencil, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Mail: Mail,
  Phone: Phone,
  Linkedin: Linkedin,
  Github: Github,
  MessageCircle: MessageCircle,
};

const gradientMap: Record<string, string> = {
  email: 'from-cyan-400 via-blue-500 to-purple-600',
  phone: 'from-green-400 via-emerald-500 to-teal-600',
  linkedin: 'from-blue-400 via-blue-600 to-indigo-600',
  github: 'from-purple-400 via-pink-500 to-rose-600',
  whatsapp: 'from-emerald-400 via-teal-500 to-cyan-600',
};

const glowMap: Record<string, string> = {
  email: 'shadow-[0_0_30px_rgba(0,255,255,0.4),0_0_60px_rgba(0,255,255,0.2)]',
  phone: 'shadow-[0_0_30px_rgba(16,185,129,0.4),0_0_60px_rgba(16,185,129,0.2)]',
  linkedin: 'shadow-[0_0_30px_rgba(59,130,246,0.4),0_0_60px_rgba(59,130,246,0.2)]',
  github: 'shadow-[0_0_30px_rgba(168,85,247,0.4),0_0_60px_rgba(168,85,247,0.2)]',
  whatsapp: 'shadow-[0_0_30px_rgba(20,184,166,0.4),0_0_60px_rgba(20,184,166,0.2)]',
};

const labelMap: Record<string, string> = {
  email: 'Email',
  phone: 'Phone',
  linkedin: 'LinkedIn',
  github: 'GitHub',
  whatsapp: 'WhatsApp (Professional Contact)',
};

export default function ContactSection() {
  const { contacts, updateContact } = useContacts();
  const { isAdmin } = useAdmin();
  const [editingContact, setEditingContact] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const startEditing = (contact: Contact) => {
    setEditingContact(contact.id);
    setEditValue(contact.value);
  };

  const saveEdit = async (id: string) => {
    const error = await updateContact(id, { value: editValue });
    if (!error) {
      toast.success('Contact updated!');
      setEditingContact(null);
    } else {
      toast.error('Failed to update contact');
    }
  };

  const getLink = (contact: Contact) => {
    switch (contact.type) {
      case 'email':
        return `mailto:${contact.value}`;
      case 'phone':
        return `tel:${contact.value}`;
      case 'linkedin':
        return `https://${contact.value}`;
      case 'github':
        return `https://${contact.value}`;
      case 'whatsapp':
        // Clean the phone number (remove spaces, dashes, etc.) and use wa.me
        const cleanNumber = contact.value.replace(/[\s\-\(\)]/g, '');
        return `https://wa.me/${cleanNumber.replace('+', '')}`;
      default:
        return '#';
    }
  };

  return (
    <section id="contact" className="min-h-screen bg-section-contact py-24 lg:py-32 relative">
      {/* Pure black background with subtle grid */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 opacity-0 animate-fade-in">
          <span className="text-sm font-medium text-primary tracking-widest uppercase">
            Let's Connect
          </span>
          <h2 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-display font-bold">
            <span className="gradient-text-rainbow">Get In Touch</span>
          </h2>
          <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto">
            Ready to start a project or just want to say hello? Feel free to reach out through any of these channels.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {contacts.map((contact, index) => {
            const IconComponent = iconMap[contact.icon || 'Mail'] || Mail;
            const gradient = gradientMap[contact.type] || gradientMap.email;
            const glow = glowMap[contact.type] || glowMap.email;
            
            return (
              <div
                key={contact.id}
                className={`glass-card p-8 group hover:scale-105 transition-all duration-500 opacity-0 animate-fade-in ${glow}`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Gradient Border Effect */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                
                <div className="relative z-10 flex items-start gap-6">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
                      {labelMap[contact.type] || contact.type}
                    </h3>
                    
                    {editingContact === contact.id ? (
                      <div className="flex gap-2">
                        <Input
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="bg-white/5 border-white/10"
                        />
                        <Button onClick={() => saveEdit(contact.id)} size="sm" className="bg-primary text-primary-foreground">
                          <Save className="w-4 h-4" />
                        </Button>
                        <Button onClick={() => setEditingContact(null)} size="sm" variant="outline">
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <a
                          href={getLink(contact)}
                          target={contact.type !== 'email' && contact.type !== 'phone' ? '_blank' : undefined}
                          rel="noopener noreferrer"
                          className="text-xl font-semibold text-foreground hover:text-primary transition-colors break-all"
                        >
                          {contact.value}
                        </a>
                        
                        {isAdmin && (
                          <Button
                            onClick={() => startEditing(contact)}
                            size="sm"
                            className="mt-3 admin-btn opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Pencil className="w-3 h-3 mr-1" /> Edit
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-24 text-center opacity-0 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <div className="inline-flex items-center gap-2 text-muted-foreground">
            <span>Made with</span>
            <span className="text-red-500 animate-pulse">❤️</span>
            <span>by</span>
            <span className="gradient-text-cyan-purple font-semibold">Portfolio</span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground/60">
            © {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </div>
    </section>
  );
}
