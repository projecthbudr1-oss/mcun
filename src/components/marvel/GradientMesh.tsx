'use client';

import { useMemo } from 'react';

interface GradientMeshProps {
  haloColor?: string;
}

export default function GradientMesh({ haloColor }: GradientMeshProps) {
  // Build CSS variable styles that adapt to the character's halo color
  const meshStyle = useMemo(() => {
    const primary = haloColor ? `${haloColor}18` : '#ED1D2418';
    const secondary = haloColor ? `${haloColor}08` : '#ED1D2408';
    return {
      '--mesh-primary': primary,
      '--mesh-secondary': secondary,
      '--mesh-tertiary': '#4527A008',
    } as React.CSSProperties;
  }, [haloColor]);

  return <div className="gradient-mesh" style={meshStyle} />;
}
