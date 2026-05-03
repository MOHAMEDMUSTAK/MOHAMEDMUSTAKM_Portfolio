import { useProfile, useProjects, useCertifications, useSkills, useContacts } from '@/hooks/usePortfolioData';
import { useResume } from '@/hooks/useResume';
import { Download, Github, Mail, User, Briefcase, Award, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RecruiterSummary() {
  const { profile } = useProfile();
  const { projects } = useProjects();
  const { certifications } = useCertifications();
  const { skills } = useSkills();
  const { resume } = useResume();
  const { contacts } = useContacts();

  const githubContact = contacts.find(c => c.type === 'github');
  const emailContact = contacts.find(c => c.type === 'email');

  const topSkills = skills
    .sort((a, b) => b.proficiency - a.proficiency)
    .slice(0, 6);

  const quickStats = [
    { icon: Briefcase, label: 'Projects', value: projects.length, gradient: 'from-cyan-400 to-blue-500' },
    { icon: Award, label: 'Certifications', value: certifications.length, gradient: 'from-purple-400 to-pink-500' },
    { icon: Zap, label: 'Technologies', value: skills.length, gradient: 'from-orange-400 to-amber-500' },
  ];

  return (
    <section className="py-24 lg:py-32 relative" style={{
      background: `
        radial-gradient(ellipse 70% 50% at 50% 50%, hsl(var(--gradient-cyan) / 0.05), transparent),
        hsl(0 0% 1%)
      `
    }}>
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-sm font-medium text-primary tracking-widest uppercase">
            Quick Overview
          </span>
          <h2 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-display font-bold">
            <span className="gradient-text-blue-cyan">Recruiter Summary</span>
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            className="glass-card p-8 md:p-10 space-y-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Top: Identity */}
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                <User className="w-7 h-7 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">{profile?.name || 'Loading...'}</h3>
                <p className="text-lg text-primary">{profile?.title}</p>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4">
              {quickStats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div key={i} className="text-center p-4 rounded-xl bg-muted/10 border border-border/20">
                    <Icon className="w-5 h-5 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                );
              })}
            </div>

            {/* Key Skills */}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">Key Skills</h4>
              <div className="flex flex-wrap gap-2">
                {topSkills.map(skill => (
                  <span
                    key={skill.id}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium bg-primary/10 text-primary border border-primary/20"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              {resume?.file_url && (
                <a
                  href={resume.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-premium-primary inline-flex items-center gap-2 !px-6 !py-3 !text-base"
                >
                  <Download className="w-4 h-4" />
                  Download Resume
                </a>
              )}
              {githubContact && (
                <a
                  href={`https://${githubContact.value}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-premium-outline inline-flex items-center gap-2 !px-6 !py-3 !text-base"
                >
                  <Github className="w-4 h-4" />
                  View GitHub
                </a>
              )}
              {emailContact && (
                <a
                  href={`mailto:${emailContact.value}`}
                  className="btn-premium-outline inline-flex items-center gap-2 !px-6 !py-3 !text-base"
                >
                  <Mail className="w-4 h-4" />
                  Contact Me
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
