
function handlePrimaryClick() {

    console.log("primary clicked!")
    const audio_sample = document.getElementById('buttonAudio');
    console.log("audio_sample status: " + audio_sample)
    console.log("audio_sample source: " + audio_sample.src)
    console.log("audio_sample error: " + audio_sample.error)
    
    // Play audio_sample without waiting
    if (!audio_sample || audio_sample.error) {
        playBeepSound(); // Make sure this is non-blocking
    } else {
        audio_sample.currentTime = 0;
        audio_sample.play().catch(e => {
            console.log('Audio play failed, using beep instead');
        });
    }
    
    const statusEl = document.getElementById('status');
    statusEl.innerHTML = 'communicating with le stick...';
            
    fetch('/noPress')
        .then(function(response) {
            return response.text();
        })
        .then(function(data) {
            statusEl.innerHTML = data;

        })
        .catch(function(error) {
            statusEl.innerHTML = 'Error: ' + error;
        });
        
}



function handleSecondaryClick() {
    const audio = document.getElementById('buttonAudio2');
    
    // Play audio without waiting
    if (!audio || audio.error) {
        playOtherBeepSound(); // Make sure this is non-blocking
    } else {
        audio.currentTime = 0;
        audio.play().catch(e => {
            console.log('Audio play failed, using beep instead');
        });
    }

        const statusEl2 = document.getElementById('status');
        statusEl2.innerHTML = 'communicating with le stick...';
            
        fetch('/press')
            .then(function(response) {
                return response.text();
            })
            .then(function(data) {
                    statusEl2.innerHTML = data;
            })
            .catch(function(error) {
                    statusEl2.innerHTML = 'Error: ' + error;
            });
        }


    // Add sparkle animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes sparkle {
            0% {
                opacity: 1;
                transform: scale(0);
            }
            50% {
                opacity: 1;
                transform: scale(1);
            }
            100% {
                opacity: 0;
                transform: scale(0);
            }
        }
    `;
    document.head.appendChild(style);

    function playBeepSound() {
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.value = 800; // Frequency in Hz
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.2);
            } catch (error) {
                console.log('Web Audio API not supported');
            }
        }
        function playOtherBeepSound() {
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.value = 528; // Frequency in Hz
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.4);
            } catch (error) {
                console.log('Web Audio API not supported');
            }
        }