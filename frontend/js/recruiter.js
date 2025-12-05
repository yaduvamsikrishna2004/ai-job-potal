// recruiter.js

const BASE_URL = "http://127.0.0.1:5000";
const token = localStorage.getItem("token"); // recruiter token

function authHeader() {
    return {
        "Authorization": "Bearer " + token
    };
}

// --------------------------
// BULK UPLOAD
// --------------------------

async function bulkUpload() {
    const files = document.getElementById("bulkFiles").files;
    const jobId = document.getElementById("bulkJobId").value;
    const resultDiv = document.getElementById("bulkResult");

    if (!jobId || files.length === 0) {
        resultDiv.innerHTML = "<p style='color:red'>Job ID & files are required.</p>";
        return;
    }

    const formData = new FormData();
    formData.append("job_id", jobId);

    for (let f of files) {
        formData.append("resume", f);
    }

    const res = await fetch(`${BASE_URL}/recruiter/bulk-upload`, {
        method: "POST",
        headers: authHeader(),
        body: formData
    });

    const data = await res.json();
    resultDiv.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
}


// --------------------------
// RECONCILIATION
// --------------------------

async function reconcileResumes() {
    const div = document.getElementById("reconcileResult");

    const res = await fetch(`${BASE_URL}/recruiter/reconcile`, {
        method: "POST",
        headers: authHeader()
    });

    const data = await res.json();
    div.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
}


// --------------------------
// UNRECONCILED RESUMES
// --------------------------

async function loadUnreconciled() {
    const div = document.getElementById("unreconciledList");

    const res = await fetch(`${BASE_URL}/recruiter/unreconciled`, {
        method: "GET",
        headers: authHeader()
    });

    const data = await res.json();
    div.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
}


// --------------------------
// NOTIFY MATCHED CANDIDATES (SIMULATED)
// --------------------------

async function notifyMatched() {
    const div = document.getElementById("notifyResult");

    const res = await fetch(`${BASE_URL}/recruiter/notify-matched`, {
        method: "POST",
        headers: authHeader()
    });

    const data = await res.json();
    div.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
}


// --------------------------
// EXPORT CSV
// --------------------------

function exportCsv() {
    const jobId = document.getElementById("exportJobId").value;
    if (!jobId) {
        alert("Enter Job ID");
        return;
    }

    window.open(`${BASE_URL}/recruiter/export/${jobId}`, "_blank");
}
