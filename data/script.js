
function handlePrimaryClick() {
            const audio = document.getElementById('buttonAudio');
            
            // If no audio file is available, create a beep sound using Web Audio API
            if (!audio.src || audio.error) {
                playBeepSound();
            } else {
                audio.currentTime = 0; // Reset to beginning
                audio.play().catch(e => {
                    console.log('Audio play failed, using beep instead');
                    playBeepSound();
                });
            }
            var statusEl = document.getElementById('status');
            statusEl.innerHTML = 'communicating with le stick...';
            
            fetch('/no')
                .then(function(response) {
                    return response.text();
                })
                .then(function(data) {
                    statusEl.innerHTML = data;
                    setTimeout(function() {
                        statusEl.innerHTML = '';
                    }, 3000);
                })
                .catch(function(error) {
                    statusEl.innerHTML = 'Error: ' + error;
                });
        
        }

function handleSecondaryClick() {
            const audio2 = document.getElementById('buttonAudio2');
            
            // If no audio file is available, create a beep sound using Web Audio API
            if (!audio2.src || audio2.error) {
                playBeepSound();
            } else {
                audio2.currentTime = 0; // Reset to beginning
                audio2.play().catch(e => {
                    console.log('Audio play failed, using beep instead');
                    playBeepSound();
                    
                });
            }
            var statusEl = document.getElementById('status');
            statusEl.innerHTML = 'communicating with le stick...';
            
            fetch('/press')
                .then(function(response) {
                    return response.text();
                })
                .then(function(data) {
                    statusEl.innerHTML = data;
                    setTimeout(function() {
                        statusEl.innerHTML = '';
                    }, 3000);
                })
                .catch(function(error) {
                    statusEl.innerHTML = 'Error: ' + error;
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
                oscillator.stop(audioContext.currentTime + 0.2);
            } catch (error) {
                console.log('Web Audio API not supported');
            }
        }