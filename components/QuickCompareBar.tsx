import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import QuickCompare from './QuickCompare';

interface ComparisionData {
    id: string;
    comparisionLink: string;
    ArtistA: {
        name: string;
        spotifyImage: string;
    };
    ArtistB: {
        name: string;
        spotifyImage: string;
    };
}

type SetterFn = (v: number | string) => void;

const QuickCompareBar: React.FC = () => {
    const rootRef = useRef<HTMLDivElement>(null);
    const fadeRef = useRef<HTMLDivElement>(null);
    const setX = useRef<SetterFn | null>(null);
    const setY = useRef<SetterFn | null>(null);
    const pos = useRef({ x: 0, y: 0 });

    const comparisions: ComparisionData[] = [
        {
            id: 'drake-vs-kendrick',
            comparisionLink: '/compare/drake-vs-kendrick-lamar-d15b7c84',
            ArtistA: {
                name: 'Drake',
                spotifyImage: 'https://i.scdn.co/image/ab6761610000e5eb4293385d324db8558179afd9'
            },
            ArtistB: {
                name: 'Kendrick Lamar',
                spotifyImage: 'https://i.scdn.co/image/ab6761610000e5eb39ba6dcd4355c03de0b50918'
            }
        },
        {
            id: 'young-thug-vs-gunna',
            comparisionLink: 'http://localhost:3000/compare/young-thug-vs-gunna-55b90ee8',
            ArtistA: {
                name: 'Young Thug',
                spotifyImage: 'https://i.scdn.co/image/ab6761610000e5eb9f2fb33940aac624dc5d100d'
            },
            ArtistB: {
                name: 'Gunna',
                spotifyImage: 'https://i.scdn.co/image/ab6761610000e5eba998bc86f87b9fe7e2466110'
            }
        },
        {
            id: 'taylor-swift-vs-kanye-west',
            comparisionLink: 'http://localhost:3000/compare/taylor-swift-vs-kanye-west-bb9cb9e0',
            ArtistA: {
                name: 'Taylor Swift',
                spotifyImage: 'https://i.scdn.co/image/ab6761610000e5ebe2e8e7ff002a4afda1c7147e'
            },
            ArtistB: {
                name: 'Kanye West',
                spotifyImage: 'https://i.scdn.co/image/ab6761610000e5eb6e835a500e791bf9c27a422a'
            }
        },
        {
            id: 'cardi-b-vs-nicki-minaj',
            comparisionLink: 'http://localhost:3000/compare/cardi-b-vs-nicki-minaj-94bb9875',
            ArtistA: {
                name: 'Cardi B',
                spotifyImage: 'https://i.scdn.co/image/ab6761610000e5eba23286f24edd4a7dbdc6311d'
            },
            ArtistB: {
                name: 'Nicki Minaj',
                spotifyImage: 'https://i.scdn.co/image/ab6761610000e5eb07a50f0a9a8f11e5a1102cbd'
            }
        },
        {
            id: '2pac-vs-biggie',
            comparisionLink: 'http://localhost:3000/compare/2pac-vs-the-notorious-big-8b4481f1',
            ArtistA: {
                name: '2Pac',
                spotifyImage: 'https://i.scdn.co/image/ab6761610000e5eb7f5cc432c9c109248ebec1ac'
            },
            ArtistB: {
                name: 'Biggie',
                spotifyImage: 'https://i.scdn.co/image/1b4858fbd24046a81cace5ee18d19c868262b91f'
            }
        },
    ];

    useEffect(() => {
        const el = rootRef.current;
        if (!el) return;
        setX.current = gsap.quickSetter(el, '--x', 'px') as SetterFn;
        setY.current = gsap.quickSetter(el, '--y', 'px') as SetterFn;
        const { width, height } = el.getBoundingClientRect();
        pos.current = { x: width / 2, y: height / 2 };
        setX.current(pos.current.x);
        setY.current(pos.current.y);
    }, []);

    const moveTo = (x: number, y: number) => {
        gsap.to(pos.current, {
            x,
            y,
            duration: 0.45,
            ease: 'power3.out',
            onUpdate: () => {
                setX.current?.(pos.current.x);
                setY.current?.(pos.current.y);
            },
            overwrite: true
        });
    };

    const handleMove = (e: React.PointerEvent) => {
        const r = rootRef.current!.getBoundingClientRect();
        moveTo(e.clientX - r.left, e.clientY - r.top);
        gsap.to(fadeRef.current, { opacity: 1, duration: 0.25, overwrite: true });
    };

    const handleLeave = () => {
        gsap.to(fadeRef.current, {
            opacity: 0,
            duration: 0.6,
            overwrite: true
        });
    };

    return (
        <div
            ref={rootRef}
            onPointerMove={handleMove}
            onPointerLeave={handleLeave}
            className="max-w-max flex flex-col gap-1 sm:gap-2 bg-[#0D110F]/80 backdrop-blur-md border border-[#23322D] rounded-4xl px-3 sm:px-4 md:px-5 pt-2 sm:pt-3 pb-3 sm:pb-4 md:pb-5 gap-2 sm:gap-3 relative transition-transform duration-500 ease-out hover:scale-105"
            style={
                {
                    '--r': '150px',
                    '--x': '50%',
                    '--y': '50%',
                    'width': 'max-content'
                } as React.CSSProperties
            }
        >
            <p className="text-white text-lg font-semibold text-center">Popular Matchups</p>
            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3 md:gap-4 sm:items-center">
                {comparisions.slice(0, typeof window !== 'undefined' && window.innerWidth < 640 ? 4 : 5).map((comparision) => (
                    <div
                        className="cursor-pointer flex-shrink-0"
                        key={comparision.id}
                        onClick={() => {
                            window.location.href = comparision.comparisionLink;
                        }}
                    >
                        <QuickCompare 
                            artistAImage={comparision.ArtistA.spotifyImage}
                            artistBImage={comparision.ArtistB.spotifyImage}
                            comparisonTitle={`${comparision.ArtistA.name} vs ${comparision.ArtistB.name}`}
                        />
                    </div>
                ))}
            </div>
            
            <div
                ref={fadeRef}
                className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-40"
                style={{
                    backdropFilter: 'hue-rotate(120deg) saturate(1.5) brightness(1.1)',
                    WebkitBackdropFilter: 'hue-rotate(120deg) saturate(1.5) brightness(1.1)',
                    background: 'rgba(0,0,0,0.001)',
                    maskImage: 'radial-gradient(circle var(--r) at var(--x) var(--y), white 0%, transparent 70%)',
                    WebkitMaskImage: 'radial-gradient(circle var(--r) at var(--x) var(--y), white 0%, transparent 70%)',
                    opacity: 0
                }}
            />
        </div>
    );
};

export default QuickCompareBar;