(function () {
  const attractions = Array.isArray(window.ATTRACTIONS) ? window.ATTRACTIONS : [];
  const page = document.body.dataset.page;

  function createCard(item) {
    return `
      <article class="card">
        <div class="card-cover" style="background:${item.hero}">
          <span class="eyebrow">${item.city}</span>
          <h3>${item.name}</h3>
          <p>${item.highlight}</p>
        </div>
        <div class="card-body">
          <div class="tag-row">${item.theme.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
          <p>${item.intro}</p>
          <div class="meta-grid">
            <div class="meta-item"><span>推荐季节</span><strong>${item.bestTime}</strong></div>
            <div class="meta-item"><span>建议时长</span><strong>${item.duration}</strong></div>
          </div>
          <a class="button primary" href="/detail.html?id=${item.id}">查看攻略</a>
        </div>
      </article>
    `;
  }

  function renderHome() {
    const container = document.getElementById("featured-grid");
    if (!container) return;
    container.innerHTML = attractions.slice(0, 6).map(createCard).join("");
  }

  function renderList() {
    const grid = document.getElementById("list-grid");
    const seasonFilter = document.getElementById("season-filter");
    const keywordInput = document.getElementById("keyword-input");
    if (!grid) return;

    const update = function () {
      const season = seasonFilter ? seasonFilter.value : "all";
      const keyword = keywordInput ? keywordInput.value.trim().toLowerCase() : "";
      const filtered = attractions.filter((item) => {
        const seasonMatch = season === "all" || item.season === season;
        const text = [item.name, item.city, item.intro, item.highlight, item.theme.join(" ")].join(" ").toLowerCase();
        const keywordMatch = !keyword || text.includes(keyword);
        return seasonMatch && keywordMatch;
      });

      if (!filtered.length) {
        grid.innerHTML = '<div class="empty-state">没有找到匹配的景点，试试更换季节或关键词。</div>';
        return;
      }

      grid.innerHTML = filtered.map(createCard).join("");
    };

    seasonFilter && seasonFilter.addEventListener("change", update);
    keywordInput && keywordInput.addEventListener("input", update);
    update();
  }

  function renderDetail() {
    const root = document.getElementById("detail-root");
    if (!root) return;

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const item = attractions.find((entry) => entry.id === id) || attractions[0];

    if (!item) {
      root.innerHTML = '<section class="surface empty-state">暂无景点数据。</section>';
      return;
    }

    root.innerHTML = `
      <section class="detail-hero">
        <div class="detail-hero-cover" style="background:${item.hero}">
          <div>
            <span class="eyebrow">${item.city} · ${item.duration}</span>
            <h1>${item.name}</h1>
            <p>${item.highlight}</p>
            <div class="detail-tags">${item.theme.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
          </div>
        </div>
      </section>
      <section class="detail-grid">
        <div class="detail-content">
          <article class="content-section">
            <span class="eyebrow">景点概览</span>
            <h2>为什么值得去</h2>
            <p>${item.intro}</p>
            <p>${item.suitableFor}</p>
          </article>
          <article class="content-section">
            <span class="eyebrow">经典路线</span>
            <h2>推荐游玩顺序</h2>
            <div class="timeline">
              ${item.route.map((step, index) => `<article><span>第 ${index + 1} 站</span><h3>${step}</h3></article>`).join("")}
            </div>
          </article>
          <article class="content-section">
            <span class="eyebrow">吃住推荐</span>
            <h2>当地味道与落脚建议</h2>
            <div class="info-grid">
              <div class="info-box">
                <span>美食推荐</span>
                <ul>${item.food.map((entry) => `<li>${entry}</li>`).join("")}</ul>
              </div>
              <div class="info-box">
                <span>住宿建议</span>
                <ul>${item.stay.map((entry) => `<li>${entry}</li>`).join("")}</ul>
              </div>
            </div>
          </article>
          <article class="content-section">
            <span class="eyebrow">出行贴士</span>
            <h2>避免踩坑的小提醒</h2>
            <ul>${item.tips.map((entry) => `<li>${entry}</li>`).join("")}</ul>
          </article>
        </div>
        <aside class="detail-content">
          <article class="content-section">
            <span class="eyebrow">基础信息</span>
            <div class="info-grid">
              <div class="info-box"><span>最佳时间</span><strong>${item.bestTime}</strong></div>
              <div class="info-box"><span>开放时间</span><strong>${item.openingHours}</strong></div>
              <div class="info-box"><span>门票信息</span><strong>${item.ticket}</strong></div>
              <div class="info-box"><span>交通方式</span><strong>${item.transportation}</strong></div>
            </div>
          </article>
          <article class="content-section">
            <span class="eyebrow">适合人群</span>
            <p>${item.suitableFor}</p>
          </article>
          <article class="content-section">
            <span class="eyebrow">返回浏览</span>
            <a class="button primary" href="/attractions.html">查看更多景点</a>
          </article>
        </aside>
      </section>
    `;
    document.title = `Trip | ${item.name}`;
  }

  if (page === "home") renderHome();
  if (page === "list") renderList();
  if (page === "detail") renderDetail();
})();
