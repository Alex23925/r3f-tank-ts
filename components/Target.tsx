import dynamic from "next/dynamic";
import { Canvas, useThree, useFrame } from "react-three-fiber";
import { useEffect, useRef, useState, useMemo, ReactNode, Dispatch, MutableRefObject } from "react";
import * as THREE from "three";
import type { Mesh, Geometry, BufferGeometry,MeshLambertMaterial, Material, Object3D } from 'three';
import makeCamera from "../utils/makeCamera";
import { Pass } from "three/examples/jsm/postprocessing/Pass";

interface PassingNodesProps {
    children: ReactNode;
}

interface TargetCameraPivotProps {
    children: ReactNode;
    camera: THREE.PerspectiveCamera;
}

interface TargetProps {
    // setTargetRef: Dispatch<MutableRefObject<Mesh>>;
    setTargetRef: Function;
    tRef: MutableRefObject<Mesh | undefined>
}

const TargetOrbit = ({ children } : PassingNodesProps) => {
    const objRef = useRef<Mesh>();
    useFrame((state) => {
        let time = state.clock.getElapsedTime();
        if(objRef?.current) {
            objRef.current.rotation.y = time * 0.27;
        }
    });
    return <object3D ref={objRef}>{children}</object3D>;
};

const TargetElevation = ({ children } : PassingNodesProps) => {
    return <object3D>{children}</object3D>;
};

const TargetBob = ({ children } : PassingNodesProps) => {
    const objRef = useRef<Object3D>();

    useFrame((state) => {
        let time = state.clock.getElapsedTime();
        if(objRef?.current){
            objRef.current.position.y = Math.sin(time * 2) * 2;
        }
    });

    return <object3D ref={objRef}>{children}</object3D>;
};

// const TrgtCameraPivot = ({ camera} : TargetCameraPivotProps) => {
//     return <object3D>{children}</object3D>;
// };

export default function Target({setTargetRef, tRef} : TargetProps) {
    const carLength = 8;

    const meshRef = useRef<Mesh>();

    setTargetRef(meshRef);
    // Argument of type 'MutableRefObject<Mesh<Geometry | BufferGeometry, Material | Material[]> | undefined>' is not assignable to parameter of type 'MutableRefObject<Mesh<Geometry | BufferGeometry, Material | Material[]>>'.
    // Type 'Mesh<Geometry | BufferGeometry, Material | Material[]> | undefined' is not assignable to type 'Mesh<Geometry | BufferGeometry, Material | Material[]>'.
    //     Type 'undefined' is not assignable to type 'Mesh<Geometry | BufferGeometry, Material | Material[]>'
    tRef = meshRef;

    const matRef = useRef<MeshLambertMaterial>();

    useFrame((state) => {
        let time = state.clock.getElapsedTime();
        if(meshRef?.current){
            meshRef.current.rotation.x = time * 7;
            meshRef.current.rotation.y = time * 13;
        }

        if(matRef?.current){
         matRef.current.emissive.setHSL((time * 10) % 1, 1, 0.25);
         matRef.current.color.setHSL((time * 10) % 1, 1, 0.25);
        }
    });
    const targetGeo = <sphereBufferGeometry args={[0.5, 6, 3]} />;
    const targetMat = (
        <meshPhongMaterial ref={matRef} color={0x00ff00} flatShading={true} />
    );
    const targetMesh = (
        <mesh ref={meshRef}>
            {targetGeo}
            {targetMat}
        </mesh>
    );
    // target Camera
    const targetCamera = makeCamera();
    targetCamera.position.y = 1;
    targetCamera.position.z = -2;
    targetCamera.position.y = Math.PI;

    return (
        <group position-z={carLength * 2} position-y={8}>
            <TargetOrbit>
                <TargetElevation>
                    <TargetBob>
                        {/* <TrgtCameraPivot camera={targetCamera} /> */}
                        {targetMesh}
                    </TargetBob>
                </TargetElevation>
            </TargetOrbit>
        </group>
    );
}
