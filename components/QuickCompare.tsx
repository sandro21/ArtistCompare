interface QuickCompareProps {
    artistAImage: string;
    artistBImage: string;
    comparisonTitle: string;
}

const QuickCompare: React.FC<QuickCompareProps> = ({ artistAImage, artistBImage, comparisonTitle }) => {
    return (
        <div className="bg-[#5EE9B5]/23 p-2 border border-[#5EE9B5] rounded-2xl flex gap-1.5">
            <div className="h-20 w-20 rounded-xl drop-shadow-md drop-shadow-black/50 overflow-hidden">
                <img src={artistAImage} className="w-full h-full object-cover " />
            </div>
            <div className="h-20 w-20 rounded-xl drop-shadow-md drop-shadow-black/50 overflow-hidden">
                <img src={artistBImage} className="w-full h-full object-cover " />
            </div>
        </div>
    );
};

export default QuickCompare;