const BASE_URL = "http://127.0.0.1:5000";
const token = localStorage.getItem("token");

function authHeader() {
    return {
        "Authorization": "Bearer " + token
    };
}

// Load resumes automatically
window.onload = function () {
    loadResumesIntoDropdown();
};

// ---------------------------
// LOAD RESUMES INTO DROPDOWN
// ---------------------------

async function loadResumesIntoDropdown() {
    const select = document.getElementById("resumeSelect");

    const res = await fetch(`${BASE_URL}/candidate/resumes`, {
        method: "GET",
        headers: authHeader()
    });

    const data = await res.json();
    select.innerHTML = "";

    if (data.count === 0) {
        select.innerHTML = "<option>No resumes found</option>";
        return;
    }

    data.resumes.forEach(r => {
        const opt = document.createElement("option");
        opt.value = r.resume_id;
        opt.textContent = `Resume ${r.resume_id} — (${r.parsed.skills.join(", ")})`;
        select.appendChild(opt);
    });
}


// ---------------------------
// GET RECOMMENDATIONS
// ---------------------------

async function getRecommendations() {
    const resumeId = document.getElementById("resumeSelect").value;
    const div = document.getElementById("recommendationList");

    const res = await fetch(`${BASE_URL}/candidate/recommend`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...authHeader()
        },
        body: JSON.stringify({
            resume_id: parseInt(resumeId),
            top_n: 5
        })
    });

    const data = await res.json();

    if (!data.recommendations || data.recommendations.length === 0) {
        div.innerHTML = "<p>No job recommendations available.</p>";
        return;
    }

    let html = "";
    data.recommendations.forEach(job => {
        html += `
        <div class="job-card">
            <h3>${job.title}</h3>
            <p><strong>Score:</strong> ${job.score}</p>
            <p><strong>Skills:</strong> ${job.skills.join(", ")}</p>
            <p>${job.description.slice(0, 150)}...</p>
            <button onclick="applyJob(${job.job_id}, ${resumeId})">Apply</button>
        </div>
        <hr/>
        `;
    });

    div.innerHTML = html;
}


// ---------------------------
// APPLY FOR JOB (CALL BACKEND)
// ---------------------------

async function applyJob(jobId, resumeId) {
    if (!confirm("Apply for this job?")) return;

    const res = await fetch(`${BASE_URL}/candidate/apply`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...authHeader()
        },
        body: JSON.stringify({
            job_id: jobId,
            resume_id: resumeId,
            cover_letter: "Auto-applied via recommendation page."
        })
    });

    const data = await res.json();
    alert(data.message || "Applied successfully!");
}


