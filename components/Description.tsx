"use client";

interface DescriptionProps {
  onBattleClick?: (artist1: string, artist2: string) => void;
}

const features = [
	{
		title: "Real-Time Stream Counts",
		icon: "♪",
		short: "Streams",
	},
	{
		title: "Official Chart Rankings",
		icon: "#",
		short: "Charts",
	},
	{
		title: "Certified Sales & Awards",
		icon: "★",
		short: "Awards",
	},
];

const Description = ({ onBattleClick }: DescriptionProps) => {
	return (
		<section
			className="w-[95%] mx-auto mt-5 pb-4 pt-3 px-0  sm:px-15 sm:w-[70%] sm:py-8 rounded-4xl sm:rounded-[6rem] border border-emerald-400/100 relative"
			style={{
				background:
					"linear-gradient(180deg, rgba(0, 0, 0, 0.10) 0%, rgba(64, 167, 114, 0.25) 100%)",
				boxShadow: "none",
			}}
		>
			{/* Desktop/Tablet additional content */}
			<div className="hidden sm:block text-center mb-8">
				<h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
					Compare Music Artists with Detailed Statistics
				</h2>
				<p className="text-base sm:text-lg text-gray-300 max-w-5xl mx-auto font-medium px-2">
					Get comprehensive comparisons of your favorite artists including Billboard charts, Grammy awards, RIAA certifications, and Spotify streaming data.
				</p>
			</div>

			{/* Desktop/Tablet features grid */}
			<div className="hidden sm:block w-full mb-8">
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
					<div className="py-3 sm:py-4 rounded-2xl sm:rounded-[4rem] border border-emerald-400/30 cursor-pointer" 
						 style={{ background: "rgba(0,0,0,0.4)" }}>
						<div className="text-white font-bold text-base sm:text-lg px-4 mb-2">Streaming Data</div>
						<div className="text-gray-300 text-sm sm:text-base px-4">
							Compare Spotify streams, monthly listeners, and popularity
						</div>
					</div>
					<div className="py-3 sm:py-4 rounded-2xl sm:rounded-[4rem] border border-emerald-400/30 cursor-pointer" 
						 style={{ background: "rgba(0,0,0,0.4)" }}>
						<div className="text-white font-bold text-base sm:text-lg px-4 mb-2">Billboard Charts</div>
						<div className="text-gray-300 text-sm sm:text-base px-4">
							Compare Hot 100 hits, album sales, and chart performance
						</div>
					</div>
					<div className="py-3 sm:py-4 rounded-2xl sm:rounded-[4rem] border border-emerald-400/30 cursor-pointer" 
						 style={{ background: "rgba(0,0,0,0.4)" }}>
						<div className="text-white font-bold text-base sm:text-lg px-4 mb-2">Awards & Recognition</div>
						<div className="text-gray-300 text-sm sm:text-base px-4">
							View Grammy wins, nominations, and RIAA certifications
						</div>
					</div>
				</div>
			</div>

			{/* Desktop/Tablet trending battles section */}
			<div className="hidden sm:block w-full h-full flex flex-col px-4 background-color: rgba(255, 0, 0, 0.2);">
				<h3 className="text-3xl font-medium text-white mb-6 mt-14 text-center drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">Trending Comparisions</h3>
				<div className="grid grid-cols-2 lg:grid-cols-3 gap-4 text-center lg:background-color: rgba(255, 0, 0, 0.2); max-w-4xl mx-auto">
				<div className="py-2 sm:py-3 rounded-2xl sm:rounded-[4rem] bg-emerald-700 transition-all duration-300 hover:scale-105 hover:bg-emerald-300 shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)]">
					<button 
						onClick={() => onBattleClick?.("Young Thug", "Gunna")}
						className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
					>
						<div className="text-white font-bold text-sm sm:text-lg px-2 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
							Young Thug vs Gunna
						</div>
					</button>
				</div>
				<div className="py-2 sm:py-3 rounded-2xl sm:rounded-[4rem] bg-emerald-700 transition-all duration-300 hover:scale-105 hover:bg-emerald-300 shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)]">
					<button 
						onClick={() => onBattleClick?.("Drake", "Kendrick Lamar")}
						className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
					>
						<div className="text-white font-bold text-sm sm:text-lg px-2 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
							Drake vs Kendrick Lamar
						</div>
					</button>
				</div>
				<div className="py-2 sm:py-3 rounded-2xl sm:rounded-[4rem] bg-emerald-700 transition-all duration-300 hover:scale-105 hover:bg-emerald-300 shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)]">
					<button 
						onClick={() => onBattleClick?.("2Pac", "Biggie")}
						className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
					>
						<div className="text-white font-bold text-sm sm:text-lg px-2 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
							2Pac vs Biggie
						</div>
					</button>
				</div>
				<div className="py-2 sm:py-3 rounded-2xl sm:rounded-[4rem] bg-emerald-700 transition-all duration-300 hover:scale-105 hover:bg-emerald-300 shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)]">
					<button 
						onClick={() => onBattleClick?.("Nicki Minaj", "Cardi B")}
						className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
					>
						<div className="text-white font-bold text-sm sm:text-lg px-2 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
							Nicki Minaj vs Cardi B
						</div>
					</button>
				</div>
				<div className="py-2 sm:py-3 rounded-2xl sm:rounded-[4rem] bg-emerald-700 transition-all duration-300 hover:scale-105 hover:bg-emerald-300 shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)]">
					<button 
						onClick={() => onBattleClick?.("Prince", "Michael Jackson")}
						className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
					>
						<div className="text-white font-bold text-sm sm:text-lg px-2 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
							Prince vs Michael Jackson
						</div>
					</button>
				</div>
				<div className="py-2 sm:py-3 rounded-2xl sm:rounded-[4rem] bg-emerald-700 transition-all duration-300 hover:scale-105 hover:bg-emerald-300 shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)]">
					<button 
						onClick={() => onBattleClick?.("Kanye West", "Taylor Swift")}
						className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
					>
						<div className="text-white font-bold text-sm sm:text-lg px-2 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
							Kanye West vs Taylor Swift
						</div>
					</button>
				</div>
				</div>
			</div>

			{/* Mobile-only trending battles section */}
			<div className="sm:hidden w-full h-full flex flex-col px-4">
				<h3 className="text-lg font-bold text-white mb-4 text-center">Trending Battles</h3>
				<div className="flex flex-col gap-3 flex-1">
					<div className="flex gap-2">
						<button 
							onClick={() => onBattleClick?.("Young Thug", "Gunna")}
							className="w-1/2 bg-emerald-700 text-white px-3 py-3 rounded-full text-xs font-semibold shadow-lg hover:bg-emerald-300 hover:scale-105 transition-all duration-200 cursor-pointer active:scale-95 text-center"
						>
							Young Thug vs Gunna
						</button>
						<button 
							onClick={() => onBattleClick?.("Drake", "Kendrick Lamar")}
							className="w-1/2 bg-emerald-700 text-white px-3 py-3 rounded-full text-xs font-semibold shadow-lg hover:bg-emerald-400 hover:scale-105 transition-all duration-200 cursor-pointer active:scale-95 text-center"
						>
							Drake vs Kendrick Lamar
						</button>
					</div>
					<div className="flex gap-2">
						<button 
							onClick={() => onBattleClick?.("2Pac", "Biggie")}
							className="w-1/2 bg-emerald-700 text-white px-3 py-3 rounded-full text-xs font-semibold shadow-lg hover:bg-emerald-400 hover:scale-105 transition-all duration-200 cursor-pointer active:scale-95 text-center"
						>
							2Pac vs Biggie
						</button>
						<button 
							onClick={() => onBattleClick?.("Nicki Minaj", "Cardi B")}
							className="w-1/2 bg-emerald-700 text-white px-3 py-3 rounded-full text-xs font-semibold shadow-lg hover:bg-emerald-400 hover:scale-105 transition-all duration-200 cursor-pointer active:scale-95 text-center"
						>
							Nicki Minaj vs Cardi B
						</button>
					</div>
					<div className="flex gap-2">
						<button 
							onClick={() => onBattleClick?.("Prince", "Michael Jackson")}
							className="w-1/2 bg-emerald-700 text-white px-3 py-3 rounded-full text-xs font-semibold shadow-lg hover:bg-emerald-400 hover:scale-105 transition-all duration-200 cursor-pointer active:scale-95 text-center"
						>
							Prince vs Michael Jackson
						</button>
						<button 
							onClick={() => onBattleClick?.("Kanye West", "Taylor Swift")}
							className="w-1/2 bg-emerald-700 text-white px-3 py-3 rounded-full text-xs font-semibold shadow-lg hover:bg-emerald-400 hover:scale-105 transition-all duration-200 cursor-pointer active:scale-95 text-center"
						>
							Kanye West vs Taylor Swift
						</button>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Description;
