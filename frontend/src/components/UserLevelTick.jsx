import React, { useEffect, useState } from 'react';
import API from '../API/api';

const UserLevelTick = ({ level, size = 20 }) => {
    const [settings, setSettings] = useState(null);
    const [tickColor, setTickColor] = useState('#000000');

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await API.get('/learning/settings');
                setSettings(res.data);
            } catch (err) {
                console.error("Error fetching settings", err);
            }
        };
        fetchSettings();
    }, []);

    useEffect(() => {
        if (settings && settings.levelRanges) {
            const range = settings.levelRanges.find(r => level >= r.minLevel && level <= r.maxLevel);
            if (range) {
                setTickColor(range.tickColor);
            }
        }
    }, [settings, level]);

    return (
        <div 
            style={{ 
                width: size, 
                height: size, 
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
            }}
            title={`Level ${level}`}
        >
            <img 
                src="/verify.png" 
                alt="Verified" 
                style={{ 
                    width: '100%', 
                    height: '100%',
                    filter: `drop-shadow(0px 0px 0px ${tickColor}) brightness(0) saturate(100%) invert(1)` 
                    // This is a tricky way to color a PNG. 
                    // A better way is using CSS mask or SVG. 
                    // Since it's a black PNG, we can use brightness(0) to make it pure black, 
                    // then invert/sepia/etc or just use a color overlay.
                    // Let's try simpler:
                }}
            />
            <div 
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: tickColor,
                    maskImage: 'url(/verify.png)',
                    maskSize: 'contain',
                    maskRepeat: 'no-repeat',
                    WebkitMaskImage: 'url(/verify.png)',
                    WebkitMaskSize: 'contain',
                    WebkitMaskRepeat: 'no-repeat',
                }}
            />
        </div>
    );
};

export default UserLevelTick;
