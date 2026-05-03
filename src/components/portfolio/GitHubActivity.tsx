import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useContacts } from '@/hooks/usePortfolioData';

interface Repo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
}

const languageColors: Record<string, string> = {
  Python: 'hsl(var(--gradient-blue))',
  JavaScript: 'hsl(var(--gradient-yellow))',
  TypeScript: 'hsl(var(--gradient-cyan))',
  HTML: 'hsl(var(--gradient-orange))',
  CSS: 'hsl(var(--gradient-purple))',
  Jupyter: 'hsl(var(--gradient-green))',
  'Jupyter Notebook': 'hsl(var(--gradient-green))',
  Java: 'hsl(var(--gradient-pink))',
  C: 'hsl(var(--gradient-teal))',
  'C++': 'hsl(var(--gradient-violet))',
};

function ContributionHeatmap() {
  const weeks = 52;
  const days = 7;
  const [cells, setCells] = useState<number[][]>([]);

  useEffect(() => {
    // Generate simulated contribution data
    const data: number[][] = [];
    for (let w = 0; w < weeks; w++) {
      const week: number[] = [];
      for (let d = 0; d < days; d++) {
        const r = Math.random();
        week.push(r < 0.3 ? 0 : r < 0.5 ? 1 : r < 0.7 ? 2 : r < 0.85 ? 3 : 4);
      }
      data.push(week);
    }
    setCells(data);
  }, []);

  const getColor = (level: number) => {
    switch (level) {
      case 0: return 'rgba(255,255,255,0.03)';
      case 1: return 'hsl(var(--gradient-cyan) / 0.2)';
      case 2: return 'hsl(var(--gradient-cyan) / 0.4)';
      case 3: return 'hsl(var(--gradient-cyan) / 0.6)';
      case 4: return 'hsl(var(--gradient-cyan) / 0.85)';
      default: return 'rgba(255,255,255,0.03)';
    }
  };

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex gap-[3px] min-w-[700px]">
        {cells.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {week.map((level, di) => (
              <div
                key={di}
                className="w-[11px] h-[11px] rounded-sm transition-colors duration-200"
                style={{ background: getColor(level) }}
                title={`Level: ${level}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function LanguageChart({ repos }: { repos: Repo[] }) {
  const langCount: Record<string, number> = {};
  repos.forEach(r => {
    if (r.language) {
      langCount[r.language] = (langCount[r.language] || 0) + 1;
    }
  });

  const sorted = Object.entries(langCount).sort((a, b) => b[1] - a[1]);
  const total = sorted.reduce((s, [, c]) => s + c, 0);

  return (
    <div className="space-y-3">
      {sorted.slice(0, 6).map(([lang, count]) => {
        const pct = Math.round((count / total) * 100);
        const color = languageColors[lang] || 'hsl(var(--muted-foreground))';
        return (
          <div key={lang} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-foreground/80">{lang}</span>
              <span className="text-muted-foreground">{pct}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-muted/30 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: color }}
                initial={{ width: 0 }}
                whileInView={{ width: `${pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function GitHubActivity() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const { contacts } = useContacts();

  const githubContact = contacts.find(c => c.type === 'github');
  // Extract username from contact value like "github.com/USERNAME" or just "USERNAME"
  const githubUsername = githubContact?.value?.replace(/^(https?:\/\/)?(www\.)?github\.com\/?/i, '').replace(/\/$/, '') || 'MOHAMEDMUSTAK';

  useEffect(() => {
    if (!githubUsername) return;
    fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=30`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setRepos(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [githubUsername]);

  return (
    <section id="github" className="py-24 lg:py-32 relative" style={{
      background: `
        radial-gradient(ellipse 70% 50% at 50% 30%, hsl(var(--gradient-cyan) / 0.06), transparent),
        radial-gradient(ellipse 60% 60% at 20% 80%, hsl(var(--gradient-purple) / 0.05), transparent),
        hsl(0 0% 1%)
      `
    }}>
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-sm font-medium text-primary tracking-widest uppercase">
            Open Source
          </span>
          <h2 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-display font-bold">
            <span className="gradient-text-cyan-purple">GitHub Activity</span>
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Contribution Heatmap */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Contribution Activity</h3>
              <ContributionHeatmap />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Language Chart */}
              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Languages Used</h3>
                <LanguageChart repos={repos} />
              </div>

              {/* Latest Repos */}
              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Latest Repositories</h3>
                <div className="space-y-3">
                  {repos.slice(0, 5).map(repo => (
                    <a
                      key={repo.id}
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 rounded-xl bg-muted/10 hover:bg-muted/20 border border-border/20 hover:border-primary/30 transition-all duration-300 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                          {repo.name}
                        </span>
                        {repo.language && (
                          <span
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{
                              background: `${languageColors[repo.language] || 'hsl(var(--muted))'} / 0.15)`.replace(')', ''),
                              color: languageColors[repo.language] || 'hsl(var(--muted-foreground))',
                            }}
                          >
                            {repo.language}
                          </span>
                        )}
                      </div>
                      {repo.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{repo.description}</p>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
