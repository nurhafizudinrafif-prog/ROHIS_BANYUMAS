// Vercel Serverless Function: Antigravity Cloud Autonomous Coding Agent
// Controls & modifies ROHIS Banyumas repository directly on GitHub without requiring a laptop

const DEFAULT_REPO = 'nurhafizudinrafif-prog/ROHIS_BANYUMAS';
const DEFAULT_BRANCH = 'main';

// Resilient Gemini Caller with Automatic Model Fallback
async function requestGemini(apiKey, parts, generationConfig = {}) {
  const models = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-2.0-flash-lite'];
  let lastError = null;

  for (const model of models) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts }],
            generationConfig,
          }),
        }
      );

      if (res.ok) {
        return await res.json();
      }

      const errText = await res.text();
      lastError = new Error(`Gemini ${model} Error (${res.status}): ${errText}`);
    } catch (e) {
      lastError = e;
    }
  }

  throw lastError || new Error('Gagal menghubungi semua model Gemini.');
}

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed. Use POST.' });
  }

  const { pin, action = 'execute', prompt, photo, targetBranch = DEFAULT_BRANCH } = req.body || {};

  // 1. PIN Security Authentication
  const configuredPin = process.env.AGENT_PIN || process.env.ADMIN_PIN || '123456';
  if (!pin || String(pin).trim() !== String(configuredPin).trim()) {
    return res.status(401).json({
      success: false,
      error: 'PIN Keamanan salah. Akses ditolak.',
    });
  }

  const githubToken = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_KEY;
  const repoFullName = process.env.GITHUB_REPO || DEFAULT_REPO;

  // 2. Handle Action: Status Check
  if (action === 'status') {
    try {
      if (!githubToken) {
        return res.status(200).json({
          success: true,
          configured: false,
          missingKeys: ['GITHUB_TOKEN'],
          message: 'GITHUB_TOKEN belum disetel di Environment Variables Vercel.',
          repo: repoFullName,
          branch: targetBranch,
        });
      }

      // Fetch latest commit from GitHub
      const commitRes = await fetch(`https://api.github.com/repos/${repoFullName}/commits/${targetBranch}`, {
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Antigravity-Cloud-Agent',
        },
      });

      if (!commitRes.ok) {
        const errText = await commitRes.text();
        return res.status(200).json({
          success: true,
          configured: true,
          githubConnected: false,
          error: `Gagal mengakses repo GitHub: ${commitRes.statusText}`,
          details: errText,
        });
      }

      const commitData = await commitRes.json();
      return res.status(200).json({
        success: true,
        configured: true,
        hasGeminiKey: Boolean(geminiApiKey),
        repo: repoFullName,
        branch: targetBranch,
        latestCommit: {
          sha: commitData.sha?.substring(0, 7),
          fullSha: commitData.sha,
          message: commitData.commit?.message || '',
          author: commitData.commit?.author?.name || 'Unknown',
          date: commitData.commit?.author?.date || new Date().toISOString(),
        },
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // 3. Handle Action: Rollback Last Commit
  if (action === 'rollback') {
    if (!githubToken) {
      return res.status(400).json({ success: false, error: 'GITHUB_TOKEN belum disetel di Vercel.' });
    }
    try {
      // Get the last 2 commits
      const commitsRes = await fetch(`https://api.github.com/repos/${repoFullName}/commits?per_page=2&sha=${targetBranch}`, {
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Antigravity-Cloud-Agent',
        },
      });
      const commits = await commitsRes.json();
      if (!Array.isArray(commits) || commits.length < 2) {
        return res.status(400).json({ success: false, error: 'Tidak ada commit sebelumnya untuk di-rollback.' });
      }

      const previousCommitSha = commits[1].sha;

      // Update branch ref to point to previous commit (soft rollback)
      const updateRefRes = await fetch(`https://api.github.com/repos/${repoFullName}/git/refs/heads/${targetBranch}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Antigravity-Cloud-Agent',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sha: previousCommitSha,
          force: true,
        }),
      });

      if (!updateRefRes.ok) {
        const errData = await updateRefRes.text();
        return res.status(500).json({ success: false, error: 'Gagal rollback: ' + errData });
      }

      return res.status(200).json({
        success: true,
        message: `Rollback sukses! Branch ${targetBranch} sekarang kembali ke commit ${previousCommitSha.substring(0, 7)}: "${commits[1].commit.message}"`,
        rolledBackTo: previousCommitSha.substring(0, 7),
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // 4. Handle Action: Execute Coding Instruction
  if (action === 'execute') {
    if (!prompt || String(prompt).trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Instruksi (prompt) tidak boleh kosong.' });
    }

    if (!githubToken || !geminiApiKey) {
      const missing = [];
      if (!githubToken) missing.push('GITHUB_TOKEN');
      if (!geminiApiKey) missing.push('GEMINI_API_KEY');
      return res.status(400).json({
        success: false,
        error: `Kunci API belum lengkap di Vercel: ${missing.join(', ')}. Silakan tambahkan di Vercel Project Settings -> Environment Variables.`,
        missingKeys: missing,
      });
    }

    try {
      const logs = [];
      const addLog = (msg) => logs.push(`[${new Date().toLocaleTimeString('id-ID')}] ${msg}`);
      addLog('Menerima instruksi dari perangkat mobile...');

      // Step A: Get repository file tree
      addLog('Mengambil struktur berkas proyek dari GitHub...');
      const treeRes = await fetch(`https://api.github.com/repos/${repoFullName}/git/trees/${targetBranch}?recursive=1`, {
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Antigravity-Cloud-Agent',
        },
      });

      if (!treeRes.ok) {
        throw new Error(`Gagal mengambil tree GitHub (${treeRes.status}): ${await treeRes.text()}`);
      }

      const treeData = await treeRes.json();
      const allFiles = (treeData.tree || [])
        .filter((item) => item.type === 'blob' && !item.path.startsWith('node_modules/') && !item.path.startsWith('.git/'))
        .map((item) => item.path);

      addLog(`Menemukan ${allFiles.length} berkas dalam repositori.`);

      // Step B: Ask Gemini which files are relevant to read
      addLog('Menganalisis berkas yang relevan menggunakan Gemini AI...');
      if (photo && photo.data) {
        addLog('Foto / screenshot revisi terlampir terdeteksi, mengaktifkan Gemini Vision...');
      }

      const fileSelectionPrompt = `
Anda adalah Antigravity AI Cloud Agent untuk proyek website ROHIS Banyumas (Vite + React).
Daftar seluruh file dalam proyek adalah sebagai berikut:
${JSON.stringify(allFiles, null, 2)}

Instruksi pengguna:
"${prompt}"
${photo && photo.data ? '(Catatan: Pengguna juga melampirkan foto / gambar screenshot referensi revisi)' : ''}

Tugas Anda: Pilih maksimal 5 file yang paling relevan untuk DIBACA dan DIEDIT agar instruksi pengguna dan foto revisi dapat diselesaikan dengan sempurna.
Balas HANYA dengan JSON array berisi path file string, contoh: ["src/pages/Home.jsx", "src/pages/Home.css"]. Jangan beri penjelasan apapun selain format JSON array.
`;

      const selectionParts = [{ text: fileSelectionPrompt }];
      if (photo && photo.data) {
        const cleanBase64 = photo.data.includes(',') ? photo.data.split(',')[1] : photo.data;
        selectionParts.push({
          inline_data: {
            mime_type: photo.mimeType || 'image/jpeg',
            data: cleanBase64,
          },
        });
      }

      const selectionData = await requestGemini(geminiApiKey, selectionParts, { temperature: 0.1 });
      const selectionText = selectionData.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
      let relevantFiles = [];
      try {
        const cleanJson = selectionText.replace(/```json/gi, '').replace(/```/g, '').trim();
        relevantFiles = JSON.parse(cleanJson);
      } catch {
        relevantFiles = ['src/pages/Home.jsx', 'src/pages/Home.css'];
      }

      if (!Array.isArray(relevantFiles) || relevantFiles.length === 0) {
        relevantFiles = ['src/pages/Home.jsx'];
      }

      addLog(`Berkas yang akan dibaca: ${relevantFiles.join(', ')}`);

      // Step C: Fetch contents of selected files
      const fileContents = {};
      for (const filePath of relevantFiles) {
        try {
          const contentRes = await fetch(
            `https://api.github.com/repos/${repoFullName}/contents/${filePath}?ref=${targetBranch}`,
            {
              headers: {
                'Authorization': `Bearer ${githubToken}`,
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'Antigravity-Cloud-Agent',
              },
            }
          );
          if (contentRes.ok) {
            const data = await contentRes.json();
            if (data.content) {
              fileContents[filePath] = Buffer.from(data.content, 'base64').toString('utf-8');
            }
          }
        } catch (e) {
          addLog(`Peringatan: Gagal membaca ${filePath}: ${e.message}`);
        }
      }

      // Step D: Prompt Gemini to write the updated file contents
      addLog('Gemini AI sedang menganalisis foto & menulis kode baru...');

      const photoNotice = photo && photo.data
        ? `\n\nCATATAN PENTING FOTO / SCREENSHOT REVISI:
Pengguna telah melampirkan foto / gambar screenshot revisi berikut.
Perhatikan baik-baik tampilan visual pada gambar:
1. Periksa bagian mana yang ditunjuk, dilingkari, atau ditandai oleh pengguna.
2. Cocokkan warna, ukuran font, padding, posisi tombol, atau layout agar persis seperti gambar yang diinginkan pengguna.
3. Terapkan perubahan kode tersebut pada file CSS / JSX yang relevan.`
        : '';

      const codeGenPrompt = `
Anda adalah Antigravity Autonomous Coding Agent untuk website resmi ROHIS Kabupaten Banyumas.
Teknologi proyek: Vite, React 19, Vanilla CSS dengan desain 3D Liquid Glass (Emerald #00F0CF, Deep Obsidian #010405, Refractive Glass).

Instruksi pengguna:
"${prompt}"
${photoNotice}

Berikut adalah isi berkas saat ini yang relevan:
${Object.entries(fileContents)
  .map(([path, content]) => `--- FILE: ${path} ---\n${content}\n--- END FILE ---`)
  .join('\n\n')}

ATURAN PENTING:
1. Kembalikan SELURUH kode file yang diubah secara lengkap (bukan potongan / diff).
2. Pertahankan gaya desain visual mewah, responsif mobile, dan tidak merusak fitur yang sudah ada.
3. Balas HANYA dalam format JSON valid tanpa teks pengantar, dengan struktur persis seperti ini:
{
  "summary": "Ringkasan penjelasan ramah bahasa Indonesia mengenai apa saja yang telah diubah sesuai instruksi dan foto revisi",
  "commitMessage": "Pesan commit singkat untuk git (contoh: feat: update hero title and layout based on revision screenshot)",
  "files": [
    {
      "path": "path/ke/file.jsx",
      "content": "ISI LENGKAP FILE SETELAH DIEDIT",
      "encoding": "utf-8"
    }
  ]
}
`;

      const codeGenParts = [{ text: codeGenPrompt }];
      if (photo && photo.data) {
        const cleanBase64 = photo.data.includes(',') ? photo.data.split(',')[1] : photo.data;
        codeGenParts.push({
          inline_data: {
            mime_type: photo.mimeType || 'image/jpeg',
            data: cleanBase64,
          },
        });
      }

      const genData = await requestGemini(geminiApiKey, codeGenParts, {
        temperature: 0.2,
        responseMimeType: 'application/json',
      });
      const rawResult = genData.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
      let agentResult = {};
      try {
        agentResult = JSON.parse(rawResult);
      } catch {
        const clean = rawResult.replace(/```json/gi, '').replace(/```/g, '').trim();
        agentResult = JSON.parse(clean);
      }

      const filesToUpdate = agentResult.files || [];
      if (filesToUpdate.length === 0) {
        return res.status(200).json({
          success: true,
          message: 'AI tidak mendeteksi perubahan file yang diperlukan untuk instruksi ini.',
          summary: agentResult.summary || 'Tidak ada perubahan berkas.',
          logs,
        });
      }

      addLog(`Menyiapkan pembaruan untuk ${filesToUpdate.length} berkas...`);

      // Step E: Commit files directly to GitHub using Git Data API
      addLog('Mengirimkan commit langsung ke repositori GitHub main branch...');
      
      // 1. Get current branch commit SHA and tree SHA
      const branchRefRes = await fetch(`https://api.github.com/repos/${repoFullName}/git/refs/heads/${targetBranch}`, {
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Antigravity-Cloud-Agent',
        },
      });
      const branchRefData = await branchRefRes.json();
      const latestCommitSha = branchRefData.object.sha;

      const latestCommitObjRes = await fetch(`https://api.github.com/repos/${repoFullName}/git/commits/${latestCommitSha}`, {
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Antigravity-Cloud-Agent',
        },
      });
      const latestCommitObj = await latestCommitObjRes.json();
      const baseTreeSha = latestCommitObj.tree.sha;

      // 2. Create blobs for each modified file
      const treeEntries = [];
      for (const file of filesToUpdate) {
        const isBase64 = file.encoding === 'base64';
        const blobRes = await fetch(`https://api.github.com/repos/${repoFullName}/git/blobs`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Antigravity-Cloud-Agent',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: file.content,
            encoding: isBase64 ? 'base64' : 'utf-8',
          }),
        });
        const blobData = await blobRes.json();
        treeEntries.push({
          path: file.path,
          mode: '100644',
          type: 'blob',
          sha: blobData.sha,
        });
        addLog(`Blob tersimpan: ${file.path}`);
      }

      // 3. Create a new tree
      const newTreeRes = await fetch(`https://api.github.com/repos/${repoFullName}/git/trees`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Antigravity-Cloud-Agent',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          base_tree: baseTreeSha,
          tree: treeEntries,
        }),
      });
      const newTreeData = await newTreeRes.json();

      // 4. Create commit
      const commitMessage = agentResult.commitMessage || `chore(cloud-agent): ${prompt.substring(0, 60)}`;
      const newCommitRes = await fetch(`https://api.github.com/repos/${repoFullName}/git/commits`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Antigravity-Cloud-Agent',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `${commitMessage}\n\nPerubahan dibuat secara otomatis dari HP via Antigravity Cloud Controller.\nInstruksi: "${prompt}"`,
          tree: newTreeData.sha,
          parents: [latestCommitSha],
        }),
      });
      const newCommitData = await newCommitRes.json();

      // 5. Update branch ref to new commit
      await fetch(`https://api.github.com/repos/${repoFullName}/git/refs/heads/${targetBranch}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Antigravity-Cloud-Agent',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sha: newCommitData.sha,
        }),
      });

      addLog(`Commit berhasil: ${newCommitData.sha.substring(0, 7)}`);
      addLog('Trigger Vercel deployment otomatis aktif! Website akan live dalam 30 detik.');

      return res.status(200).json({
        success: true,
        summary: agentResult.summary || 'Perubahan berhasil diterapkan dan dipush ke GitHub.',
        commit: {
          sha: newCommitData.sha.substring(0, 7),
          fullSha: newCommitData.sha,
          message: commitMessage,
          url: `https://github.com/${repoFullName}/commit/${newCommitData.sha}`,
        },
        updatedFiles: filesToUpdate.map((f) => f.path),
        logs,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        error: 'Terjadi kesalahan saat memproses di Cloud: ' + err.message,
      });
    }
  }

  return res.status(400).json({ success: false, error: 'Aksi tidak dikenal.' });
}
