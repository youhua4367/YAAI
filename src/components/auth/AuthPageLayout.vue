<template>
  <div class="auth-page">
    <div class="auth-page__bg" aria-hidden="true" />
    <div class="auth-page__stack">
      <div class="auth-card">
        <slot />
      </div>
      <div v-if="$slots.footer" class="auth-page__footer">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  position: relative;
  background: linear-gradient(145deg, #0f172a 0%, #1e3a5f 45%, #0c4da2 100%);
}

.auth-page__bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 50% at 20% 20%, rgba(56, 189, 248, 0.12), transparent),
    radial-gradient(ellipse 60% 40% at 80% 80%, rgba(12, 77, 162, 0.35), transparent);
  pointer-events: none;
}

.auth-page__stack {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: min(96vw, 600px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
}

.auth-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 48px 56px 52px;
  background-color: rgba(0, 0, 0, 0.22);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.38);
  border-radius: 16px;
}

.auth-page__footer {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 15px;
}

.auth-page__footer :deep(a) {
  color: rgba(255, 255, 255, 0.75);
  text-decoration: none;
  transition: color 0.2s;
}

.auth-page__footer :deep(a:hover) {
  color: #38bdf8;
}

.auth-page__footer :deep(.dot) {
  color: rgba(255, 255, 255, 0.35);
  user-select: none;
}

@media (max-width: 480px) {
  .auth-card {
    padding: 36px 24px 40px;
  }
}

.auth-card :deep(.auth-card__title) {
  color: #fff;
  margin: 0 0 36px;
  font-size: 28px;
  font-weight: 600;
  letter-spacing: 2px;
}

.auth-card :deep(.auth-form) {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.auth-card :deep(.auth-box) {
  position: relative;
  width: 100%;
}

.auth-card :deep(.auth-box input) {
  outline: none;
  border: none;
  width: 100%;
  padding: 16px 0;
  margin-bottom: 36px;
  color: #fff;
  font-size: 18px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.82);
  background-color: transparent;
}

.auth-card :deep(.auth-box label) {
  position: absolute;
  top: 0;
  left: 0;
  padding: 16px 0;
  color: rgba(255, 255, 255, 0.9);
  font-size: 18px;
  pointer-events: none;
  transition: all 0.35s ease;
}

.auth-card :deep(.auth-box input:focus + label),
.auth-card :deep(.auth-box input:valid + label) {
  top: -22px;
  color: var(--auth-accent, #03e9f4);
  font-size: 14px;
}

.auth-card :deep(.auth-box--code input) {
  padding-right: 120px;
}

.auth-card :deep(.auth-code-btn) {
  position: absolute;
  right: 0;
  bottom: 44px;
  padding: 6px 12px;
  border: 1px solid rgba(3, 233, 244, 0.6);
  border-radius: 4px;
  background: transparent;
  color: var(--auth-accent, #03e9f4);
  font-size: 13px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.auth-card :deep(.auth-code-btn:hover:not(:disabled)) {
  background: rgba(3, 233, 244, 0.15);
}

.auth-card :deep(.auth-code-btn:disabled) {
  opacity: 0.5;
  cursor: not-allowed;
}

.auth-card :deep(.auth-agreement) {
  width: 100%;
  margin: -12px 0 8px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  color: rgba(255, 255, 255, 0.85);
  font-size: 14px;
  line-height: 1.5;
}

.auth-card :deep(.auth-agreement input) {
  margin-top: 3px;
  accent-color: var(--auth-accent, #03e9f4);
}

.auth-card :deep(.auth-agreement a) {
  color: var(--auth-accent, #03e9f4);
  text-decoration: none;
}

.auth-card :deep(.auth-agreement a:hover) {
  text-decoration: underline;
}

.auth-card :deep(.auth-btn) {
  --auth-accent: #03e9f4;
  position: relative;
  display: inline-block;
  margin-top: 12px;
  min-width: 200px;
  padding: 16px 40px;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: var(--auth-accent);
  background: transparent;
  transition: color 0.35s ease, background-color 0.35s ease, box-shadow 0.35s ease;
  overflow: hidden;
  border-radius: 4px;
}

.auth-card :deep(.auth-btn:disabled) {
  opacity: 0.65;
  cursor: not-allowed;
}

.auth-card :deep(.auth-btn-text) {
  position: relative;
  z-index: 1;
}

.auth-card :deep(.auth-btn:not(:disabled):hover) {
  color: #fff;
  border-radius: 6px;
  background-color: var(--auth-accent);
  box-shadow:
    0 0 5px var(--auth-accent),
    0 0 25px var(--auth-accent),
    0 0 50px var(--auth-accent),
    0 0 100px var(--auth-accent);
}

.auth-card :deep(.auth-btn-edge) {
  position: absolute;
  pointer-events: none;
}

.auth-card :deep(.auth-btn-edge--1) {
  top: 0;
  left: -100%;
  width: 100%;
  height: 3px;
  background: linear-gradient(to right, transparent, var(--auth-accent));
  animation: auth-move1 1s linear infinite;
}

.auth-card :deep(.auth-btn-edge--2) {
  right: 0;
  top: -100%;
  width: 3px;
  height: 100%;
  background: linear-gradient(transparent, var(--auth-accent));
  animation: auth-move2 1s linear 0.25s infinite;
}

.auth-card :deep(.auth-btn-edge--3) {
  right: -100%;
  bottom: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(to left, transparent, var(--auth-accent));
  animation: auth-move3 1s linear 0.5s infinite;
}

.auth-card :deep(.auth-btn-edge--4) {
  left: 0;
  bottom: -100%;
  width: 3px;
  height: 100%;
  background: linear-gradient(var(--auth-accent), transparent);
  animation: auth-move4 1s linear 0.75s infinite;
}

@keyframes auth-move1 {
  0% { left: -100%; }
  50%, 100% { left: 100%; }
}

@keyframes auth-move2 {
  0% { top: -100%; }
  50%, 100% { top: 100%; }
}

@keyframes auth-move3 {
  0% { right: -100%; }
  50%, 100% { right: 100%; }
}

@keyframes auth-move4 {
  0% { bottom: -100%; }
  50%, 100% { bottom: 100%; }
}

.auth-card :deep(.auth-success) {
  width: 100%;
  text-align: center;
  color: #fff;
}

.auth-card :deep(.auth-success__icon) {
  width: 72px;
  height: 72px;
  margin: 0 auto 20px;
  border-radius: 50%;
  background: rgba(16, 185, 129, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  font-weight: 700;
}

.auth-card :deep(.auth-success__title) {
  margin: 0 0 12px;
  font-size: 24px;
  font-weight: 600;
}

.auth-card :deep(.auth-success__message),
.auth-card :deep(.auth-success__hint) {
  margin: 0 0 8px;
  font-size: 15px;
  color: rgba(255, 255, 255, 0.82);
  line-height: 1.6;
}

.auth-card :deep(.auth-success__actions) {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-top: 28px;
}

.auth-card :deep(.auth-success__actions a) {
  padding: 12px 28px;
  border-radius: 6px;
  font-size: 15px;
  text-decoration: none;
  transition: opacity 0.2s;
}

.auth-card :deep(.auth-success__actions a:hover) {
  opacity: 0.9;
}

.auth-card :deep(.auth-success__actions .is-primary) {
  background: var(--auth-accent, #03e9f4);
  color: #0f172a;
  font-weight: 600;
}

.auth-card :deep(.auth-success__actions .is-default) {
  border: 1px solid rgba(255, 255, 255, 0.45);
  color: rgba(255, 255, 255, 0.9);
}

@media (max-width: 480px) {
  .auth-card :deep(.auth-card__title) {
    font-size: 24px;
    margin-bottom: 28px;
  }

  .auth-card :deep(.auth-box input),
  .auth-card :deep(.auth-box label) {
    font-size: 16px;
    padding: 14px 0;
  }

  .auth-card :deep(.auth-btn) {
    min-width: 100%;
    padding: 14px 24px;
    font-size: 17px;
  }
}
</style>
