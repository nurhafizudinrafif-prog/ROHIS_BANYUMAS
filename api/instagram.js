// Vercel Serverless Function: Auto-Sync Instagram Profile & Feed
const UPSTASH_URL = 'https://holy-gobbler-70550.upstash.io';
const UPSTASH_TOKEN = 'gQAAAAAAAROWAAIgcDJlOTE0NTNiY2EyYjA0MjU3YmNjNjJkMzc3YmZmYjQ2NA';
const CMS_KEY = 'rohis_cms_data';
const USERNAME = 'rohis_banyumas';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // 1. Fetch live public data from Instagram with social crawler UA
    const igRes = await fetch(`https://www.instagram.com/${USERNAME}/`, {
      headers: {
        'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    let liveProfile = null;

    if (igRes.ok) {
      const html = await igRes.text();

      // Extract stats: "973 Followers, 81 Following, 701 Posts - See Instagram photos..."
      const descMatch =
        html.match(/<meta [^>]*property="og:description" [^>]*content="([^"]+)"/i) ||
        html.match(/<meta [^>]*content="([^"]+)" [^>]*property="og:description"/i) ||
        html.match(/<meta [^>]*name="description" [^>]*content="([^"]+)"/i);

      let followers = '973';
      let following = '81';
      let posts = '701';

      if (descMatch) {
        const desc = descMatch[1];
        const fMatch = desc.match(/([\d,KMkm.]+)\s*Followers/i);
        const flMatch = desc.match(/([\d,KMkm.]+)\s*Following/i);
        const pMatch = desc.match(/([\d,KMkm.]+)\s*Posts/i);
        if (fMatch) followers = fMatch[1];
        if (flMatch) following = flMatch[1];
        if (pMatch) posts = pMatch[1];
      }

      // Extract Bio
      let bio =
        'Official Account Rohis Kabupaten Banyumas\nDibawah Naungan Kementerian Agama Kab. Banyumas @kankemenagbanyumas\nEmail : rohisbanyumas9@gmail.com';
      const bioMatch = html.match(/biography["']?\s*:\s*["']([^"']+)["']/i);
      if (bioMatch) {
        bio = bioMatch[1]
          .replace(/\\n/g, '\n')
          .replace(/\\u0040/g, '@')
          .replace(/\\u0026/g, '&');
      }

      // Extract Avatar
      const imgMatch =
        html.match(/<meta [^>]*property="og:image" [^>]*content="([^"]+)"/i) ||
        html.match(/<meta [^>]*content="([^"]+)" [^>]*property="og:image"/i);
      const avatar = imgMatch ? imgMatch[1].replace(/&amp;/g, '&') : null;

      // Extract external URL
      const extUrlMatch = html.match(/external_url["']?\s*:\s*["']([^"']+)["']/i);
      const externalUrl = extUrlMatch
        ? extUrlMatch[1].replace(/\\u0026/g, '&')
        : 'https://youtube.com/@rohisbanyumas9?si=bJpq4dcozF81AHGr';

      liveProfile = {
        handle: USERNAME,
        displayName: 'Rohis Kabupaten Banyumas',
        postsCount: posts,
        followersCount: followers,
        followingCount: following,
        bio,
        avatar,
        email: 'rohisbanyumas9@gmail.com',
        youtubeUrl: externalUrl,
        instagramUrl: `https://www.instagram.com/${USERNAME}/`,
        isLive: true,
        lastSynced: new Date().toISOString(),
      };
    }

    // 2. Fetch current CMS data (for cached reels and profile backup) from Upstash Cloud Redis
    let cloudData = {};
    try {
      const redisRes = await fetch(`${UPSTASH_URL}/get/${CMS_KEY}`, {
        headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
      });
      if (redisRes.ok) {
        const raw = await redisRes.json();
        if (raw.result) {
          let parsed = raw.result;
          while (typeof parsed === 'string') {
            try {
              parsed = JSON.parse(parsed);
            } catch (e) {
              break;
            }
          }
          cloudData = parsed || {};
        }
      }
    } catch (e) {
      console.error('Redis fetch error:', e.message);
    }

    // 3. If we got live profile, persist it into Upstash Cloud Redis
    if (liveProfile && cloudData) {
      cloudData.instagramProfile = liveProfile;
      cloudData.lastIgSync = new Date().toISOString();

      try {
        await fetch(`${UPSTASH_URL}/set/${CMS_KEY}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${UPSTASH_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(JSON.stringify(cloudData)),
        });
      } catch (err) {
        console.error('Redis save error:', err.message);
      }
    }

    const finalProfile = liveProfile || cloudData.instagramProfile || {
      handle: USERNAME,
      displayName: 'Rohis Kabupaten Banyumas',
      postsCount: '701',
      followersCount: '973',
      followingCount: '81',
      bio: 'Official Account Rohis Kabupaten Banyumas\nDibawah Naungan Kementerian Agama Kab. Banyumas @kankemenagbanyumas\nEmail : rohisbanyumas9@gmail.com',
      email: 'rohisbanyumas9@gmail.com',
      youtubeUrl: 'https://youtube.com/@rohisbanyumas9?si=bJpq4dcozF81AHGr',
      instagramUrl: `https://www.instagram.com/${USERNAME}/`,
      isLive: false,
      lastSynced: new Date().toISOString(),
    };

    // Cache header: cache for 2 minutes on edge, allow stale while revalidating
    res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=300');

    return res.status(200).json({
      success: true,
      profile: finalProfile,
      reels: cloudData.instagramReels || [],
      source: liveProfile ? 'live_instagram_scrape' : 'cloud_cache',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Instagram handler error:', err);
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}
