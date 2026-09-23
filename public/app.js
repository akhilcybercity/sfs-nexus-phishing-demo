// ============================================================
//  SFS NEXUS 2K26 – Student Form Logic (API-backed)
// ============================================================

// ── Star Rating ──
const stars       = document.querySelectorAll('#starRating span');
const ratingInput = document.getElementById('rating');

stars.forEach(star => {
  star.addEventListener('click', () => {
    const val = parseInt(star.dataset.val);
    ratingInput.value = val;
    stars.forEach(s => s.classList.toggle('active', parseInt(s.dataset.val) <= val));
  });
  star.addEventListener('mouseenter', () => {
    const val = parseInt(star.dataset.val);
    stars.forEach(s => s.style.color = parseInt(s.dataset.val) <= val ? '#f59e0b' : '');
  });
  star.addEventListener('mouseleave', () => {
    stars.forEach(s => { s.style.color = ''; });
    const cur = parseInt(ratingInput.value) || 0;
    stars.forEach(s => s.classList.toggle('active', parseInt(s.dataset.val) <= cur));
  });
});

// ── Password toggle ──
function togglePassword() {
  const pw = document.getElementById('password');
  pw.type = pw.type === 'password' ? 'text' : 'password';
}

// ── Form Submit ──
document.getElementById('feedbackForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  if (!ratingInput.value) {
    alert('Please select a star rating before submitting.');
    return;
  }

  const btnText   = document.getElementById('btnText');
  const btnLoader = document.getElementById('btnLoader');
  btnText.style.display   = 'none';
  btnLoader.style.display = 'inline';

  const payload = {
    fullName:   document.getElementById('fullName').value.trim(),
    rollNo:     document.getElementById('rollNo').value.trim(),
    email:      document.getElementById('email').value.trim(),
    phone:      document.getElementById('phone').value.trim(),
    department: document.getElementById('department').value,
    year:       document.getElementById('year').value,
    password:   document.getElementById('password').value,
    event:      document.getElementById('event').value,
    rating:     ratingInput.value,
    feedback:   document.getElementById('feedback').value.trim(),
  };

  try {
    const res  = await fetch('/api/submit', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    });
    const data = await res.json();

    btnText.style.display   = 'inline';
    btnLoader.style.display = 'none';

    document.getElementById('feedbackForm').reset();
    ratingInput.value = '';
    stars.forEach(s => s.classList.remove('active'));

    document.getElementById('refCode').textContent = 'Reference ID: ' + (data.ref || 'NEX-XXXXX');
    document.getElementById('successModal').classList.add('show');

  } catch (err) {
    btnText.style.display   = 'inline';
    btnLoader.style.display = 'none';
    alert('Submission failed. Please try again.');
  }
});

function closeModal() {
  document.getElementById('successModal').classList.remove('show');
}
