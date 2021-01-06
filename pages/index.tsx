import Head from 'next/head';
import '../styles/Home.scss';
import dynamic from "next/dynamic";
import React, { useRef, useState, useMemo, MutableRefObject } from 'react';
import { Canvas, MeshProps, useFrame, useUpdate } from 'react-three-fiber';
import * as THREE from "three";
import type { BufferGeometry, Mesh } from 'three';
import makeCamera from "../utils/makeCamera";
import { type } from 'os';

const Lights = dynamic(() => import("../components/Lights"));
const Ground = dynamic(() => import("../components/Ground"));
const Tank = dynamic(() => import("../components/Tank"));
const Target = dynamic(() => import("../components/Target"));

interface SplineProps {
  curve: THREE.SplineCurve,
}

interface setTRefFunc {
  (tRef: MutableRefObject<Mesh>): void;
}

function SplineC({ curve }: SplineProps) {

  const ref = useUpdate((bufferGeometry: BufferGeometry) => {
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
  
  const [targetRef, setTargetRef] = useState<MutableRefObject<Mesh>>();

  let tRef = useRef<Mesh>();

  let setTurretRef : setTRefFunc;
  setTurretRef = function (meshRef) {
    tRef = meshRef;
  }

  const TankCameraFov = 75;
  const tankCamera = makeCamera(TankCameraFov);

  return (
    <div className="container">
      <Canvas
        shadowMap
        camera={{ position: [-10, 10, 25], fov: 90 }}
        className="c">
        <Lights />
        <Ground />
        <Tank targetRef={targetRef} />
        <Target setTargetRef={setTargetRef} tRef={tRef} />
        <SplineC
          curve={curve}
        />
      </Canvas>
    </div>
  )
}
