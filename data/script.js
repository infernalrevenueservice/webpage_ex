function sayHello() {
    var statusEl = document.getElementById('status');
    statusEl.innerHTML = 'Sending hello to M5Stick...';
    
    fetch('/hello')
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