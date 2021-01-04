export default function Lights() {
    const d = 50;
    return (
        <>
            <group>
                <directionalLight
                    args={[0xFFFFFF, 1]}
                    castShadow={true}
                    position={[0, 20, 0]}
                    shadow-mapSize-width={2048}
                    shadow-mapSize-height={2048}
                    shadow-camera-left={-d}
                    shadow-camera-right={d}
                    shadow-camera-top={d}
                    shadow-camera-bottom={-d}
                    shadow-camera-near={1}
                    shadow-camera-far={50}
                    shadow-bias={.001}
                />

                <directionalLight
                    position={[1, 2, 4]}
                />
            </group>
        </>
    );
}
