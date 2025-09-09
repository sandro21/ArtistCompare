"use client";

const features = [
	{
		title: "Real-Time Stream Counts",
		icon: "♪",
	},
	{
		title: "Official Chart Rankings",
		icon: "#",
	},
	{
		title: "Certified Sales & Awards",
		icon: "★",
	},
];

const Description = () => {
	return (
		   <section
			   className="w-full max-w-7xl mt-4 mb-0 px-15 py-11 rounded-[8rem] border border-emerald-400/50"
			   style={{
				   position: "absolute",
				   left: 0,
				   right: 0,
				   bottom: 70,
				   margin: "0 auto",
				   background:
					   "linear-gradient(180deg, rgba(0, 0, 0, 0.10) 0%, rgba(65, 147, 105, 0.25) 100%)",
				   boxShadow: "0 0 25px -5px #419369 inset, 0 0 25px -5px #419369",
			   }}
		   >
			<div className="text-center mb-10">
				<h2 className="text-3xl md:text-4xl font-bold text-white">
					Battle Your Favorite{" "}
					<span className="text-2xl font-light text-red-500 italic">
						(and least favorite)
					</span>{" "}
					Artists
				</h2>
				<p className="text-lg text-gray-300 max-w-5xl mx-auto mt-4 font-medium">
					Go beyond opinions. Use real-time data to see how your favorite
					artists truly measure up in terms of statistics.
				</p>
			</div>

			<div className="grid md:grid-cols-3 gap-8 text-center">
				{features.map((feature) => (
					<div
						key={feature.title}
						className="py-6 rounded-[4rem] border border-emerald-400/30 transition-all duration-300 hover:scale-105 hover:border-emerald-400/60 hover:bg-emerald-900/20"
						style={{
							background: "rgba(0,0,0,0.2)",
						}}
					>
						<div
							style={{
								width: "4rem",
								height: "4rem",
								borderRadius: "10rem",
								background:
									"linear-gradient(135deg, #4BE295 0%, #419369 100%)",
								boxShadow: "0 0 20px rgba(75, 226, 149, 0.4)",
							}}
							className="mx-auto flex items-center justify-center mb-5"
						>
							<span className="text-white font-bold text-2xl">
								{feature.icon}
							</span>
						</div>
						<h3 className="font-bold text-xl text-white mb-3">
							{feature.title}
						</h3>
					</div>
				))}
			</div>
		</section>
	);
};

export default Description;
