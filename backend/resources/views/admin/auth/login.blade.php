<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Admin Sign In · RevvMotiv Console</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Orbitron:wght@700;900&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }

  body, html {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background-color: #F4F3EE;
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: #1A2A38;
    user-select: none;
  }

  /* Ambient Grid & Lighting */
  .bg-grid {
    position: fixed;
    inset: 0;
    background-image: 
      radial-gradient(rgba(34, 64, 94, 0.08) 1.5px, transparent 1.5px),
      linear-gradient(to right, rgba(34, 64, 94, 0.025) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(34, 64, 94, 0.025) 1px, transparent 1px);
    background-size: 32px 32px, 96px 96px, 96px 96px;
    pointer-events: none;
  }

  .ambient-spot-left {
    position: fixed;
    top: 50%;
    left: 20%;
    transform: translate(-50%, -50%);
    width: 650px;
    height: 650px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(34, 64, 94, 0.12) 0%, rgba(201, 24, 43, 0.05) 45%, rgba(34, 64, 94, 0) 75%);
    filter: blur(80px);
    pointer-events: none;
  }

  .ambient-spot-right {
    position: fixed;
    bottom: -10%;
    right: 5%;
    width: 600px;
    height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(201, 24, 43, 0.06) 0%, rgba(201, 24, 43, 0) 70%);
    filter: blur(90px);
    pointer-events: none;
  }

  /* Fullscreen Split Layout (No card container) */
  .fullscreen-container {
    width: 100vw;
    height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    position: relative;
    z-index: 10;
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 60px;
  }

  /* ============ LEFT HALF: INTERACTIVE CHARACTER ============ */

  .character-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    position: relative;
  }

  .char-stage {
    width: 320px;
    height: 320px;
    display: flex;
    align-items: center;
    justify-content: center;
    perspective: 1200px;
    cursor: grab;
  }
  .char-stage:active { cursor: grabbing; }

  .float-container {
    width: 320px;
    height: 320px;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: gentleFloat 5.5s ease-in-out infinite;
    will-change: transform;
  }

  @keyframes gentleFloat {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50%      { transform: translateY(-16px) rotate(1.2deg); }
  }

  .shake-layer {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    will-change: transform;
  }

  .tilt-layer {
    position: relative;
    width: 280px;
    height: 280px;
    display: flex;
    align-items: center;
    justify-content: center;
    transform-style: preserve-3d;
    will-change: transform;
  }

  .mark-shadow {
    position: absolute;
    bottom: -22px;
    width: 180px;
    height: 26px;
    border-radius: 50%;
    background: rgba(34, 64, 94, 0.18);
    filter: blur(14px);
    transform: translateZ(-50px);
  }

  .ambient-glow {
    position: absolute;
    width: 280px;
    height: 280px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(34,64,94,0.16) 0%, rgba(201,24,43,0.06) 45%, rgba(34,64,94,0) 75%);
    filter: blur(14px);
  }

  .mark-svg {
    position: relative;
    width: 240px;
    height: 240px;
    filter: drop-shadow(0 18px 28px rgba(34, 64, 94, 0.25));
    will-change: transform;
    transition: transform 0.08s ease-out;
  }

  .eye {
    fill: #F4F3EE;
    transform-box: fill-box;
    transform-origin: 50% 0%;
    will-change: transform;
  }

  .status-text {
    height: 26px;
    font-size: 0.85rem;
    font-weight: 800;
    letter-spacing: 0.06em;
    color: rgba(26, 42, 56, 0.45);
    margin-top: 14px;
    text-align: center;
    transition: all 0.2s ease;
    text-transform: uppercase;
  }
  .status-text.caps { color: #C97A1B; text-shadow: 0 0 10px rgba(201, 122, 27, 0.3); }
  .status-text.error { color: #C9182B; text-shadow: 0 0 10px rgba(201, 24, 43, 0.3); }
  .status-text.success { color: #2E7D4F; text-shadow: 0 0 10px rgba(46, 125, 79, 0.3); }

  /* ============ RIGHT HALF: FORM CONSOLE ============ */

  .form-section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 40px;
    max-width: 480px;
    width: 100%;
  }

  .logo-header {
    margin-bottom: 24px;
  }

  .revv-logo-img {
    height: 34px;
    width: auto;
    object-fit: contain;
  }

  h1 {
    font-size: 2.1rem;
    font-weight: 900;
    letter-spacing: -0.035em;
    color: #1A2A38;
    margin-bottom: 6px;
  }

  .subtitle {
    font-size: 0.95rem;
    color: rgba(26, 42, 56, 0.6);
    margin-bottom: 30px;
    font-weight: 500;
  }

  .field {
    margin-bottom: 20px;
  }

  label {
    display: block;
    font-size: 0.76rem;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: rgba(26, 42, 56, 0.7);
    margin-bottom: 8px;
  }

  .input-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }

  input[type="email"],
  input[type="password"],
  input[type="text"].pw {
    width: 100%;
    padding: 14px 18px;
    font-size: 0.98rem;
    font-family: inherit;
    color: #1A2A38;
    background: #FFFFFF;
    border: 1.8px solid rgba(34, 64, 94, 0.18);
    border-radius: 14px;
    outline: none;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 0 2px 6px rgba(34, 64, 94, 0.04);
  }

  input:focus {
    background: #FFFFFF;
    border-color: #22405E;
    box-shadow: 0 0 0 4px rgba(34, 64, 94, 0.14);
  }

  .field.field-error input {
    border-color: #C9182B;
    background: #FFF8F8;
    box-shadow: 0 0 0 4px rgba(201, 24, 43, 0.14);
  }

  .toggle-pw {
    position: absolute;
    right: 10px;
    background: none;
    border: none;
    padding: 8px;
    cursor: pointer;
    color: rgba(26, 42, 56, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    transition: all 0.15s ease;
  }
  .toggle-pw:hover { color: #22405E; background: rgba(34,64,94,0.08); }
  .toggle-pw svg { width: 22px; height: 22px; }

  .caps-warning {
    font-size: 0.76rem;
    color: #C97A1B;
    margin-top: 6px;
    min-height: 16px;
    font-weight: 800;
  }

  .options-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
    font-size: 0.85rem;
  }

  .remember-wrap {
    display: flex;
    align-items: center;
    gap: 9px;
    color: rgba(26, 42, 56, 0.8);
    cursor: pointer;
    font-weight: 600;
    user-select: none;
  }

  .remember-wrap input[type="checkbox"] {
    accent-color: #22405E;
    width: 18px;
    height: 18px;
    border-radius: 4px;
    cursor: pointer;
  }

  button.submit {
    width: 100%;
    padding: 15px;
    font-family: inherit;
    font-size: 0.98rem;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #FFFFFF;
    background: linear-gradient(135deg, #22405E 0%, #162C42 100%);
    border: none;
    border-radius: 14px;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 0 8px 24px rgba(34, 64, 94, 0.3);
  }
  button.submit:hover { 
    background: linear-gradient(135deg, #1A324A 0%, #0F1E2E 100%);
    box-shadow: 0 12px 30px rgba(34, 64, 94, 0.4);
    transform: translateY(-2px);
  }
  button.submit:active { transform: translateY(1px) scale(0.99); }

  .form-message {
    text-align: center;
    font-size: 0.85rem;
    font-weight: 800;
    margin-top: 16px;
    min-height: 22px;
  }
  .form-message.error { color: #C9182B; }
  .form-message.success { color: #2E7D4F; }

  /* Unified Brand Footer */
  .brand-credit-footer {
    font-size: 0.78rem;
    color: rgba(26, 42, 56, 0.5);
    margin-top: 26px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
    border-top: 1px solid rgba(34, 64, 94, 0.1);
    padding-top: 18px;
  }

  .brand-credit-footer strong {
    color: #22405E;
    font-weight: 800;
  }

  .brand-credit-footer span.red {
    color: #C9182B;
    font-weight: 800;
  }

  @media (max-width: 900px) {
    body, html { height: auto; overflow-y: auto; }
    .fullscreen-container {
      grid-template-columns: 1fr;
      padding: 40px 24px;
      gap: 32px;
    }
    .form-section { padding-left: 0; max-width: 100%; }
    .character-section { height: auto; }
    .logo-header { text-align: center; }
    h1, .subtitle { text-align: center; }
    .brand-credit-footer { justify-content: center; }
  }
</style>
</head>
<body>

  <!-- Background Grids & Ambient Lighting -->
  <div class="bg-grid"></div>
  <div class="ambient-spot-left"></div>
  <div class="ambient-spot-right"></div>

  <div class="fullscreen-container">

    <!-- LEFT HALF: TOMOE AI CHARACTER STAGE -->
    <div class="character-section">
      <div class="char-stage" id="charStage" title="Click to interact with Tomoe">
        <div class="float-container">
          <div class="shake-layer" id="shakeLayer">
            <div class="tilt-layer" id="tiltLayer">
              <div class="ambient-glow"></div>
              <div class="mark-shadow"></div>

              <svg class="mark-svg" id="markSvg" viewBox="0 0 100 100">
                <rect width="100" height="100" fill="#F4F3EE" opacity="0"/>
                
                <!-- Main Tomoe Calligraphic Emblem -->
                <g transform="translate(3.816 7.258) scale(0.77361)" fill="none" stroke="#22405E" stroke-width="15.000" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M26.5,23.62c2.1,0.95,4.3,0.39,6.47,0.08c14.07-2.03,32.29-4.05,41.9-4.86c4.24-0.36,7.77,1.41,6.23,6.74c-1.78,6.14-3.48,12.8-6.55,22.47"/>
                  <path d="M53.06,24.13c0.94,1.49,0.89,2.87,0.76,4.25C53.25,34.88,52.75,40.88,52,46.5"/>
                  <path d="M31,49.75c5.25-0.5,31.12-3,43-3.5"/>
                  <path d="M28.13,24.5c0.87,0.87,1.29,1.94,1.29,4.03c0,9.72-0.05,35.32-0.05,41.6c0,21,0.5,21.67,31.36,21.67c31.14,0,32.39-5.79,32.26-15.39"/>
                </g>

                <!-- Eye Sockets -->
                <polygon points="40.695,28.446 31.245,29.796 31.245,40.866 39.615,40.191" fill="#22405E"/>
                <polygon points="61.9375,26.024 50.0575,27.239 48.9775,39.524 58.4275,38.714" fill="#22405E"/>

                <!-- Interactive Eyes -->
                <g transform="rotate(-8.13 35.7 34.825)">
                  <rect id="eyeLeft" class="eye" x="32.0" y="31.125" width="7.4" height="7.4"/>
                </g>
                <g transform="rotate(-5.84 54.85 32.875)">
                  <rect id="eyeRight" class="eye" x="50.25" y="28.275" width="9.2" height="9.2"/>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div class="status-text" id="statusText">&nbsp;</div>
    </div>

    <!-- RIGHT HALF: REVV MOTIV LOGIN CONSOLE -->
    <div class="form-section">
      <!-- Clean RevvMotiv Logo Header -->
      <div class="logo-header">
        <img src="{{ asset('images/logo.png') }}" alt="RevvMotiv" class="revv-logo-img" onerror="this.style.display='none'" />
      </div>

      <h1>Welcome back</h1>
      <div class="subtitle">Sign in to access the RevvMotiv management suite</div>

      <form id="loginForm" method="POST" action="{{ route('admin.login.attempt') }}" novalidate>
        @csrf

        <div class="field" id="emailField">
          <label for="email">Administrator Email</label>
          <div class="input-wrap">
            <input
              type="email"
              id="email"
              name="email"
              value="{{ old('email', '') }}"
              autocomplete="email"
              placeholder="admin@revvmotiv.test"
              required
              autofocus
            />
          </div>
        </div>

        <div class="field" id="passwordField">
          <label for="password">Security Password</label>
          <div class="input-wrap">
            <input
              type="password"
              id="password"
              name="password"
              class="pw"
              autocomplete="current-password"
              placeholder="••••••••"
              required
            />
            <button type="button" class="toggle-pw" id="togglePw" aria-label="Show password">
              <svg id="eyeIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </button>
          </div>
          <div class="caps-warning" id="capsWarning">&nbsp;</div>
        </div>

        <div class="options-row">
          <label class="remember-wrap">
            <input type="checkbox" name="remember" value="1" checked />
            <span>Keep me logged in</span>
          </label>
        </div>

        <button type="submit" class="submit" id="submitBtn">Sign In to Dashboard</button>

        @if ($errors->any())
          <div class="form-message error" id="formMessage">{{ $errors->first() }}</div>
        @else
          <div class="form-message" id="formMessage">&nbsp;</div>
        @endif
      </form>

      <!-- Unified Brand Footer -->
      <div class="brand-credit-footer">
        <span>Engineered by <strong>Tomoe</strong></span>
        <span>&bull;</span>
        <span>Powered by <strong class="red">RevvMotiv</strong> Core</span>
      </div>
    </div>

  </div>

<script>
  /* ===================== element refs ===================== */
  const charStage = document.getElementById('charStage');
  const shakeLayer = document.getElementById('shakeLayer');
  const tiltLayer = document.getElementById('tiltLayer');
  const markSvg = document.getElementById('markSvg');
  const eyeLeft = document.getElementById('eyeLeft');
  const eyeRight = document.getElementById('eyeRight');
  const statusText = document.getElementById('statusText');

  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const passwordField = document.getElementById('passwordField');
  const emailField = document.getElementById('emailField');
  const togglePwBtn = document.getElementById('togglePw');
  const eyeIcon = document.getElementById('eyeIcon');
  const capsWarning = document.getElementById('capsWarning');
  const formMessage = document.getElementById('formMessage');
  const loginForm = document.getElementById('loginForm');

  /* ===================== amplified prominent physics ===================== */
  const RANGE_SKEW_X = 40;  // Amplified for dramatic gaze shift
  const RANGE_SKEW_Y = 30;  // Amplified for dramatic vertical tilt
  const RANGE_SCALE  = 0.48; // Pronounced pupil morphing

  function applyEyeTransform(el, x, y, opts) {
    opts = opts || {};
    const squint = opts.squint || 0;   // 0..1 sharp narrowing (error/guarded)
    const alert  = opts.alert  || 0;   // 0..1 dramatic widening (caps-lock)
    const pop    = opts.pop    || 0;   // transient uniform scale bump (success/poke)

    const skewX = x * RANGE_SKEW_X;
    const skewY = y * RANGE_SKEW_Y * 0.8;

    let scaleX = 1 + x * RANGE_SCALE * 0.95 - Math.abs(y) * RANGE_SCALE * 0.55;
    let scaleY = 1 - y * RANGE_SCALE + Math.abs(x) * RANGE_SCALE * 0.45;

    scaleY *= (1 - squint * 0.75);
    scaleY *= (1 + alert * 0.5);
    scaleX *= (1 + alert * 0.25);
    scaleX *= (1 + pop);
    scaleY *= (1 + pop);

    scaleX = Math.max(0.35, Math.min(1.6, scaleX));
    scaleY = Math.max(0.35, Math.min(1.6, scaleY));

    el.style.transform =
      `skewX(${skewX.toFixed(2)}deg) skewY(${skewY.toFixed(2)}deg) ` +
      `scaleX(${scaleX.toFixed(3)}) scaleY(${scaleY.toFixed(3)})`;
  }

  /* ===================== state machine ===================== */
  let showPasswordOn = false;
  let capsLockOn = false;
  let emailFocused = false;
  let passwordFocused = false;

  let errorUntil = 0;
  let successUntil = 0;
  let shakeUntil = 0;
  let popUntil = 0;
  let pokeUntil = 0;

  // Highly prominent poses
  const POSES = {
    idle:            { x: 0,     y: 0,     squint: 0,    alert: 0 },
    email:           { x: 0.05,  y: 0.95,  squint: 0,    alert: 0 },     // Looks way down into the email input
    passwordShow:    { x: 0.95,  y: 0.68,  squint: 0.15, alert: 0.2 },   // Looks directly & curiously at the password
    passwordHide:    { x: -1.3,  y: -0.65, squint: 0.72, alert: 0 },     // Dramatic head turn away + eye squint
    capsAlert:       { x: 0,     y: -0.9,  squint: 0,    alert: 1.4 },   // Wide eyes alert + jumps up
    error:           { x: 0,     y: 0.15,  squint: 0.9,  alert: 0 },     // Furious squint
    success:         { x: 0,     y: 0,     squint: 0,    alert: 0 }
  };

  function resolveMode() {
    const now = performance.now();
    if (now < errorUntil) return POSES.error;
    if (now < successUntil) return POSES.success;
    if (passwordFocused && capsLockOn) return POSES.capsAlert;
    if (passwordFocused) return showPasswordOn ? POSES.passwordShow : POSES.passwordHide;
    if (emailFocused) return POSES.email;
    return null; // idle — ambient mouse gaze
  }

  /* ===================== typing rhythm reactivity (strong visible jitter) ===================== */
  let jitterX = 0, jitterY = 0;
  function pulseJitter() {
    jitterX += (Math.random() - 0.5) * 1.4;
    jitterY += (Math.random() - 0.5) * 0.85;
  }

  /* ===================== continuous 60fps render loop ===================== */
  let curX = 0, curY = 0, curSquint = 0, curAlert = 0;
  let mouseX = 0, mouseY = 0;

  function render() {
    const now = performance.now();
    const mode = resolveMode();

    let targetX, targetY, targetSquint, targetAlert;
    if (mode) {
      targetX = mode.x; targetY = mode.y;
      targetSquint = mode.squint; targetAlert = mode.alert;
    } else {
      // idle: ambient cursor-follow with smooth breathing inertia
      targetX = mouseX * 0.85; targetY = mouseY * 0.85;
      targetSquint = 0; targetAlert = 0;
    }

    // decay typing rhythm jitter
    jitterX *= 0.76; jitterY *= 0.76;

    curX += (targetX + jitterX - curX) * 0.18;
    curY += (targetY + jitterY - curY) * 0.18;
    curSquint += (targetSquint - curSquint) * 0.2;
    curAlert += (targetAlert - curAlert) * 0.2;

    // success or poke scale pop
    let markScale = 1;
    if (now < popUntil) {
      const t = 1 - (popUntil - now) / 550;
      markScale = 1 + Math.sin(t * Math.PI) * 0.24;
    } else if (now < pokeUntil) {
      const t = 1 - (pokeUntil - now) / 380;
      markScale = 1 - Math.sin(t * Math.PI) * 0.18;
    }

    // violent error shake
    let shakeX = 0;
    if (now < shakeUntil) {
      const t = 1 - (shakeUntil - now) / 480;
      shakeX = Math.sin(t * 44) * 20 * (1 - t);
    }

    // 3D perspective rotation (up to 24 degrees)
    const tiltX = -curY * 24;
    const tiltY = curX * 24;
    tiltLayer.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    shakeLayer.style.transform = `translateX(${shakeX.toFixed(2)}px)`;
    markSvg.style.transform = `scale(${markScale.toFixed(3)})`;

    applyEyeTransform(eyeLeft,  curX, curY, { squint: curSquint, alert: curAlert });
    applyEyeTransform(eyeRight, curX, curY, { squint: curSquint, alert: curAlert });

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

  /* ===================== ambient mouse listener ===================== */
  window.addEventListener('mousemove', (e) => {
    const w = window.innerWidth, h = window.innerHeight;
    mouseX = Math.max(-1, Math.min(1, (e.clientX - w / 2) / (w / 2)));
    mouseY = Math.max(-1, Math.min(1, (e.clientY - h / 2) / (h / 2)));
  });

  /* ===================== interactive poke ===================== */
  charStage.addEventListener('click', () => {
    const now = performance.now();
    pokeUntil = now + 380;
    setStatus('Tomoe Active', 'success');
  });

  /* ===================== input focus wiring ===================== */
  emailInput.addEventListener('focus', () => { emailFocused = true; setStatus('Reading email...'); });
  emailInput.addEventListener('blur',  () => { emailFocused = false; if (!passwordFocused) setStatus(''); });
  emailInput.addEventListener('input', pulseJitter);

  passwordInput.addEventListener('focus', () => {
    passwordFocused = true;
    setStatus(showPasswordOn ? 'Observing credentials...' : 'Guarding security key...');
  });
  passwordInput.addEventListener('blur',  () => {
    passwordFocused = false;
    capsWarning.textContent = '\u00A0';
    capsWarning.classList.remove('caps');
    if (!emailFocused) setStatus('');
  });
  passwordInput.addEventListener('input', pulseJitter);

  function updateCapsLock(e) {
    if (typeof e.getModifierState !== 'function') return;
    capsLockOn = e.getModifierState('CapsLock');
    capsWarning.textContent = capsLockOn ? 'Caps Lock is ON' : '\u00A0';
    if (capsLockOn && passwordFocused) {
      setStatus('Caps lock active', 'caps');
    }
  }
  passwordInput.addEventListener('keydown', updateCapsLock);
  passwordInput.addEventListener('keyup', updateCapsLock);

  /* ===================== password show / hide toggle ===================== */
  const EYE_OPEN =
    '<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/>';
  const EYE_CLOSED =
    '<path d="M3 3l18 18"/><path d="M10.6 10.6a3 3 0 0 0 4.24 4.24"/>' +
    '<path d="M6.5 6.6C3.9 8.3 2 12 2 12s4 7 11 7c1.8 0 3.4-.42 4.8-1.1"/>' +
    '<path d="M17.6 17.6C19.9 16 22 12 22 12s-1.6-2.85-4.3-4.8"/>';

  togglePwBtn.addEventListener('click', () => {
    showPasswordOn = !showPasswordOn;
    passwordInput.type = showPasswordOn ? 'text' : 'password';
    eyeIcon.innerHTML = showPasswordOn ? EYE_CLOSED : EYE_OPEN;
    togglePwBtn.setAttribute('aria-label', showPasswordOn ? 'Hide password' : 'Show password');
    setStatus(showPasswordOn ? 'Observing credentials...' : 'Guarding security key...');
    passwordInput.focus();
  });

  /* ===================== error / success triggers ===================== */
  function setStatus(text, kind) {
    statusText.textContent = text || '\u00A0';
    statusText.className = 'status-text' + (kind ? ' ' + kind : '');
  }

  function triggerError(fieldEl, message) {
    const now = performance.now();
    errorUntil = now + 1800;
    shakeUntil = now + 480;
    if (fieldEl) fieldEl.classList.add('field-error');
    formMessage.textContent = message;
    formMessage.className = 'form-message error';
    setStatus(message, 'error');
    if (fieldEl) setTimeout(() => fieldEl.classList.remove('field-error'), 1800);
  }

  function triggerSuccess(message) {
    const now = performance.now();
    successUntil = now + 2200;
    popUntil = now + 550;
    formMessage.textContent = message;
    formMessage.className = 'form-message success';
    setStatus(message, 'success');
  }

  // Handle server-side errors on load
  @if ($errors->any())
    window.addEventListener('DOMContentLoaded', () => {
      triggerError(passwordField, "{{ $errors->first() }}");
    });
  @endif

  // Client validation on submit
  loginForm.addEventListener('submit', (e) => {
    const emailVal = emailInput.value.trim();
    const pwVal = passwordInput.value;
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal);

    if (!emailOk) {
      e.preventDefault();
      triggerError(emailField, 'Enter a valid email address');
      emailInput.focus();
      return;
    }
    if (pwVal.length === 0) {
      e.preventDefault();
      triggerError(passwordField, 'Password is required');
      passwordInput.focus();
      return;
    }

    triggerSuccess('Authenticating master console...');
  });
</script>
</body>
</html>
