"use client";

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

const Description = () => {
	return (
		<section
			className="w-full max-w-7xl mx-auto mt-4 sm:mt-8 px-4 sm:px-15 py-6 sm:py-11 rounded-2xl sm:rounded-[8rem] border border-emerald-400/50 relative"
			style={{
				background:
					"linear-gradient(180deg, rgba(0, 0, 0, 0.10) 0%, rgba(65, 147, 105, 0.25) 100%)",
				boxShadow: "0 0 25px -5px #419369 inset, 0 0 25px -5px #419369",
			}}
		>
			{/* Header */}
			<div className="text-center mb-6 sm:mb-10">
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

			{/* Features Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 text-center">
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
								boxShadow: "0 0 20px rgba(75, 226, 149, 0.4)",
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
		</section>
	);
};

export default Description;
