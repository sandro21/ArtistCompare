import Info from "../components/Info";
import Streams from "../components/Streams";
import RiaaCertifications from "../components/RiaaCertifications";
import Charts from "../components/Charts";
import Awards from "../components/Awards";
import GlareHover from "../blocks/Animations/GlareHover/GlareHover";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-20 py-20">
      <GlareHover
        glareColor="#ffffff"
        glareOpacity={0.3}
        glareAngle={-30}
        glareSize={400}
        transitionDuration={1200}
        playOnce={false}
        className="w-auto h-auto bg-transparent border-none"
        style={{ background: 'none', width: 'auto', height: 'auto', border: 'none', borderRadius: '1.5rem' }}
      >
        <Info />
      </GlareHover>
      <Streams />
      <Charts />
      <Awards />
      <RiaaCertifications />
    </div>
  );
}
