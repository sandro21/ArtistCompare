import Info from "../components/Info";
import Streams from "../components/Streams";
import RiaaCertifications from "../components/RiaaCertifications";
import GlareHover from "../blocks/Animations/GlareHover/GlareHover";
import ShapeBlur from "../blocks/Animations/ShapeBlur/ShapeBlur";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-20 pt-20">
      <div style={{ position: 'relative', height: '500px', overflow: 'hidden', width: '100%' }}>
        <ShapeBlur
          variation={0}
          pixelRatioProp={typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1}
          shapeSize={0.5}
          roundness={0.5}
          borderSize={0.05}
          circleSize={0.5}
          circleEdge={1}
        />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <GlareHover
            glareColor="#ffffff"
            glareOpacity={0.3}
            glareAngle={-30}
            glareSize={300}
            transitionDuration={1200}
            playOnce={false}
            className="w-auto h-auto bg-transparent border-none"
            style={{ background: 'none', width: 'auto', height: 'auto', border: 'none', borderRadius: '1.5rem' }}
          >
            <Info />
          </GlareHover>
        </div>
      </div>
      <Streams />
      <RiaaCertifications />
    </div>
  );
}
