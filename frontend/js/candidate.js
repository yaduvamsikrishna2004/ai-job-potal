// candidate.js

const BASE_URL = "http://127.0.0.1:5000";
const token = localStorage.getItem("token");  // candidate token

function authHeader() {
    return {
        "Authorization": "Bearer " + token
    };
}

// ---------------------------
// UPLOAD RESUME
// ---------------------------

async function uploadResume() {
    const file = document.getElementById("resumeFile").files[0];
    const resultDiv = document.getElementById("uploadResult");

    if (!file) {
        resultDiv.innerHTML = "<p style='color:red'>Please select a file.</p>";
        return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    const res = await fetch(`${BASE_URL}/candidate/upload-resume`, {
        method: "POST",
        headers: authHeader(),
        body: formData
    });

    const data = await res.json();
    resultDiv.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
}


// ---------------------------
// LOAD RESUMES
// ---------------------------

async function loadResumes() {
    const div = document.getElementById("resumeList");

    const res = await fetch(`${BASE_URL}/candidate/resumes`, {
        method: "GET",
        headers: authHeader()
    });

    const data = await res.json();

    if (data.count === 0) {
        div.innerHTML = "<p>No resumes uploaded.</p>";
        return;
    }

    let html = "";
    data.resumes.forEach(r => {
        html += `
        <div class="resume-card">
            <p><strong>Resume ID:</strong> ${r.resume_id}</p>
            <p><strong>Uploaded:</strong> ${r.uploaded_at}</p>
            <p><strong>Skills:</strong> ${r.parsed.skills.join(", ")}</p>
            <p><strong>Preview:</strong> ${r.parsed.raw_text.slice(0, 200)}...</p>
            <button onclick="deleteResume(${r.resume_id})">Delete</button>
        </div>
        <hr/>
        `;
    });

    div.innerHTML = html;
}


// ---------------------------
// DELETE RESUME
// ---------------------------

async function deleteResume(id) {
    if (!confirm("Are you sure you want to delete this resume?")) return;

    const res = await fetch(`${BASE_URL}/candidate/resumes/${id}`, {
        method: "DELETE",
        headers: authHeader()
    });

    const data = await res.json();
    alert(data.message);
    loadResumes();  // reload list
}
