'use client';

import { useState, useCallback, useMemo, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { getCharacterBySlug, type MCUCharacter } from '@/data/characters';

interface ConnectionWebProps {
  character: MCUCharacter;
  onNavigate: (slug: string) => void;
}

interface ConnectionNode {
  slug: string;
  name: string;
  haloColor: string;
  type: 'ally' | 'enemy';
  relationship: string;
  switcherImage: string;
  angle: number;
  distance: number;
  strength: number; // 1-3, determines line thickness
}

function getPhase(year: number): number {
  if (year <= 2012) return 1;
  if (year <= 2013) return 2;
  if (year <= 2015) return 3;
  if (year <= 2018) return 4;
  if (year <= 2019) return 5;
  return 6;
}

export default function ConnectionWeb({ character, onNavigate }: ConnectionWebProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const connections = useMemo(() => {
    const allConnections: { slug: string; relationship: string; type: 'ally' | 'enemy' }[] = [];
    character.allies.forEach(a => allConnections.push({ ...a, type: 'ally' }));
    character.enemies.forEach(e => allConnections.push({ ...e, type: 'enemy' }));

    // Place nodes in a circle around center, allies on left, enemies on right
    const allyCount = character.allies.length;
    const enemyCount = character.enemies.length;
    const total = allConnections.length;

    return allConnections.map((conn, i) => {
      const isAlly = conn.type === 'ally';
      const charData = getCharacterBySlug(conn.characterSlug);

      // Skip characters not in our database (e.g. ned-leeds, mj, pepper-potts, green-goblin)
      if (!charData) return null;

      // Distribute allies on the left arc, enemies on the right arc
      let angle: number;
      if (isAlly && allyCount > 0) {
        const allyIndex = character.allies.findIndex(a => a.characterSlug === conn.characterSlug);
        const baseAngle = 150; // start from upper-left
        const spread = allyCount > 1 ? 120 / (allyCount - 1) : 0;
        angle = baseAngle + allyIndex * spread;
      } else if (enemyCount > 0) {
        const enemyIndex = character.enemies.findIndex(e => e.characterSlug === conn.characterSlug);
        const baseAngle = -30; // start from upper-right
        const spread = enemyCount > 1 ? 120 / (enemyCount - 1) : 0;
        angle = baseAngle + enemyIndex * spread;
      } else {
        angle = (i / total) * 360;
      }

      // Convert to radians and set distance
      const angleRad = (angle * Math.PI) / 180;
      const distance = 160;

      return {
        slug: conn.characterSlug,
        name: charData?.name || conn.characterSlug,
        haloColor: charData?.haloColor || '#666',
        type: conn.type,
        relationship: conn.relationship || '',
        switcherImage: charData?.images.switcher || '',
        angle: angleRad,
        distance,
        strength: conn.relationship.includes('Best') || conn.relationship.includes('Ultimate') ? 3 :
                  conn.relationship.includes('Fellow') || conn.relationship.includes('Brother') ? 2 : 1,
      };
    });
  }, [character]);

  const svgSize = 500;
  const center = svgSize / 2;
  const centralRadius = 45;

  const handleNodeHover = useCallback((node: ConnectionNode, e: React.MouseEvent) => {
    setHoveredNode(node.slug);
    if (svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      setTooltipPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  }, []);

  const handleNodeLeave = useCallback(() => {
    setHoveredNode(null);
    setTooltipPos(null);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: svgSize, height: svgSize }}>
        <svg
          ref={svgRef}
          width={svgSize}
          height={svgSize}
          viewBox={`0 0 ${svgSize} ${svgSize}`}
          className="overflow-visible"
        >
          {/* Background ring */}
          <circle
            cx={center}
            cy={center}
            r={180}
            fill="none"
            stroke="rgba(255,255,255,0.03)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />

          {/* Connection lines */}
          {connections.filter(Boolean).map((node) => {
            const nodeX = center + Math.cos(node.angle) * node.distance;
            const nodeY = center + Math.sin(node.angle) * node.distance;
            const isHovered = hoveredNode === node.slug;
            const lineColor = node.type === 'ally' ? '#4CAF50' : '#f44336';
            const thickness = node.strength * (isHovered ? 2.5 : 1.5);

            return (
              <motion.line
                key={`${node.slug}-${node.type}`}
                x1={center}
                y1={center}
                x2={nodeX}
                y2={nodeY}
                stroke={lineColor}
                strokeWidth={thickness}
                strokeOpacity={isHovered ? 0.8 : 0.25}
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              />
            );
          })}

          {/* Connection nodes */}
          {connections.filter(Boolean).map((node, i) => {
            const nodeX = center + Math.cos(node.angle) * node.distance;
            const nodeY = center + Math.sin(node.angle) * node.distance;
            const nodeRadius = 22;
            const isHovered = hoveredNode === node.slug;

            return (
              <motion.g
                key={`${node.slug}-${node.type}`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
                style={{ transformOrigin: `${nodeX}px ${nodeY}px` }}
              >
                {/* Pulse ring */}
                <circle
                  cx={nodeX}
                  cy={nodeY}
                  r={nodeRadius + 4}
                  fill="none"
                  stroke={node.haloColor}
                  strokeWidth="1"
                  opacity={isHovered ? 0.5 : 0.15}
                  className={isHovered ? '' : 'connection-node-pulse'}
                  style={{ animationDelay: `${i * 0.3}s` }}
                />

                {/* Node background */}
                <circle
                  cx={nodeX}
                  cy={nodeY}
                  r={nodeRadius}
                  fill="#141414"
                  stroke={node.type === 'ally' ? '#4CAF50' : '#f44336'}
                  strokeWidth={isHovered ? 2.5 : 1.5}
                  opacity={isHovered ? 1 : 0.85}
                  style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                  onMouseEnter={(e) => handleNodeHover(node, e)}
                  onMouseLeave={handleNodeLeave}
                  onClick={() => node.slug && onNavigate(node.slug)}
                />

                {/* Avatar using clipPath */}
                <defs>
                  <clipPath id={`clip-${node.slug}-${node.type}`}>
                    <circle cx={nodeX} cy={nodeY} r={nodeRadius - 2} />
                  </clipPath>
                </defs>
                {node.switcherImage && (
                  <image
                    href={node.switcherImage}
                    x={nodeX - nodeRadius + 2}
                    y={nodeY - nodeRadius + 2}
                    width={(nodeRadius - 2) * 2}
                    height={(nodeRadius - 2) * 2}
                    clipPath={`url(#clip-${node.slug}-${node.type})`}
                    style={{ cursor: 'pointer', pointerEvents: 'none' }}
                    onMouseEnter={(e) => handleNodeHover(node, e)}
                    onMouseLeave={handleNodeLeave}
                  />
                )}

                {/* Initial fallback */}
                {!node.switcherImage && node.name && (
                  <text
                    x={nodeX}
                    y={nodeY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={node.haloColor}
                    fontSize="14"
                    fontWeight="bold"
                    style={{ pointerEvents: 'none' }}
                  >
                    {node.name.charAt(0)}
                  </text>
                )}
              </motion.g>
            );
          })}

          {/* Central node (current character) */}
          <motion.g
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: `${center}px ${center}px` }}
          >
            {/* Central glow */}
            <circle
              cx={center}
              cy={center}
              r={centralRadius + 10}
              fill="none"
              stroke={character.haloColor}
              strokeWidth="2"
              opacity={0.2}
              className="connection-node-pulse"
            />
            <circle
              cx={center}
              cy={center}
              r={centralRadius + 6}
              fill={character.haloColor}
              opacity={0.08}
            />

            {/* Central circle */}
            <circle
              cx={center}
              cy={center}
              r={centralRadius}
              fill="#141414"
              stroke={character.haloColor}
              strokeWidth="3"
            />

            {/* Central avatar */}
            <defs>
              <clipPath id="clip-central">
                <circle cx={center} cy={center} r={centralRadius - 2} />
              </clipPath>
            </defs>
            <image
              href={character.images.switcher}
              x={center - centralRadius + 2}
              y={center - centralRadius + 2}
              width={(centralRadius - 2) * 2}
              height={(centralRadius - 2) * 2}
              clipPath="url(#clip-central)"
            />

            {/* Name label under center */}
            <text
              x={center}
              y={center + centralRadius + 18}
              textAnchor="middle"
              fill="white"
              fontSize="11"
              fontWeight="bold"
              fontFamily="var(--font-oswald), sans-serif"
              letterSpacing="0.05em"
            >
              {character.name.toUpperCase()}
            </text>
          </motion.g>

          {/* Tooltip */}
          {hoveredNode && tooltipPos && (() => {
            const node = connections.find(n => n.slug === hoveredNode);
            if (!node) return null;
            return (
              <g>
                <rect
                  x={tooltipPos.x - 70}
                  y={tooltipPos.y - 48}
                  width={140}
                  height={40}
                  rx={6}
                  fill="#1A1A1A"
                  stroke={node.haloColor + '40'}
                  strokeWidth="1"
                />
                <text
                  x={tooltipPos.x}
                  y={tooltipPos.y - 32}
                  textAnchor="middle"
                  fill="white"
                  fontSize="11"
                  fontWeight="bold"
                >
                  {node.name}
                </text>
                <text
                  x={tooltipPos.x}
                  y={tooltipPos.y - 18}
                  textAnchor="middle"
                  fill={node.type === 'ally' ? '#4CAF50' : '#f44336'}
                  fontSize="9"
                >
                  {node.type.toUpperCase()} · {node.relationship}
                </text>
              </g>
            );
          })()}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-green-500 rounded" />
          <span className="text-[rgba(255,255,255,0.4)] text-xs">Ally</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-red-500 rounded" />
          <span className="text-[rgba(255,255,255,0.4)] text-xs">Enemy</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 rounded" style={{ background: 'rgba(255,255,255,0.2)' }} />
          <span className="text-[rgba(255,255,255,0.4)] text-xs">Strong</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-0.5 rounded" style={{ background: 'rgba(255,255,255,0.2)' }} />
          <span className="text-[rgba(255,255,255,0.4)] text-xs">Weak</span>
        </div>
      </div>
    </div>
  );
}

export { getPhase };
