function Chat() {
    this.map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    this.im = 0;
}

Chat.prototype.processMessage = function (author, text) {
    var self = this;
    var textOrigin = text;
    author = author.replace(/[&<>"']/g, function (m) {
        return self.map[m];
    });
    text = text.replace(/[&<>"']/g, function (m) {
        return self.map[m];
    });

    // Trim spaces
    author = author.trim();
    text = text.trim();
    text = text.slice(0, 320); // Max characters = 350

    var response = {
        author: author,
        message: text
    };

    // Check for Empty message
    if (text.length === 0) {
        response['failed'] = true;
        return response;
    }

    var space = text.indexOf(' ');

    // Try to find recipients with @
    var isRecipient = new RegExp(/^@\w+/g).test(text);
    if (isRecipient) {
        if (space > 0) {
            response['recipient'] = text.substr(1, space-1);
            response['message'] = text.substr(space);
            response['private'] = true;
            return response;
        } else {
            response['failed'] = true;
        }
    }

    // Try to find commands
    var isCommand = new RegExp(/^\/\w+/g).test(text);
    if (isCommand) {
        response['command'] = textOrigin.substr(1, (space > 0 ? space-1 : text.length));
        if (space > 0) {
            response['args'] = textOrigin.substr(space+1).match(/(?:[^\s'"]+|['"][^'"]*['"])+/g) ;
        }
    }

    return response;
};

exports.Chat = Chat;