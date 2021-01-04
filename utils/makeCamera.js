import * as THREE from "three";

export default function makeCamera(fov = 40) {
    const aspect = 2;
    const zNear = 0.1;
    const zFar = 1000;
    return new THREE.PerspectiveCamera(fov, aspect, zNear, zFar);
}
