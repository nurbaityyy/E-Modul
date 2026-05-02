// js/soal-logic.js

function checkNameAndLoadSoal() {
    // Memastikan siswa sudah login sebelum melihat soal
    const name = sessionStorage.getItem('studentName');
    if (!name) {
        window.location.href = 'index.html';
    }
}

function checkAnswer(soalId, correctAnswer) {
    // Mengambil nomor soal dari ID, misal 'soal1' -> 1
    const soalNumber = soalId.replace('soal', '');
    const userAnswer = parseFloat(document.getElementById(`jawaban${soalNumber}`).value);
    const feedbackElement = document.getElementById(`feedback${soalNumber}`);

    feedbackElement.classList.remove('correct', 'incorrect');
    
    if (isNaN(userAnswer)) {
        feedbackElement.textContent = 'Mohon masukkan jawaban berupa angka.';
        return;
    }

    if (userAnswer === correctAnswer) {
        feedbackElement.textContent = '🎉 Jawaban Anda Benar! Kerja bagus!';
        feedbackElement.classList.add('correct');
    } else {
        feedbackElement.textContent = '❌ Jawaban Anda kurang tepat. Coba periksa kembali langkah-langkah Anda.';
        feedbackElement.classList.add('incorrect');
    }
}

/**
 * Fungsi KUNCI: Membuat dan mengirim prompt yang sudah diisi otomatis ke Gemini.
 * @param {string} soalId - ID dari elemen soal (misal: 'soal1').
 */
function getAIClue(soalId) {
    const studentName = sessionStorage.getItem('studentName');
    
    // Mengambil teks soal dari elemen HTML yang sesuai
    const soalElement = document.getElementById(soalId);
    const soalText = soalElement.querySelector('.soal-text').textContent.trim();

    // 1. MEMBANGUN PROMPT KHUSUS UNTUK GEMINI
    // Instruksi Kritis: HANYA CLUE dan penyebutan nama.
    const cluePrompt = 
        `Halo, Gemini. Saya ${studentName} dari GeoSMART. Saya sedang kesulitan menjawab soal geometri ini.
        Tugas Anda: Berikan SAYA SATU ATAU DUA PETUNJUK (CLUE) langkah awal saja untuk memecahkan soal.
        JANGAN berikan jawaban akhir atau rumus lengkap.
        
        Soalnya: "${soalText}"`;

    // 2. ENCODING URL
    // Mengubah prompt menjadi format yang aman untuk dimasukkan ke URL.
    const encodedPrompt = encodeURIComponent(cluePrompt);

    // 3. MEMBUKA TAB BARU
    // Menggunakan URL Gemini dengan parameter 'q' (umumnya untuk query/prompt)
    // CATATAN PENTING: Implementasi ini bersifat SIMULASI. Bekerja atau tidaknya
    // pre-filled prompt SANGAT bergantung pada apakah antarmuka web publik Gemini
    // saat ini menerima parameter 'q' atau 'prompt' dari URL.
    
    // Jika Gemini API digunakan (lebih kompleks), URL ini diganti dengan panggilan AJAX/fetch.
    const geminiURL = `https://gemini.google.com/app?q=${encodedPrompt}`;

    window.open(geminiURL, '_blank');
    
    // Memberikan konfirmasi kepada siswa
    alert(`GeoSMART-AI telah membuka tab baru, ${studentName}. Soal sudah di-paste otomatis, dan Gemini siap memberi Anda petunjuk yang bersifat clue saja!`);
}