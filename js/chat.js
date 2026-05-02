// public/scripts/chat.js

document.addEventListener('DOMContentLoaded', () => {

    const userInput = document.getElementById('userInput');
    const sendBtn   = document.getElementById('sendBtn');
    const chatBox   = document.getElementById('chat-box');

    if (!userInput || !sendBtn || !chatBox) {
        console.error('Elemen chat tidak ditemukan di DOM');
        return;
    }

    // ================= INIT =================
    const soal = sessionStorage.getItem('soalUntukAI');

    if (soal && soal.trim() !== '') {
        userInput.value = soal.trim();

        // Kunci input (AMAN di HP & desktop)
        userInput.readOnly = true;
        userInput.style.cursor = 'not-allowed';

        tampilkanPesan(
            'ai',
            '👋 Selamat datang.<br>Soal Anda sudah dimuat.<br>Klik <b>"Dapatkan Petunjuk"</b> untuk melanjutkan.'
        );
    } else {
        userInput.value = 'Tidak ada soal yang dikirim. Silakan kembali ke halaman soal.';
        userInput.readOnly = true;
        sendBtn.disabled = true;
    }

    // ================= EVENT BUTTON =================
    sendBtn.addEventListener('click', async () => {
        if (sendBtn.disabled) return;

        const userSoal = userInput.value.trim();
        if (!userSoal) return;

        // Lock UI
        sendBtn.disabled = true;
        sendBtn.innerText = 'Memproses...';
        userInput.style.backgroundColor = '#e5e5e5';

        const loadingId = tampilkanPesan('ai', '⏳ Mencari petunjuk...');

        try {
            const response = await fetch('/api/get-clue', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ soal: userSoal })
            });

            const data = await response.json();
            hapusPesanById(loadingId);

            if (response.ok && data.clue) {
                tampilkanPesan('ai', data.clue);
            } else {
                tampilkanPesan(
                    'ai',
                    '⚠️ Terjadi masalah pada server.<br>' +
                    (data.error || 'Silakan coba lagi nanti.')
                );
            }

        } catch (err) {
            console.error('Kesalahan jaringan:', err);
            hapusPesanById(loadingId);
            tampilkanPesan('ai', '❌ Gagal terhubung ke server.');
        }
    });

    // ================= FUNCTIONS =================
    function tampilkanPesan(sender, text) {
        const messageDiv = document.createElement('div');
        const messageId = 'msg-' + Date.now() + Math.random().toString(16).slice(2);

        messageDiv.id = messageId;
        messageDiv.className = `message ${sender}`;
        messageDiv.innerHTML = text.replace(/\n/g, '<br>');

        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;

        return messageId;
    }

    function hapusPesanById(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

});
