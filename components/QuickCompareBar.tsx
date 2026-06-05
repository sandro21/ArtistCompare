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
            id: 'drake-vs-jay-z',
            comparisionLink: '/compare/drake-vs-jay-z-a4e6e20e',
            ArtistA: {
                name: 'Drake',
                spotifyImage: 'https://i.scdn.co/image/ab6761610000e5eb4293385d324db8558179afd9'
            },
            ArtistB: {
                name: 'Jay-Z',
                spotifyImage: 'https://i.scdn.co/image/ab6761610000e5eb219724d177787df4dc9d8614'
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
            id: 'olivia-rodrigo-vs-sabrina-carpenter',
            comparisionLink: '/compare/olivia-rodrigo-vs-sabrina-carpenter-d3ab9b93',
            ArtistA: {
                name: 'Olivia Rodrigo',
                spotifyImage: 'https://i.scdn.co/image/ab6761610000e5ebe654806251e2661def1f4e65'
            },
            ArtistB: {
                name: 'Sabrina Carpenter',
                spotifyImage: 'https://i.scdn.co/image/ab6761610000e5eb78e45cfa4697ce3c437cb455'
            }
        },
        {
            id: 'cardi-b-vs-latto',
            comparisionLink: '/compare/cardi-b-vs-latto-75b720fe',
            ArtistA: {
                name: 'Cardi B',
                spotifyImage: 'https://i.scdn.co/image/ab6761610000e5eba23286f24edd4a7dbdc6311d'
            },
            ArtistB: {
                name: 'Latto',
                spotifyImage: 'https://i.scdn.co/image/ab6761610000e5eb2d805d9a367bdad2096ab817'
            }
        },
        {
            id: 'taylor-swift-vs-bad-bunny',
            comparisionLink: '/compare/taylor-swift-vs-bad-bunny-385fdc95',
            ArtistA: {
                name: 'Taylor Swift',
                spotifyImage: 'https://i.scdn.co/image/ab6761610000e5ebe2e8e7ff002a4afda1c7147e'
            },
            ArtistB: {
                name: 'Bad Bunny',
                spotifyImage: 'https://i.scdn.co/image/ab6761610000e5eb81f47f44084e0a09b5f0fa13'
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
                {comparisions.slice(0, 6).map((comparision, index) => (
                    <div
                        className={`cursor-pointer flex-shrink-0 ${index >= 4 ? 'hidden sm:block' : ''}`}
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