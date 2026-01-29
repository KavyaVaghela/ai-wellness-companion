class HeartRateSimulator {
    constructor() {
        this.listeners = [];
        this.interval = null;
        this.currentBpm = 75; // Starting BPM
        this.isEmergency = false;
    }

    start() {
        if (this.interval) return;

        console.log('Starting Heart Rate Simulator...');
        this.interval = setInterval(() => {
            this.generateNextBeat();
            this.notifyListeners();
        }, 2000); // Update every 2 seconds
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    subscribe(callback) {
        this.listeners.push(callback);
        return () => { // Unsubscribe function
            this.listeners = this.listeners.filter(cb => cb !== callback);
        };
    }

    notifyListeners() {
        this.listeners.forEach(cb => cb({
            bpm: this.currentBpm,
            status: this.getStatus(),
            timestamp: new Date()
        }));
    }

    generateNextBeat() {
        // Random fluctuation between -2 and +2
        const changes = [-2, -1, 0, 1, 2];
        const change = changes[Math.floor(Math.random() * changes.length)];
        let newBpm = this.currentBpm + change;

        // Keep within "realistic" but demo-able bounds (60-100 normal)
        // Occasional spikes logic can be added here

        // Manual override simulation (for testing alerts)
        // If > 95% random chance, spike to alert levels
        if (Math.random() > 0.98) {
            const spike = Math.random() > 0.5 ? 125 : 45; // High or Low Alert
            newBpm = spike;
        }

        // Return to normal gradually if it was spiking
        if (this.currentBpm > 100) newBpm = this.currentBpm - 5;
        if (this.currentBpm < 60) newBpm = this.currentBpm + 5;

        this.currentBpm = newBpm;
    }

    getStatus() {
        if (this.currentBpm < 50 || this.currentBpm > 120) return 'Alert';
        return 'Normal';
    }
}

export const heartRateSimulator = new HeartRateSimulator();
