/**
 * Generates a complete, valid Google Blogger (Blogspot) XML/HTML Theme
 * with RED LINE Branding, Breaking News Ticker, Live Date/Time, Newspaper Card Grid,
 * Single Post View, Blogger Native Comment system, and Mobile Responsiveness.
 */

export function generateBloggerThemeCode(options?: { blogTitle?: string; logoUrl?: string }): string {
  const title = options?.blogTitle || 'RED LINE';
  const logo = options?.logoUrl || 'https://raw.githubusercontent.com/redline-news/assets/main/logo.png';

  return `<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE html>
<html b:version='2' class='v2' expr:dir='data:blog.languageDirection' xmlns='http://www.w3.org/1999/xhtml' xmlns:b='http://www.google.com/2005/gml/b' xmlns:data='http://www.google.com/2005/gml/data' xmlns:expr='http://www.google.com/2005/gml/expr'>
<head>
  <meta charset='UTF-8'/>
  <meta content='width=device-width, initial-scale=1.0' name='viewport'/>
  <title><data:blog.pageTitle/></title>
  <b:include data='blog' name='all-head-content'/>

  <!-- Google Fonts for Bengali Newspaper Typography -->
  <link href='https://fonts.googleapis.com' rel='preconnect'/>
  <link crossorigin='' href='https://fonts.gstatic.com' rel='preconnect'/>
  <link href='https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&amp;family=Plus+Jakarta+Sans:wght@600;700;800&amp;display=swap' rel='stylesheet'/>

  <b:skin><![CDATA[
  /* -----------------------------------------------------------------
     RED LINE NEWS PORTAL - BLOGGER TEMPLATE
     Designed for Bengali News Media & Breaking News Portal
     Somoy TV / Modern Newspaper Style Layout
  ----------------------------------------------------------------- */

  :root {
    --primary-red: #DC2626;
    --primary-dark-red: #B91C1C;
    --dark-bg: #0F172A;
    --body-bg: #F8F9FA;
    --text-main: #1E293B;
    --text-muted: #64748B;
    --border-color: #E2E8F0;
    --font-bengali: 'Hind Siliguri', -apple-system, sans-serif;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    background-color: var(--body-bg);
    color: var(--text-main);
    font-family: var(--font-bengali);
    font-size: 16px;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }

  a {
    color: inherit;
    text-decoration: none;
    transition: color 0.2s ease;
  }

  a:hover {
    color: var(--primary-red);
  }

  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  .container {
    max-width: 1240px;
    margin: 0 auto;
    padding: 0 16px;
  }

  /* TOP BAR - TIME, DATE & SOCIAL */
  .top-bar {
    background: #0F172A;
    color: #94A3B8;
    font-size: 13px;
    padding: 8px 0;
    border-bottom: 2px solid var(--primary-red);
  }

  .top-bar-inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
  }

  .live-time-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: #F1F5F9;
    font-weight: 500;
  }

  .live-dot {
    width: 8px;
    height: 8px;
    background: #22C55E;
    border-radius: 50%;
    display: inline-block;
  }

  /* BRAND HEADER */
  .main-header {
    background: #FFFFFF;
    padding: 16px 0;
    border-bottom: 1px solid var(--border-color);
  }

  .header-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .brand-logo-area {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .brand-logo-img {
    height: 52px;
    width: 52px;
    border-radius: 50%;
    object-fit: cover;
  }

  .brand-title {
    font-size: 28px;
    font-weight: 800;
    letter-spacing: -0.5px;
    color: #0F172A;
    line-height: 1;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .brand-title span {
    color: var(--primary-red);
  }

  .brand-slogan {
    font-size: 13px;
    color: var(--text-muted);
    margin-top: 3px;
  }

  /* NAVIGATION BAR */
  .nav-bar {
    background: #1E293B;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  .nav-menu {
    display: flex;
    list-style: none;
    overflow-x: auto;
    white-space: nowrap;
  }

  .nav-menu li a {
    display: block;
    color: #F8FAFC;
    padding: 12px 18px;
    font-weight: 600;
    font-size: 15px;
    border-bottom: 3px solid transparent;
  }

  .nav-menu li a:hover,
  .nav-menu li.active a {
    background: #0F172A;
    color: #FFFFFF;
    border-bottom-color: var(--primary-red);
  }

  /* BREAKING NEWS TICKER */
  .breaking-ticker {
    background: #FFFFFF;
    border: 1px solid #FECACA;
    margin: 16px auto;
    border-radius: 6px;
    display: flex;
    align-items: center;
    overflow: hidden;
  }

  .breaking-badge {
    background: var(--primary-red);
    color: #FFFFFF;
    padding: 10px 18px;
    font-weight: 700;
    font-size: 14px;
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .ticker-marquee {
    flex: 1;
    padding: 0 16px;
    white-space: nowrap;
    overflow: hidden;
    font-weight: 600;
    color: #1E293B;
  }

  /* MAIN CONTENT LAYOUT */
  .site-content {
    margin: 20px 0 40px;
  }

  .layout-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;
  }

  @media (min-width: 992px) {
    .layout-grid {
      grid-template-columns: 8fr 4fr;
    }
  }

  /* POST CARDS & GRID */
  .post-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
  }

  @media (min-width: 640px) {
    .post-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .news-card {
    background: #FFFFFF;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid var(--border-color);
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    display: flex;
    flex-direction: column;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .news-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px -2px rgba(0,0,0,0.08);
  }

  .card-thumb {
    position: relative;
    aspect-ratio: 16/9;
    background: #E2E8F0;
    overflow: hidden;
  }

  .card-thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .news-card:hover .card-thumb img {
    transform: scale(1.04);
  }

  .card-body {
    padding: 16px;
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .card-meta {
    font-size: 12px;
    color: var(--text-muted);
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .card-category {
    color: var(--primary-red);
    font-weight: 700;
  }

  .card-title {
    font-size: 18px;
    font-weight: 700;
    line-height: 1.4;
    margin-bottom: 10px;
    color: #0F172A;
  }

  .card-snippet {
    font-size: 14px;
    color: #475569;
    line-height: 1.6;
    margin-bottom: 12px;
    flex: 1;
  }

  .read-more-btn {
    font-size: 13px;
    font-weight: 600;
    color: var(--primary-red);
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  /* SINGLE POST VIEW (নিউজপ্রিন্ট / ফুল নিউজ) */
  .single-post-view {
    background: #FFFFFF;
    border-radius: 8px;
    padding: 24px;
    border: 1px solid var(--border-color);
  }

  .single-headline {
    font-size: 32px;
    font-weight: 800;
    line-height: 1.3;
    color: #0F172A;
    margin-bottom: 16px;
  }

  .post-byline {
    padding: 12px 0;
    border-top: 1px solid var(--border-color);
    border-bottom: 1px solid var(--border-color);
    margin-bottom: 20px;
    font-size: 14px;
    color: var(--text-muted);
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px;
  }

  .single-featured-image {
    margin-bottom: 24px;
    border-radius: 6px;
    overflow: hidden;
  }

  .post-body-content {
    font-size: 18px;
    line-height: 1.8;
    color: #1E293B;
  }

  .post-body-content p {
    margin-bottom: 18px;
  }

  /* COMMENTS SECTION */
  .comments-wrapper {
    margin-top: 40px;
    padding-top: 24px;
    border-top: 2px solid var(--border-color);
  }

  .comments-title {
    font-size: 20px;
    font-weight: 700;
    color: #0F172A;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  /* SIDEBAR */
  .sidebar-box {
    background: #FFFFFF;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 24px;
  }

  .sidebar-header {
    border-bottom: 2px solid var(--primary-red);
    padding-bottom: 8px;
    margin-bottom: 16px;
    font-size: 18px;
    font-weight: 700;
    color: #0F172A;
  }

  /* FOOTER */
  .main-footer {
    background: #0F172A;
    color: #94A3B8;
    padding: 40px 0 20px;
    margin-top: 60px;
  }

  .footer-bottom {
    border-top: 1px solid #334155;
    margin-top: 30px;
    padding-top: 20px;
    text-align: center;
    font-size: 13px;
  }
  ]]></b:skin>
</head>

<body>
  <!-- TOP BAR: LIVE CLOCK & DATE -->
  <header class='top-bar'>
    <div class='container top-bar-inner'>
      <div class='live-time-badge'>
        <span class='live-dot'></span>
        <span id='bengaliClock'>ঢাকা · লাইভ নিউজ পোর্টাল</span>
      </div>
      <div>
        <span>অনলাইন সংস্করণ | সত্যের সন্ধানে নির্ভীক</span>
      </div>
    </div>
  </header>

  <!-- BRAND HEADER WITH RED LINE LOGO -->
  <div class='main-header'>
    <div class='container header-wrap'>
      <div class='brand-logo-area'>
        <img alt='${title}' class='brand-logo-img' src='${logo}'/>
        <div>
          <h1 class='brand-title'>RED <span>LINE</span></h1>
          <p class='brand-slogan'>২৪ ঘণ্টা তাজা খবর ও বস্তুনিষ্ঠ সাংবাদিকতা</p>
        </div>
      </div>
    </div>
  </div>

  <!-- NAVIGATION BAR -->
  <nav class='nav-bar'>
    <div class='container'>
      <ul class='nav-menu'>
        <li class='active'><a expr:href='data:blog.homepageUrl'>প্রচ্ছদ</a></li>
        <li><a href='/search/label/জাতীয়'>জাতীয়</a></li>
        <li><a href='/search/label/রাজনীতি'>রাজনীতি</a></li>
        <li><a href='/search/label/আন্তর্জাতিক'>আন্তর্জাতিক</a></li>
        <li><a href='/search/label/অর্থনীতি'>অর্থনীতি</a></li>
        <li><a href='/search/label/খেলাধুলা'>খেলাধুলা</a></li>
        <li><a href='/search/label/তথ্যপ্রযুক্তি'>তথ্যপ্রযুক্তি</a></li>
        <li><a href='/search/label/বিনোদন'>বিনোদন</a></li>
      </ul>
    </div>
  </nav>

  <div class='container'>
    <!-- BREAKING NEWS TICKER -->
    <div class='breaking-ticker'>
      <div class='breaking-badge'>
        <span>⚡ ব্রেকিং নিউজ</span>
      </div>
      <div class='ticker-marquee'>
        <marquee behavior='scroll' direction='left' onmouseout='this.start()' onmouseover='this.stop()' scrollamount='5'>
          স্বাগতম RED LINE নিউজ পোর্টালে · বস্তুনিষ্ঠ ও নিরপেক্ষ খবর পেতে আমাদের সাথেই থাকুন · নতুন খবরের আপডেট পেতে ফেসবুক পেজ ফলো করুন
        </marquee>
      </div>
    </div>

    <!-- MAIN BODY GRID -->
    <div class='site-content'>
      <div class='layout-grid'>
        <!-- POSTS SECTION -->
        <main class='main-articles'>
          <b:section class='main' id='main' showaddelement='yes'>
            <b:widget id='Blog1' locked='true' title='ব্লগ পোস্ট' type='Blog'>
              <b:includable id='main' var='top'>
                <b:if cond='data:blog.pageType == &quot;item&quot;'>
                  <!-- SINGLE POST VIEW -->
                  <b:loop values='data:posts' var='post'>
                    <article class='single-post-view'>
                      <h1 class='single-headline'><data:post.title/></h1>
                      <div class='post-byline'>
                        <span>📅 প্রকাশিত: <data:post.dateHeader/></span>
                        <span>✍️ রিপোর্টার: <data:post.author/></span>
                      </div>
                      <div class='post-body-content'>
                        <data:post.body/>
                      </div>
                      <!-- BLOGGER COMMENT SYSTEM -->
                      <div class='comments-wrapper'>
                        <h3 class='comments-title'>💬 পাঠকদের মন্তব্য</h3>
                        <b:include data='post' name='comments'/>
                      </div>
                    </article>
                  </b:loop>
                <b:else/>
                  <!-- HOMEPAGE & CATEGORY POST GRID -->
                  <div class='post-grid'>
                    <b:loop values='data:posts' var='post'>
                      <article class='news-card'>
                        <div class='card-thumb'>
                          <b:if cond='data:post.firstImageUrl'>
                            <img expr:alt='data:post.title' expr:src='data:post.firstImageUrl'/>
                          <b:else/>
                            <img alt='RED LINE News' src='${logo}'/>
                          </b:if>
                        </div>
                        <div class='card-body'>
                          <div class='card-meta'>
                            <span class='card-category'>নিউজ</span>
                            <span>·</span>
                            <span><data:post.dateHeader/></span>
                          </div>
                          <h2 class='card-title'>
                            <a expr:href='data:post.url'><data:post.title/></a>
                          </h2>
                          <div class='card-snippet'>
                            <data:post.snippet/>
                          </div>
                          <a class='read-more-btn' expr:href='data:post.url'>বিস্তারিত পড়ুন →</a>
                        </div>
                      </article>
                    </b:loop>
                  </div>
                </b:if>
              </b:includable>
            </b:widget>
          </b:section>
        </main>

        <!-- SIDEBAR -->
        <aside class='sidebar-area'>
          <div class='sidebar-box'>
            <h3 class='sidebar-header'>🔴 তাজা খবর ও বার্তা</h3>
            <p style='font-size: 14px; line-height: 1.6; color: #475569;'>
              RED LINE ফেসবুক পেজ ও কমেন্টে খবরের লিংক পেয়ে এখানে এসে সম্পূর্ণ প্রতিবেদন পড়ুন। মন্তব্য করে আপনার মূল্যবান মতামত জানান।
            </p>
          </div>

          <div class='sidebar-box'>
            <h3 class='sidebar-header'>📌 অনুসরণ করুন</h3>
            <p style='font-size: 13px; color: #64748B; margin-bottom: 12px;'>ফেসবুক ও সোশ্যাল মিডিয়ায় আমাদের সাথে যুক্ত থাকুন।</p>
            <a href='https://facebook.com' style='background:#1877F2; color:#fff; display:block; text-align:center; padding:10px; border-radius:6px; font-weight:600;' target='_blank'>Facebook Page</a>
          </div>
        </aside>
      </div>
    </div>
  </div>

  <!-- FOOTER -->
  <footer class='main-footer'>
    <div class='container'>
      <div style='text-align: center;'>
        <h2 style='color: #FFFFFF; font-family: Plus Jakarta Sans; font-size: 24px; margin-bottom: 8px;'>RED <span style='color: #DC2626;'>LINE</span></h2>
        <p style='font-size: 14px; color: #94A3B8;'>সত্য, নিষ্ঠা ও সাহসের সাথে দেশ ও বিদেশের সর্বশেষ সংবাদ</p>
      </div>
      <div class='footer-bottom'>
        <p>© <data:blog.title/> - সর্বস্বত্ব সংরক্ষিত | পাওয়ার্ড বাই RED LINE ব্রডকাস্ট ইঞ্জিন</p>
      </div>
    </div>
  </footer>

  <!-- DYNAMIC LIVE BENGALI CLOCK JAVASCRIPT -->
  <script type='text/javascript'>
  //<![CDATA[
    function updateBengaliClock() {
      const bnDigits = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
      const bnDays = ['রবিবার','সোমবার','মঙ্গলবার','বুধবার','বৃহস্পতিবার','শুক্রবার','শনিবার'];
      const bnMonths = ['জানুয়ারি','ফেব্রুয়ারি','মার্চ','এপ্রিল','মে','জুন','জুলাই','আগস্ট','সেপ্টেম্বর','অক্টোবর','নভেম্বর','ডিসেম্বর'];

      const now = new Date();
      const dayName = bnDays[now.getDay()];
      const day = String(now.getDate()).replace(/[0-9]/g, d => bnDigits[d]);
      const month = bnMonths[now.getMonth()];
      const year = String(now.getFullYear()).replace(/[0-9]/g, d => bnDigits[d]);

      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0').replace(/[0-9]/g, d => bnDigits[d]);
      const seconds = String(now.getSeconds()).padStart(2, '0').replace(/[0-9]/g, d => bnDigits[d]);
      const period = hours >= 12 ? 'বিকাল/রাত' : 'সকাল';
      const dispHours = String(hours % 12 || 12).replace(/[0-9]/g, d => bnDigits[d]);

      const clockEl = document.getElementById('bengaliClock');
      if (clockEl) {
        clockEl.innerText = 'ঢাকা · ' + dayName + ', ' + day + ' ' + month + ' ' + year + ' | ' + period + ' ' + dispHours + ':' + minutes + ':' + seconds;
      }
    }
    setInterval(updateBengaliClock, 1000);
    updateBengaliClock();
  //]]>
  </script>
</body>
</html>`;
}
