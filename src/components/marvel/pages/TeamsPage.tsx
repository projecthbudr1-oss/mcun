'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Users, ArrowLeft, Share2 } from 'lucide-react';
import { teams, getTeamBySlug } from '@/data/teams';
import { characters, getCharacterBySlug, getCharactersByTeam } from '@/data/characters';
import { useAppStore } from '@/store/useAppStore';
import ScrollReveal from '@/components/marvel/ScrollReveal';
import ShareButton from '@/components/marvel/ShareButton';

export default function TeamsPage() {
  const { currentPage, navigate } = useAppStore();
  const isTeamView = currentPage.type === 'team';
  const teamSlug = isTeamView ? currentPage.slug : null;
  const selectedTeam = useMemo(() => teamSlug ? getTeamBySlug(teamSlug) : null, [teamSlug]);
  const [expandedTeam, setExpandedTeam] = useState<string | null>(teamSlug);

  const handleTeamClick = (slug: string) => {
    if (expandedTeam === slug) {
      setExpandedTeam(null);
      navigate({ type: 'teams' });
    } else {
      setExpandedTeam(slug);
      navigate({ type: 'team', slug });
    }
  };

  const getTeamMembers = (teamSlug: string) => getCharactersByTeam(teamSlug);

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[350px] flex flex-col items-center justify-center text-center px-4">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] rounded-full animate-halo-pulse pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(237,29,36,0.12) 0%, transparent 60%)' }}
        />

        <motion.h1
          className="font-[var(--font-oswald)] text-white font-black uppercase relative z-10"
          style={{ fontSize: 'clamp(3rem, 10vw, 8rem)', lineHeight: 0.85 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Teams &<br />Alliances
        </motion.h1>
        <motion.p
          className="text-[rgba(255,255,255,0.4)] text-sm mt-4 relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          The forces that shaped the MCU
        </motion.p>
      </section>

      {/* Teams Grid */}
      <section className="px-4 lg:px-8 pb-24 max-w-[1440px] mx-auto">
        <AnimatePresence mode="wait">
          {!expandedTeam ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
            >
              {teams.map((team, i) => {
                const members = getTeamMembers(team.slug);
                return (
                  <ScrollReveal key={team.id} direction={i % 2 === 0 ? 'left' : 'right'} delay={i * 0.1}>
                    <motion.button
                      onClick={() => handleTeamClick(team.slug)}
                      className="relative group overflow-hidden rounded-xl border border-[rgba(255,255,255,0.06)] text-left transition-all duration-300 hover:border-[rgba(255,255,255,0.12)] hover:translate-y-[-4px] card-glass-hover"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      style={{
                        boxShadow: `0 0 0px ${team.haloColor}00`,
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 40px ${team.haloColor}15, 0 0 0px 1px ${team.haloColor}20`;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.boxShadow = `0 0 0px ${team.haloColor}00`;
                      }}
                    >
                      <div
                        className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity"
                        style={{ background: `linear-gradient(135deg, ${team.haloColor}30 0%, transparent 60%)` }}
                      />

                      {/* Cinematic glow effect on hover */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                        style={{
                          background: `radial-gradient(ellipse at 30% 20%, ${team.haloColor}10 0%, transparent 60%)`,
                        }}
                      />

                      <div className="relative p-6 lg:p-8">
                        <h3 className="font-[var(--font-oswald)] text-white text-xl lg:text-2xl font-bold uppercase mb-1">
                          {team.name}
                        </h3>
                        <p className="text-[rgba(255,255,255,0.35)] text-sm mb-3">{team.tagline}</p>
                        <p className="text-[rgba(255,255,255,0.5)] text-sm leading-relaxed line-clamp-3 mb-4">
                          {team.description}
                        </p>

                        {/* Member avatars row */}
                        {members.length > 0 && (
                          <div className="flex items-center mb-4">
                            <div className="flex -space-x-2">
                              {members.slice(0, 5).map((member) => (
                                <div
                                  key={member.slug}
                                  className="w-8 h-8 rounded-full border-2 border-[#141414] overflow-hidden relative z-[1] transition-transform duration-200 hover:translate-y-[-2px] hover:z-[2]"
                                >
                                  <Image
                                    src={member.images.switcher}
                                    alt={member.name}
                                    width={32}
                                    height={32}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ))}
                              {members.length > 5 && (
                                <div className="w-8 h-8 rounded-full border-2 border-[#141414] bg-[#222] flex items-center justify-center text-[rgba(255,255,255,0.5)] text-[10px] font-bold relative z-[1]">
                                  +{members.length - 5}
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          {/* Member count badge */}
                          <span
                            className="power-tier-badge"
                            style={{
                              color: team.haloColor,
                              borderColor: team.haloColor + '30',
                              backgroundColor: team.haloColor + '10',
                            }}
                          >
                            <Users size={10} />
                            {members.length > 0 ? `${members.length} Members` : 'Members TBD'}
                          </span>
                          <ChevronRight size={16} className="text-[rgba(255,255,255,0.2)] group-hover:text-white transition-colors" />
                        </div>
                      </div>
                    </motion.button>
                  </ScrollReveal>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="detail"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {selectedTeam && (
                <>
                  <button
                    onClick={() => handleTeamClick(selectedTeam.slug)}
                    className="back-btn mb-6"
                  >
                    <ArrowLeft size={16} />
                    Back to Teams
                  </button>

                  <div className="bg-[#141414] rounded-2xl border border-[rgba(255,255,255,0.06)] overflow-hidden relative"
                    style={{
                      boxShadow: `0 0 60px ${selectedTeam.haloColor}08`,
                    }}
                  >
                    {/* Team header */}
                    <div className="relative p-8 lg:p-10" style={{ background: `linear-gradient(135deg, ${selectedTeam.haloColor}10, transparent)` }}>
                      {/* Cinematic glow */}
                      <div
                        className="absolute top-0 right-0 w-1/2 h-full pointer-events-none"
                        style={{
                          background: `radial-gradient(ellipse at 80% 30%, ${selectedTeam.haloColor}08 0%, transparent 70%)`,
                        }}
                      />

                      <h2 className="font-[var(--font-oswald)] text-white text-3xl lg:text-4xl font-bold uppercase mb-1 relative z-10">
                        {selectedTeam.name}
                      </h2>
                      <p className="text-sm mb-2 relative z-10" style={{ color: selectedTeam.haloColor }}>{selectedTeam.tagline}</p>
                      <p className="text-[rgba(255,255,255,0.4)] text-sm mb-1 relative z-10">Founded: {selectedTeam.foundedIn}</p>
                      <div className="mt-2 flex items-center gap-3 relative z-10">
                        <span
                          className="power-tier-badge"
                          style={{
                            color: selectedTeam.haloColor,
                            borderColor: selectedTeam.haloColor + '30',
                            backgroundColor: selectedTeam.haloColor + '10',
                          }}
                        >
                          <Users size={10} />
                          {getTeamMembers(selectedTeam.slug).length} known members
                        </span>
                        <ShareButton
                          title={`${selectedTeam.name} - MCU Teams`}
                          text={`Explore ${selectedTeam.name} on Marvel Universe Cinematic Guide`}
                          url={typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}#team/${selectedTeam.slug}` : ''}
                          haloColor={selectedTeam.haloColor}
                          ariaLabel={`Share ${selectedTeam.name} team`}
                          variant="icon"
                          size="sm"
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div className="p-8 border-t border-[rgba(255,255,255,0.06)]">
                      <p className="text-[rgba(255,255,255,0.5)] text-sm leading-[1.8]">{selectedTeam.description}</p>
                    </div>

                    {/* Members */}
                    {getTeamMembers(selectedTeam.slug).length > 0 && (
                      <div className="p-8 border-t border-[rgba(255,255,255,0.06)]">
                        <h3 className="font-[var(--font-oswald)] text-white text-lg font-bold uppercase mb-4">Known Members</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                          {getTeamMembers(selectedTeam.slug).map(char => (
                            <button
                              key={char.slug}
                              onClick={() => navigate({ type: 'character', slug: char.slug })}
                              className="flex items-center gap-2 p-3 bg-[#1A1A1A] rounded-lg border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.12)] transition-all duration-200 hover:translate-y-[-2px]"
                              style={{
                                boxShadow: 'none',
                              }}
                              onMouseEnter={(e) => {
                                (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 20px ${selectedTeam.haloColor}15`;
                              }}
                              onMouseLeave={(e) => {
                                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                              }}
                            >
                              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                                <img src={char.images.switcher} alt={char.name} className="w-full h-full object-cover" />
                              </div>
                              <span className="text-white text-xs font-medium truncate">{char.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Key Missions */}
                    <div className="p-8 border-t border-[rgba(255,255,255,0.06)]">
                      <h3 className="font-[var(--font-oswald)] text-white text-lg font-bold uppercase mb-4">Key Missions</h3>
                      <div className="space-y-3">
                        {selectedTeam.keyMissions.map((mission, i) => (
                          <div key={i} className="bg-[#1A1A1A] rounded-lg p-4 border border-[rgba(255,255,255,0.04)]">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-white text-sm font-medium">{mission.movie}</span>
                              <span className="text-[rgba(255,255,255,0.25)] text-xs">({mission.year})</span>
                            </div>
                            <p className="text-[rgba(255,255,255,0.4)] text-sm">{mission.event}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}
