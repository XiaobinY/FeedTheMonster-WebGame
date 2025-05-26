import Tone from './tone-shim.js'; // Changed import statement

let flipSound, boopSound, chimeSound;

export async function initializeAudio() {
    if (typeof Tone === 'undefined') {
        console.warn("initializeAudio: Tone.js not loaded yet. Sounds will be unavailable.");
        return false; // Indicate failure
    }

    try {
        if (Tone.context.state !== 'running') {
            await Tone.start();
            console.log("Audio context started by initializeAudio.");
        }

        flipSound = flipSound || new Tone.Synth({
            oscillator: { type: 'sine' },
            envelope: { attack: 0.005, decay: 0.1, sustain: 0.05, release: 0.1 },
            volume: -10
        }).toDestination();

        boopSound = boopSound || new Tone.Synth({
            oscillator: { type: 'sine' },
            envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.1 },
            volume: -15
        }).toDestination();

        chimeSound = chimeSound || new Tone.Synth({
            oscillator: { type: 'triangle8' },
            envelope: { attack: 0.01, decay: 0.3, sustain: 0.05, release: 0.2 },
            volume: -12,
            harmonicity: 1.2
        }).toDestination();
        return true; // Indicate success

    } catch (synthError) {
        console.error("initializeAudio - Synth initialization or Tone.start() FAILED:", synthError);
        return false; // Indicate failure
    }
}

export { flipSound, boopSound, chimeSound };

