const userProfile = {
    name: 'You',
    profilePicture: ''
};

const userVotes = new Set(); // To track users who have voted

function toggleMediaOptions() {
    const mediaOptions = document.getElementById('mediaOptions');
    mediaOptions.style.display = mediaOptions.style.display === 'block' ? 'none' : 'block';
    hidePollCard();
    hideEmojiPicker();
}

function openFileDialog(type) {
    const fileInput = document.getElementById('fileInput');
    fileInput.setAttribute('accept', type === 'photo' ? 'image/,video/' : '*');
    fileInput.click();
    hideMediaOptions();
}

function handleFileUpload(event) {
    const file = event.target.files[0];
    const messageGroup = document.querySelector('.message-group');
    const newMessage = document.createElement('div');
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const fileURL = URL.createObjectURL(file);

    if (file.type.startsWith('image/')) {
        newMessage.innerHTML = `
            <div class="d-flex align-items-start">
                <div class="group-profile-pic" style="background-color: ${getRandomColor()};">${userProfile.name.charAt(0)}</div>
                <div class="ml-2">
                    <div class="sender-info" style="color: ${getRandomColor()};">${userProfile.name}</div>
                    <div class="message-content">
                        <img src="${fileURL}" alt="Image" />
                        <span class="timestamp">${currentTime}</span>
                    </div>
                </div>
            </div>
        `;
    } else if (file.type.startsWith('video/')) {
        newMessage.innerHTML = `
            <div class="d-flex align-items-start">
                <div class="group-profile-pic" style="background-color: ${getRandomColor()};">${userProfile.name.charAt(0)}</div>
                <div class="ml-2">
                    <div class="sender-info" style="color: ${getRandomColor()};">${userProfile.name}</div>
                    <div class="message-content">
                        <video controls>
                            <source src="${fileURL}" type="${file.type}">
                            Your browser does not support the video tag.
                        </video>
                        <span class="timestamp">${currentTime}</span>
                    </div>
                </div>
            </div>
        `;
    }

    messageGroup.appendChild(newMessage);
    event.target.value = ''; // Clear the input
}

function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const messageText = messageInput.value.trim();
    const messageGroup = document.querySelector('.message-group');

    if (messageText) {
        const newMessage = document.createElement('div');
        newMessage.classList.add('message', 'sent');
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        newMessage.innerHTML = `
            <div class="d-flex align-items-start">
                <div class="group-profile-pic" style="background-color: ${getRandomColor()};">${userProfile.name.charAt(0)}</div>
                <div class="ml-2">
                    <div class="sender-info" style="color: ${getRandomColor()};">${userProfile.name}</div>
                    <div class="message-content">
                        ${messageText}
                        <span class="timestamp">${currentTime}</span>
                    </div>
                </div>
            </div>
        `;
        messageGroup.appendChild(newMessage);
        messageInput.value = ''; // Clear input after sending
    }
}

const polls = {};

function createPoll() {
    const pollCard = document.getElementById('pollCard');
    pollCard.style.display = pollCard.style.display === 'block' ? 'none' : 'block';
    hideMediaOptions(); // Ensure media options are hidden when poll card is shown
}

function sendPoll() {
    const pollQuestion = document.getElementById('pollQuestion').value.trim();
    const options = Array.from(document.querySelectorAll('.poll-option')).map(option => option.value.trim()).filter(Boolean);
    const messageGroup = document.querySelector('.message-group');

    if (pollQuestion && options.length) {
        const newPoll = document.createElement('div');
        newPoll.classList.add('message', 'poll');

        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Initialize poll data
        const pollData = {};
        options.forEach(option => {
            pollData[option] = { votes: 0, hasVoted: false }; // Initial vote count and voting status
        });

        polls[pollQuestion] = pollData; // Store poll data

        newPoll.innerHTML = `
            <div class="d-flex align-items-start">
                <div class="group-profile-pic" style="background-color: ${getRandomColor()};">${userProfile.name.charAt(0)}</div>
                <div class="ml-2">
                    <div class="sender-info" style="color: ${getRandomColor()};">${userProfile.name}</div>
                    <div class="message-content">
                        <strong>${pollQuestion}</strong><br>
                        <div class="poll-results">
                            ${options.map(option => `
                                <div class="poll-option">
                                    <span>${option}</span> - <span class="vote-count" id="count-${option}">0</span> votes
                                    <button class="btn btn-success btn-sm" onclick="votePoll('${pollQuestion}', '${option}')">Vote</button>
                                </div>
                            `).join('')}
                        </div>
                        <span class="timestamp">${currentTime}</span>
                    </div>
                </div>
            </div>
        `;
        messageGroup.appendChild(newPoll);
        document.getElementById('pollCard').style.display = 'none'; // Hide poll card after creating
        clearPollInputs();
    }
}

function votePoll(question, option) {
    if (polls[question] && !polls[question][option].hasVoted) {
        polls[question][option].votes++; // Increment vote count
        polls[question][option].hasVoted = true; // Mark option as voted
        const voteCountElement = document.getElementById(count-${option});
        voteCountElement.innerText = polls[question][option].votes; // Update displayed vote count
    }
}

function clearPollInputs() {
    document.getElementById('pollQuestion').value = '';
    const pollOptions = document.querySelectorAll('.poll-option');
    pollOptions.forEach(option => option.value = '');
}

function hideMediaOptions() {
    const mediaOptions = document.getElementById('mediaOptions');
    mediaOptions.style.display = 'none';
}

function hidePollCard() {
    const pollCard = document.getElementById('pollCard');
    pollCard.style.display = 'none';
}

function toggleEmojiPicker(event) {
    const emojiPicker = document.getElementById('emojiPicker');
    emojiPicker.style.display = emojiPicker.style.display === 'block' ? 'none' : 'block';
    hideMediaOptions(); // Ensure media options are hidden when emoji picker is shown
    event.stopPropagation();
}

function addEmoji(emoji) {
    const messageInput = document.getElementById('messageInput');
    messageInput.value += emoji; // Append emoji to input
    toggleEmojiPicker(); // Hide emoji picker after selection
}

document.addEventListener('click', function(event) {
    if (!event.target.closest('.emoji-picker') && !event.target.closest('.input-group-text')) {
        document.getElementById('emojiPicker').style.display = 'none';
    }
});

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}