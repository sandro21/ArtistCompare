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
            id: 'taylor-swift-vs-charli-xcx',
            comparisionLink: '/compare/taylor-swift-vs-charli-xcx-bd8c91e8',
            ArtistA: {
                name: 'Taylor Swift',
                spotifyImage: 'https://i.scdn.co/image/ab6761610000e5ebe2e8e7ff002a4afda1c7147e'
            },
            ArtistB: {
                name: 'Charli XCX',
                spotifyImage: 'https://i.scdn.co/image/ab6761610000e5ebdaa727dd396963ba92dd6377'
            }
        },
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
            id: 'nle-choppa-vs-nba-youngboy',
            comparisionLink: '/compare/nle-choppa-vs-youngboy-never-broke-again-055d9ceb',
            ArtistA: {
                name: 'NLE Choppa',
                spotifyImage: 'https://i.scdn.co/image/ab6761610000e5ebe2c985e8509fc8788a5a5208'
            },
            ArtistB: {
                name: 'NBA YoungBoy',
                spotifyImage: 'https://i.scdn.co/image/ab6761610000e5eb776e469c846c205685141317'
            }
        },
        {
            id: 'cardi-b-vs-nicki-minaj',
            comparisionLink: '/compare/cardi-b-vs-nicki-minaj-94bb9875',
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
            id: 'tyler-the-creator-vs-playboi-carti',
            comparisionLink: '/compare/tyler-the-creator-vs-playboi-carti-a38b964a',
            ArtistA: {
                name: 'Tyler, The Creator',
                spotifyImage: 'https://i.scdn.co/image/ab6761610000e5ebdf2728294ff77dd11eeb18fb'
            },
            ArtistB: {
                name: 'Playboi Carti',
                spotifyImage: 'https://i.scdn.co/image/ab6761610000e5ebba50ca67ffc3097f6ea1710a'
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
                {comparisions.slice(0, 6).map((comparision) => (
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