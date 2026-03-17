// 等待页面完全加载后再执行
window.onload = function() {
    // 1. 获取基础元素
    var cgOverlay = document.getElementById('cg-ui-overlay');
    var btnContainer = document.querySelector('.btn-container');
    var cgBtn = null;

    // 查找写着 "CG" 的按钮
    var buttons = document.querySelectorAll('.nav-btn');
    for (var i = 0; i < buttons.length; i++) {
        if (buttons[i].innerText.trim() === 'CG') {
            cgBtn = buttons[i];
            break;
        }
    }

    // 如果找不到元素，打印错误方便调试
    if (!cgOverlay || !btnContainer) {
        console.error("找不到必要的元素！请检查 HTML");
        // 即使找不到按钮，也不阻止后续代码执行，因为可能按钮是通过 onclick 直接调用的
    }

    // 2. 点击 CG 按钮的事件 (如果找到了按钮)
    if (cgBtn) {
        cgBtn.addEventListener('click', function() {
            console.log("点击了 CG，切换界面...");
            // 👇 新增：获取 Logo 元素并隐藏它
            var logo = document.querySelector('.logo');
            if (logo) {
                logo.style.display = 'none';
            }
             // 👇👇👇 【关键新增】彻底清除主界面背景，防止透出 👇👇👇
            document.body.style.backgroundImage = 'none';   // 移除背景图
            document.body.style.backgroundColor = '#000000'; // 强制设为纯黑底（防止白边）
            // 👆👆👇 结束新增 👆👆👆
            cgOverlay.style.display = 'flex';
            btnContainer.style.display = 'none';
            // 👇 建议新增：禁止页面滚动，防止露馅
            document.body.style.overflow = 'hidden';
        });
    }
/* =========================================
   【修正】全屏查看逻辑 (统一入口)
   ========================================= */
/* =========================================
   【修正】全屏查看逻辑 (支持 m/n 版本切换)
   ========================================= */
(function() {
    // 1. 获取元素
    const overlay = document.getElementById('fullscreen-overlay');
    const fullscreenImg = document.getElementById('fullscreen-img');

    if (!overlay || !fullscreenImg) {
        console.warn("全屏组件未找到，跳过初始化");
        return;
    }

    // --- 内部变量：只在当前函数内有效，不干扰外部 ---
    let imageArray = []; 
    let currentIndex = 0;

    // --- 辅助函数：检测图片是否存在 ---
    function checkImageExists(src, callback) {
        const img = new Image();
        img.onload = function() { callback(true); };
        img.onerror = function() { callback(false); };
        img.src = src;
    }

    // --- 核心函数：建立映射关系并填充数组 ---
    function buildVariants(baseSrc) {
        imageArray = []; // 清空旧数据
        
        // 解析路径和文件名
        const cleanSrc = baseSrc.split('?')[0]; 
        const lastSlash = cleanSrc.lastIndexOf('/');
        const dir = (lastSlash !== -1) ? cleanSrc.substring(0, lastSlash + 1) : '';
        
        const filename = cleanSrc.substring(lastSlash + 1);
        const dotIndex = filename.lastIndexOf('.');
        
        if (dotIndex === -1) {
            imageArray.push(baseSrc);
            openFullscreen();
            return;
        }

        const name = filename.substring(0, dotIndex); 
        const ext = filename.substring(dotIndex);

        // 1. 原图必选
        imageArray.push(baseSrc);

        // 2. 推导 m 和 n
        const mPath = dir + name + 'm' + ext;
        const nPath = dir + name + 'n' + ext;

        let checksFinished = 0;
        const totalChecks = 2;

        function onCheckComplete() {
            checksFinished++;
            if (checksFinished === totalChecks) {
                openFullscreen();
            }
        }

        checkImageExists(mPath, function(exists) {
            if (exists) imageArray.push(mPath);
            onCheckComplete();
        });

        checkImageExists(nPath, function(exists) {
            if (exists) imageArray.push(nPath);
            onCheckComplete();
        });
    }

    function openFullscreen() {
        if (imageArray.length === 0) return;
        currentIndex = 0;
        fullscreenImg.src = imageArray[currentIndex];
        overlay.style.display = 'flex';
    }

    // 绑定点击事件
    document.querySelectorAll('.cg-row img, .scene-row img, #scene-ui-overlay .scene-row img').forEach(img => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', function(e) {
            e.stopPropagation();
            buildVariants(this.src);
        });
    });

    // 绑定遮罩层点击 (切换或关闭)
    overlay.addEventListener('click', function() {
        if (currentIndex < imageArray.length - 1) {
            currentIndex++;
            fullscreenImg.src = imageArray[currentIndex];
        } else {
            overlay.style.display = 'none';
            setTimeout(() => { fullscreenImg.src = ''; }, 200);
            imageArray = [];
        }
    });

    // ESC 关闭
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && overlay.style.display === 'flex') {
            overlay.style.display = 'none';
            fullscreenImg.src = '';
            imageArray = [];
        }
    });
})();

};

// 4. 返回按钮的功能
function goBack() {
    var cgOverlay = document.getElementById('cg-ui-overlay');
    var btnContainer = document.querySelector('.btn-container');

    // 👇 新增：获取 Logo 元素并重新显示它
    var logo = document.querySelector('.logo');

    if (cgOverlay && btnContainer) {
        console.log("点击返回，恢复主界面...");
        cgOverlay.style.display = 'none';
        btnContainer.style.display = 'flex';
        
        // 👇 新增：显示 Logo
        if (logo) {
            logo.style.display = 'block'; // 或者用 '' 恢复默认
        }
        // 👉👉👉【关键新增】恢复主界面背景图 👉👉👉
        // ⚠️ 注意：请将 'bg.jpg' 替换为您 index.html 中 <body> 标签里实际使用的图片文件名！
        // 例如：如果是 url('images/background.png')，这里就写 "url('images/background.png')"
        document.body.style.backgroundImage = "url('images/background.png')"; 
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";
        document.body.style.backgroundRepeat = "no-repeat";
        // 👆👆👆 结束新增 👆👆👆
        // 返回时确保滚动恢复
        document.body.style.overflow = '';
        // 5. 恢复动画（您原有的代码）
        var rows = document.querySelectorAll('.cg-row');
        rows.forEach(function(row) {
            row.style.animationPlayState = 'running';
        });
    }
}





/**
 * 修复图片悬停被下一行遮挡的问题
 * 逻辑：当鼠标进入某一行时，临时将该行的 z-index 提至最高
 */
(function() {
    // 等待 DOM 加载完成（如果 script 在 head 中需要，如果在 body 底部可省略，但加上更稳妥）
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFix);
    } else {
        initFix();
    }

    function initFix() {
        const rows = document.querySelectorAll('.cg-row');
        
        rows.forEach(row => {
            // 1. 鼠标移入：提升整行层级
            row.addEventListener('mouseenter', () => {
                // 备份原始 z-index (防止覆盖内联样式)
                if (!row.dataset.originalZ) {
                    row.dataset.originalZ = row.style.zIndex;
                }
                // 设置为极大值，确保盖住其他行
                row.style.zIndex = '1000';
                // 强制重绘，确保某些浏览器立即生效
                row.style.transform = row.style.transform || 'translateZ(0)';
            });

            // 2. 鼠标移出：恢复层级
            row.addEventListener('mouseleave', () => {
                // 恢复备份的值
                row.style.zIndex = row.dataset.originalZ || '';
            });
        });
    }
})();


/* =========================================
   【新增】场景界面 (Scene) 控制逻辑
   ========================================= */

// 1. 打开场景界面
function showScene() {
    console.log("点击了场景，切换界面...");
    
    // 获取元素
    var sceneOverlay = document.getElementById('scene-ui-overlay');
    var btnContainer = document.querySelector('.btn-container');
    var logo = document.querySelector('.logo');

    // 安全检查
    if (!sceneOverlay) {
        console.error("找不到场景界面容器 (scene-ui-overlay)！");
        return;
    }

    // --- 执行切换动作 ---
    
    // A. 隐藏主界面元素
    if (btnContainer) btnContainer.style.display = 'none';
    if (logo) logo.style.display = 'none';

    // B. 彻底清除主界面背景 (同CG逻辑，防止透出)
    // 备份原始背景到 dataset，方便恢复时读取 (可选优化，这里先沿用硬编码恢复逻辑)
    document.body.style.backgroundImage = 'none';   
    document.body.style.backgroundColor = '#000000'; 

    // C. 显示场景界面
    sceneOverlay.style.display = 'flex'; // 确保使用 flex 居中布局

    // D. 禁止页面滚动
    document.body.style.overflow = 'hidden';
}

// 2. 关闭场景界面 (返回主菜单)
function closeScene() {
    var sceneOverlay = document.getElementById('scene-ui-overlay');
    var btnContainer = document.querySelector('.btn-container');
    var logo = document.querySelector('.logo');

    if (sceneOverlay && btnContainer) {
        console.log("点击返回，恢复主界面...");
        
        // A. 隐藏场景界面
        sceneOverlay.style.display = 'none';
        
        // B. 恢复主界面元素
        btnContainer.style.display = 'flex';
        if (logo) logo.style.display = 'block';

        // C. 恢复主界面背景图
        // ⚠️ 注意：请确保这里的图片路径与你 index.html <body> 中的背景图一致！
        // 如果你的背景图在 CSS 里写的，这里可能需要调整。
        // 假设你的背景图是 'images/background.png' (参考 goBack 函数)
        document.body.style.backgroundImage = "url('images/background.png')"; 
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";
        document.body.style.backgroundRepeat = "no-repeat";
        
        // D. 恢复页面滚动
        document.body.style.overflow = '';
    }
}

// 3. (可选) 自动绑定逻辑 - 如果你不想在 HTML 里写 onclick="showScene()"
// 这段代码会自动寻找文字为 "场景" 的按钮并绑定事件，模仿 CG 按钮的逻辑
(function() {
    var buttons = document.querySelectorAll('.nav-btn');
    var sceneBtn = null;

    for (var i = 0; i < buttons.length; i++) {
        if (buttons[i].innerText.trim() === '场景') {
            sceneBtn = buttons[i];
            break;
        }
    }

    if (sceneBtn) {
        sceneBtn.addEventListener('click', function(e) {
            e.preventDefault(); // 防止默认行为
            showScene();
        });
        console.log("已自动为 [场景] 按钮绑定点击事件");
    }
})();


// ================= 全局变量配置 =================
let currentGalleryIndex = 1;
const totalGalleryImages = 22;

// ================= 立绘界面功能 =================

// 1. 打开立绘界面
function showGallery() {
    console.log("进入立绘界面...");
    
    var galleryOverlay = document.getElementById('gallery-overlay');
    var btnContainer = document.querySelector('.btn-container');
    var logo = document.querySelector('.logo');
    var galleryImg = document.getElementById('gallery-img');

    if (!galleryOverlay) return;

    // A. 隐藏主界面
    if (btnContainer) btnContainer.style.display = 'none';
    if (logo) logo.style.display = 'none';

    // B. 清除主背景
    document.body.style.backgroundImage = 'none';   
    document.body.style.backgroundColor = '#000000'; 

    // C. 重置并显示第一张
    currentGalleryIndex = 1;
    updateGalleryImageDisplay();

    // D. 显示界面
    galleryOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// 2. 关闭立绘界面
function closeGallery() {
    var galleryOverlay = document.getElementById('gallery-overlay');
    var btnContainer = document.querySelector('.btn-container');
    var logo = document.querySelector('.logo');

    if (galleryOverlay && btnContainer) {
        galleryOverlay.style.display = 'none';
        
        btnContainer.style.display = 'flex';
        if (logo) logo.style.display = 'block';

        // 恢复背景 (请确认你的背景图路径)
        document.body.style.backgroundImage = "url('images/background.png')"; 
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";
        document.body.style.backgroundRepeat = "no-repeat";
        document.body.style.backgroundColor = '';
        
        document.body.style.overflow = '';
    }
}

// 3. 更新图片显示 (辅助函数)
function updateGalleryImageDisplay() {
    var galleryImg = document.getElementById('gallery-img');
    if (!galleryImg) return;

    var imagePath = "images/gallery" + currentGalleryIndex + ".png";
    
    // 简单的淡入效果优化体验
    galleryImg.style.opacity = 0;
    
    var tempImg = new Image();
    tempImg.src = imagePath;
    
    tempImg.onload = function() {
        galleryImg.src = imagePath;
        galleryImg.alt = "立绘 " + currentGalleryIndex + "/" + totalGalleryImages;
        // 加载完成后淡入
        setTimeout(function(){ galleryImg.style.opacity = 1; }, 50);
    };
    
    tempImg.onerror = function() {
        console.error("图片不存在: " + imagePath);
        galleryImg.style.opacity = 1; // 即使失败也显示出来（显示破图图标或alt文字）
    };
}

// ================= 核心交互逻辑 =================

// 【左键点击】 -> 下一张
function handleGalleryClick(event) {
    // 防止事件冒泡或其他干扰
    event.stopPropagation();
    
    nextGalleryImage();
}

// 【右键点击】 -> 上一张
function handleGalleryRightClick(event) {
    // 【关键】阻止浏览器默认的右键菜单弹出
    if (event.preventDefault) {
        event.preventDefault();
    } else {
        event.returnValue = false; // 兼容旧版IE
    }
    
    prevGalleryImage();
    return false;
}

// 下一张逻辑
function nextGalleryImage() {
    currentGalleryIndex++;
    if (currentGalleryIndex > totalGalleryImages) {
        currentGalleryIndex = 1; // 循环到第一张
    }
    updateGalleryImageDisplay();
    console.log("左键：下一张 -> " + currentGalleryIndex);
}

// 上一张逻辑
function prevGalleryImage() {
    currentGalleryIndex--;
    if (currentGalleryIndex < 1) {
        currentGalleryIndex = totalGalleryImages; // 循环到最后一张
    }
    updateGalleryImageDisplay();
    console.log("右键：上一张 -> " + currentGalleryIndex);
}