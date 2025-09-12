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
			className="w-[95%] mx-auto mt-5 pb-4 pt-3 px-0 sm:mt-8 sm:px-15 sm:py-11 rounded-4xl sm:rounded-[8rem] border border-emerald-400/100 relative"
			style={{
				background:
					"linear-gradient(180deg, rgba(0, 0, 0, 0.10) 0%, rgba(64, 167, 114, 0.25) 100%)",
				boxShadow: "none",
			}}
		>
			{/* Desktop/Tablet content only */}
			<div className="hidden sm:block text-center mb-6 sm:mb-10">
				<h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-white leading-tight">
					Battle Your Favorite{" "}
					<span className="text-lg sm:text-2xl font-light text-red-500 italic">
						(and least favorite)
					</span>{" "}
					Artists
				</h2>
				<p className="text-sm sm:text-lg text-gray-300 max-w-5xl mx-auto mt-2 sm:mt-4 font-medium px-2">
					Go beyond opinions. Use real-time data to see how your favorite
					artists truly measure up in terms of statistics.
				</p>
			</div>

			{/* Features Grid (desktop/tablet only) */}
			<div className="hidden sm:grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 text-center">
				{features.map((feature) => (
					<div
						key={feature.title}
						className="py-4 sm:py-6 rounded-2xl sm:rounded-[4rem] border border-emerald-400/30 transition-all duration-300 hover:scale-105 hover:border-emerald-400/60 hover:bg-emerald-900/20"
						style={{
							background: "rgba(0,0,0,0.2)",
						}}
					>
						<div
							style={{
								width: "3rem",
								height: "3rem",
								borderRadius: "10rem",
								background:
									"linear-gradient(135deg, #4BE295 0%, #419369 100%)",
								boxShadow: "none",
							}}
							className="mx-auto flex items-center justify-center mb-3 sm:mb-5"
						>
							<span className="text-white font-bold text-lg sm:text-2xl">
								{feature.icon}
							</span>
						</div>
						<h3 className="font-bold text-base sm:text-xl text-white mb-2 sm:mb-3 px-2">
							<span className="sm:hidden">{feature.short}</span>
							<span className="hidden sm:inline">{feature.title}</span>
						</h3>
					</div>
				))}
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
							onClick={() => onBattleClick?.("Nicki Minaj", "SZA")}
							className="w-1/2 bg-emerald-700 text-white px-3 py-3 rounded-full text-xs font-semibold shadow-lg hover:bg-emerald-400 hover:scale-105 transition-all duration-200 cursor-pointer active:scale-95 text-center"
						>
							Nicki Minaj vs SZA
						</button>
						<button 
							onClick={() => onBattleClick?.("Ice Spice", "Latto")}
							className="w-1/2 bg-emerald-700 text-white px-3 py-3 rounded-full text-xs font-semibold shadow-lg hover:bg-emerald-400 hover:scale-105 transition-all duration-200 cursor-pointer active:scale-95 text-center"
						>
							Ice Spice vs Latto
						</button>
					</div>
					<div className="flex gap-2">
						<button 
							onClick={() => onBattleClick?.("Pusha T", "Travis Scott")}
							className="w-1/2 bg-emerald-700 text-white px-3 py-3 rounded-full text-xs font-semibold shadow-lg hover:bg-emerald-400 hover:scale-105 transition-all duration-200 cursor-pointer active:scale-95 text-center"
						>
							Pusha T vs Travis Scott
						</button>
						<button 
							onClick={() => onBattleClick?.("Taylor Swift", "Beyoncé")}
							className="w-1/2 bg-emerald-700 text-white px-3 py-3 rounded-full text-xs font-semibold shadow-lg hover:bg-emerald-400 hover:scale-105 transition-all duration-200 cursor-pointer active:scale-95 text-center"
						>
							Taylor Swift vs Beyoncé
						</button>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Description;
