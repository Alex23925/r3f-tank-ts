import Head from 'next/head';
import '../styles/Home.scss';
import React, { useRef, useState, useMemo } from 'react';
import { Canvas, MeshProps, useFrame, useUpdate } from 'react-three-fiber';
import * as THREE from "three";
import type { BufferGeometry, Mesh } from 'three';

interface SplineProps {
  curve: THREE.SplineCurve,
}

function SplineC({ curve }: SplineProps) {

  const ref = useUpdate((bufferGeometry : BufferGeometry)  => {
    bufferGeometry.setFromPoints(curve.getPoints(50))
  }, [curve]);
  return (
    <line rotation-x={Math.PI * 0.5} position-y={0.05}>
      <bufferGeometry attach="geometry" ref={ref} />
      <lineBasicMaterial attach="material" color="blue" />
    </line>
  );
}

export default function Home() {

  let points = [
    [-10, 0],
    [-5, 5],
    [0, 0],
    [5, -5],
    [10, 0],
    [5, 10],
    [-5, 10],
    [-10, 10],
    [-15, -8],
    [-10, 0],
  ];

  const curve = useMemo(
    () => new THREE.SplineCurve(points.map((v) => new THREE.Vector2(...v))),
    [points]
  );

  return (
    <div className="container">
      <Canvas className="c">
        <SplineC
          curve={curve}
        />
      </Canvas>
    </div>
  )
}
