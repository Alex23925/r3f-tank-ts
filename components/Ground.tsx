export default function Ground() {
    return (
        <>
            <mesh rotation-x={Math.PI * -.5}>
                <planeBufferGeometry args={[50, 50]} />
                <meshPhongMaterial color={0xCC8866} />
            </mesh>
        </>
    )
}