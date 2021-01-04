import dynamic from "next/dynamic";
import { Canvas, useThree, useFrame } from "react-three-fiber";
import { FunctionComponent, ReactNode, useEffect, useRef, useState, useMemo, Dispatch, MutableRefObject } from "react";
import * as THREE from "three";
import makeCamera from "../utils/makeCamera";
import type { Mesh, Object3D } from 'three';
import getTargetRef from "./Target";

const targetPosition = new THREE.Vector3();
const tankPosition = new THREE.Vector2();
const tankTarget = new THREE.Vector2();

interface TnkProps {
    children: ReactNode;
}

interface TurretPivotProps {
    children: ReactNode;
    setTurretPivRef: Dispatch<ReactNode>;
}

interface TankProps {
    targetRef: MutableRefObject<Mesh> | undefined;
}

const Tnk: FunctionComponent<TnkProps> = ({ children }) => {
    const tankRef = useRef<Object3D>();
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

    useFrame((state) => {
        const tankTime = state.clock.getElapsedTime() * 0.05;
        curve.getPointAt(tankTime % 1, tankPosition);
        curve.getPointAt((tankTime + 0.01) % 1, tankTarget);
        if (tankRef.current) {
            tankRef.current.position.set(tankPosition.x, 0, tankPosition.y);
            tankRef.current.lookAt(tankTarget.x, 0, tankTarget.y);
        }
    });

    return <object3D ref={tankRef}>{children}</object3D>;
};

const TurretPivot = ({ setTurretPivRef, children }: TurretPivotProps) => {
    const objRef = useRef();
    setTurretPivRef(objRef);

    return (
        <object3D ref={objRef} position-y={0.5} scale={[5, 5, 5]}>
            {children}
        </object3D>
    );
};

export default function Tank({ targetRef }: TankProps) {
    const [turretPivRef, setTurretPivRef] = useState<MutableRefObject<Mesh>>();

    const bodyRef = useRef<Mesh>();
    const wheelRefs = [useRef<Mesh>(), useRef<Mesh>(), useRef<Mesh>(), useRef<Mesh>(), useRef<Mesh>(), useRef<Mesh>(),];

    const carWidth = 4;
    const carHeight = 1;
    const carLength = 8;

    const TankCameraFov = 75;
    const tankCamera = makeCamera(TankCameraFov);

    tankCamera.position.y = 3;
    tankCamera.position.z = -6;
    tankCamera.rotation.y = Math.PI;

    // WHEELS
    const wheelRadius = 1;
    const wheelThickness = 0.5;
    const wheelSegments = 6;
    const wheelPositions = [
        [-carWidth / 2 - wheelThickness / 2, -carHeight / 2, carLength / 3],
        [carWidth / 2 + wheelThickness / 2, -carHeight / 2, carLength / 3],
        [-carWidth / 2 - wheelThickness / 2, -carHeight / 2, 0],
        [carWidth / 2 + wheelThickness / 2, -carHeight / 2, 0],
        [-carWidth / 2 - wheelThickness / 2, -carHeight / 2, -carLength / 3],
        [carWidth / 2 + wheelThickness / 2, -carHeight / 2, -carLength / 3],
    ];
    const wheelGeo = (
        <cylinderBufferGeometry
            args={[wheelRadius, wheelRadius, wheelThickness, wheelSegments]}
        />
    );

    const wheelMat = <meshPhongMaterial color={0x888888} />;

    let c = 0;
    const wheelMeshes = wheelPositions.map((position) => {
        const mesh = (
            <mesh
                ref={wheelRefs[c]}
                position={[...position]}
                rotation-z={Math.PI * 0.5}
                castShadow={true}
            >
                {wheelGeo}
                {wheelMat}
            </mesh>
        )
        c += 1;
        return mesh;
    });

    useFrame((state) => {
        let time = state.clock.getElapsedTime();
        wheelRefs.forEach((obj) => {
            if (obj.current) {
                obj.current.rotation.x = time * 3;
            }
        });
        if (targetRef?.current) {
            targetRef.current.getWorldPosition(targetPosition);
        }
        if (turretPivRef) {
            turretPivRef.current.lookAt(targetPosition);
        }
    });

    // DOME
    const domeRadius = 2;
    const domeWidthSubdivisions = 12;
    const domeHeightSubdivisions = 12;
    const domePhiStart = 0;
    const domePhiEnd = Math.PI * 2;
    const domeThetaStart = 0;
    const domeThetaEnd = Math.PI * 0.5;
    const domeGeo = (
        <sphereBufferGeometry
            args={[
                domeRadius,
                domeWidthSubdivisions,
                domeHeightSubdivisions,
                domePhiStart,
                domePhiEnd,
                domeThetaStart,
                domeThetaEnd,
            ]}
        />
    );
    const domMat = <meshPhongMaterial color={0x6688aa} />;
    const domMesh = (
        <mesh castShadow={true} position-y={0.5}>
            {domeGeo}
            {domMat}
        </mesh>
    );

    // TURRET
    const turretWidth = 0.1;
    const turretHeight = 0.1;
    const turretLength = carLength * 0.75 * 0.2;
    const turretGeo = (
        <boxBufferGeometry args={[turretWidth, turretHeight, turretLength]} />
    );
    const turretMat = <meshPhongMaterial color={0x6688aa} />;

    const turretCamera = makeCamera();
    turretCamera.position.y = 0.75 * 0.2;

    const turretMesh = (
        <mesh
            camera={turretCamera}
            castShadow={true}
            position-z={turretLength * 0.5}
        >
            {turretGeo}
            {turretMat}
        </mesh>
    );

    return (
        <Tnk>
            <mesh
                ref={bodyRef}
                camera={tankCamera}
                castShadow={true}
                position-y={1.4}
            >
                <boxBufferGeometry args={[carWidth, carHeight, carLength]} />
                <meshPhongMaterial color={0x6688aa} />
                {domMesh}
                {wheelMeshes}
                <TurretPivot setTurretPivRef={setTurretPivRef}>{turretMesh}</TurretPivot>
            </mesh>
        </Tnk>
    );
}
