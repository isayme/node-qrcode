
const indexHtml = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>二维码生成器</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap" rel="stylesheet">
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Geist', 'system-ui', 'sans-serif'],
          },
          colors: {
            background: 'oklch(1 0 0)',
            foreground: 'oklch(0.145 0 0)',
            card: 'oklch(1 0 0)',
            border: 'oklch(0.922 0 0)',
            muted: {
              DEFAULT: 'oklch(0.97 0 0)',
              foreground: 'oklch(0.556 0 0)',
            },
            ring: 'oklch(0.708 0 0)',
          },
          borderRadius: {
            lg: '0.625rem',
            xl: 'calc(0.625rem + 4px)',
            '2xl': 'calc(0.625rem + 8px)',
          },
        }
      }
    }
  </script>
  <style>
    body {
      min-height: 100vh;
      background-color: oklch(1 0 0);
      font-family: 'Geist', system-ui, sans-serif;
    }
  </style>
</head>
<body class="flex flex-col items-center" style="padding-top: calc(100vh * 0.382 - 200px);">
  <div class="flex flex-col items-center gap-8">
    <!-- 标题 -->
    <div class="text-center">
      <h1 class="text-3xl font-bold tracking-tight" style="color: oklch(0.145 0 0);">
        二维码生成器
      </h1>
      <p class="mt-2" style="color: oklch(0.556 0 0);">
        输入文本或链接，即时生成二维码
      </p>
    </div>

    <!-- 二维码展示区域 -->
    <div id="qrContainer" class="rounded-2xl p-3 shadow-lg" style="background-color: oklch(1 0 0); box-shadow: 0 0 0 1px oklch(0.922 0 0), 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);">
      <img 
        id="qrImage"
        alt="QR Code" 
        width="256" 
        height="256"
        class="rounded-lg"
      >
      <div 
        id="qrPlaceholder" 
        class="hidden w-64 h-64 rounded-lg flex items-center justify-center"
        style="background-color: oklch(0.97 0 0); color: oklch(0.556 0 0);"
      >
        请输入内容
      </div>
    </div>

    <!-- 输入框 -->
    <div class="w-full max-w-sm">
      <input 
        type="text" 
        id="qrInput"
        value=""
        placeholder="输入文本或链接..."
        class="w-full h-12 px-3 text-base text-center rounded-lg transition-all"
        style="border: 1px solid oklch(0.922 0 0); background-color: transparent; outline: none;"
        onfocus="this.style.boxShadow='0 0 0 2px oklch(0.708 0 0 / 0.5)'; this.style.borderColor='oklch(0.708 0 0)';"
        onblur="this.style.boxShadow='none'; this.style.borderColor='oklch(0.922 0 0)';"
      >
    </div>

    <!-- 复制按钮 -->
    <button 
      id="copyBtn"
      class="h-9 px-4 text-sm font-medium rounded-lg flex items-center gap-2 transition-colors"
      style="border: 1px solid oklch(0.922 0 0); background-color: transparent; color: oklch(0.145 0 0);"
      onmouseenter="this.style.backgroundColor='oklch(0.97 0 0)';"
      onmouseleave="this.style.backgroundColor='transparent';"
    >
      <svg id="copyIcon" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke-width="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke-width="2"></path>
      </svg>
      <svg id="checkIcon" class="w-4 h-4 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <polyline points="20 6 9 17 4 12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></polyline>
      </svg>
      <span id="copyText">复制二维码地址</span>
    </button>
  </div>

  <script>
    const input = document.getElementById('qrInput');
    const qrImage = document.getElementById('qrImage');
    const qrPlaceholder = document.getElementById('qrPlaceholder');
    const copyBtn = document.getElementById('copyBtn');
    const copyIcon = document.getElementById('copyIcon');
    const checkIcon = document.getElementById('checkIcon');
    const copyText = document.getElementById('copyText');
    
    qrImage.src = window.location.href + "get?text=" + encodeURIComponent(window.location.href)

    let debounceTimer;

    function getApiUrl(text) {
      return window.location.href + "get?text=" + encodeURIComponent(text);
    }

    function updateQRCode(text) {
      if (text.trim()) {
        qrImage.src = getApiUrl(text);
        qrImage.classList.remove('hidden');
        qrPlaceholder.classList.add('hidden');
        copyBtn.disabled = false;
        copyBtn.style.opacity = '1';
        copyBtn.style.cursor = 'pointer';
      } else {
        qrImage.classList.add('hidden');
        qrPlaceholder.classList.remove('hidden');
        qrPlaceholder.style.display = 'flex';
        copyBtn.disabled = true;
        copyBtn.style.opacity = '0.5';
        copyBtn.style.cursor = 'not-allowed';
      }
    }

    input.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        updateQRCode(e.target.value);
      }, 300);
    });

    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(qrImage.src);
        copyIcon.classList.add('hidden');
        checkIcon.classList.remove('hidden');
        copyText.textContent = '已复制';
        
        setTimeout(() => {
          copyIcon.classList.remove('hidden');
          checkIcon.classList.add('hidden');
          copyText.textContent = '复制二维码地址';
        }, 2000);
      } catch (err) {
        console.error('复制失败:', err);
      }
    });
  </script>
</body>
</html>
`

export default indexHtml
