var socket = io('http://localhost:3060');

function renderMessage(message) {
    $('.messages').append('<div class="message"><strong>' + message.username + ': </strong>' + message.message + '</div>');
}

socket.on('receivedMessage', message => {
    renderMessage(message);
});

socket.on('previousMessages', messages => {
    for (message of messages) {
        renderMessage(message);
    }
});

$('.form').submit(function(event) {
    event.preventDefault();

    var userid = $('input[name=userid]').val();
    var username = $('input[name=username]').val();
    var message = $('input[name=message]').val();
    
    if (userid.length && message.length) {
        let isSpecialCommand = false;
        let ticker = "";
        
        // is special command?
        if (message.includes('/stock=')) {
            const occurrences = message.split('=');
            if (occurrences.length === 2 && occurrences[0] === '/stock') {
                isSpecialCommand = true;
                ticker = occurrences[1];
            }
        }
        
        var messageObject = {
            userid: userid,
            username: username,
            message: message
        };

        // special commands should not be displayed as messages
        if (!isSpecialCommand) {
            renderMessage(messageObject);
        }
        
        socket.emit('sendMessage', messageObject);
        
        $('input[name=message]').val('');
        $('input[name=message]').focus();
    }
});