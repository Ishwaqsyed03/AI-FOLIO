import { generatePortfolioFiles } from './zipGenerator';

const GITHUB_API_BASE = 'https://api.github.com';

const encodeBase64Utf8 = (value) => {
  const bytes = new TextEncoder().encode(value);
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

const githubRequest = async (path, token, options = {}) => {
  const call = async (authorizationHeader) => {
    const response = await fetch(`${GITHUB_API_BASE}${path}`, {
      ...options,
      headers: {
        Authorization: authorizationHeader,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });

    const contentType = response.headers.get('content-type') || '';
    const body = contentType.includes('application/json') ? await response.json() : await response.text();

    return { response, body };
  };

  // GitHub accepts different auth formats depending on token type.
  // Try Bearer first, then fall back to classic PAT format.
  let result = await call(`Bearer ${token}`);
  if (!result.response.ok && (result.response.status === 401 || result.response.status === 403)) {
    result = await call(`token ${token}`);
  }

  if (!result.response.ok) {
    const message = typeof result.body?.message === 'string'
      ? result.body.message
      : `GitHub request failed (${result.response.status})`;
    throw new Error(message);
  }

  return result.body;
};

const getCurrentUser = async (token) => githubRequest('/user', token);

const getFileShaIfExists = async ({ token, owner, repoName, path, branch }) => {
  try {
    const fileInfo = await githubRequest(
      `/repos/${owner}/${repoName}/contents/${encodeURIComponent(path)}?ref=${encodeURIComponent(branch)}`,
      token
    );
    return fileInfo?.sha || null;
  } catch (error) {
    if (/Not Found/i.test(error.message)) {
      return null;
    }
    throw error;
  }
};

const createRepoIfNeeded = async ({ token, owner, repoName, isPrivate, description }) => {
  try {
    await githubRequest('/user/repos', token, {
      method: 'POST',
      body: JSON.stringify({
        name: repoName,
        private: isPrivate,
        description,
        auto_init: false
      })
    });
    return;
  } catch (error) {
    if (/Resource not accessible by personal access token/i.test(error.message)) {
      // Fine-grained tokens may not be allowed to create repositories.
      // Continue if repo already exists and token has access.
      try {
        await githubRequest(`/repos/${owner}/${repoName}`, token);
        return;
      } catch (lookupError) {
        throw new Error(
          'Token cannot create repositories automatically. Use a classic PAT with repo scope, or a fine-grained token with repository creation permission. Then retry.'
        );
      }
    }

    if (!/name already exists on this account/i.test(error.message)) {
      throw error;
    }
  }

  await githubRequest(`/repos/${owner}/${repoName}`, token);
};

const putFile = async ({ token, owner, repoName, path, content, message, branch }) => {
  const sha = await getFileShaIfExists({ token, owner, repoName, path, branch });

  await githubRequest(`/repos/${owner}/${repoName}/contents/${encodeURIComponent(path)}`, token, {
    method: 'PUT',
    body: JSON.stringify({
      message,
      content: encodeBase64Utf8(content),
      branch,
      ...(sha ? { sha } : {})
    })
  });
};

const enablePages = async ({ token, owner, repoName, branch }) => {
  try {
    await githubRequest(`/repos/${owner}/${repoName}/pages`, token, {
      method: 'POST',
      body: JSON.stringify({
        source: {
          branch,
          path: '/'
        }
      })
    });
  } catch (error) {
    if (!/already exists|has already been taken|Resource not accessible by personal access token/i.test(error.message)) {
      throw error;
    }
  }
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isBuildReady = (status) => /built|success|complete|deployed/i.test(status || '');

export const waitForGitHubPagesReady = async ({
  token,
  owner,
  repoName,
  timeoutSeconds = 180,
  intervalSeconds = 4,
  onTick
}) => {
  const startedAt = Date.now();
  const normalizedToken = token.trim();

  while ((Date.now() - startedAt) / 1000 < timeoutSeconds) {
    const elapsedSeconds = Math.floor((Date.now() - startedAt) / 1000);
    let buildStatus = 'queued';

    try {
      const latestBuild = await githubRequest(
        `/repos/${owner}/${repoName}/pages/builds/latest`,
        normalizedToken
      );
      buildStatus = latestBuild?.status || latestBuild?.state || 'building';
    } catch (error) {
      // Build endpoint can be temporarily unavailable right after enabling pages.
      buildStatus = 'building';
    }

    if (onTick) {
      onTick({ elapsedSeconds, buildStatus });
    }

    if (isBuildReady(buildStatus)) {
      return { ready: true, elapsedSeconds, buildStatus };
    }

    await sleep(intervalSeconds * 1000);
  }

  const elapsedSeconds = Math.floor((Date.now() - startedAt) / 1000);
  return { ready: false, elapsedSeconds, buildStatus: 'timeout' };
};

export const deployPortfolioToGitHubPages = async ({
  token,
  repoName,
  isPrivate = false,
  commitMessage = 'Deploy portfolio from AI-FOLIO',
  portfolioData,
  template,
  description = 'Portfolio generated with AI-FOLIO',
  branch = 'main'
}) => {
  if (!token?.trim()) {
    throw new Error('GitHub token is required.');
  }

  if (!repoName?.trim()) {
    throw new Error('Repository name is required.');
  }

  const normalizedToken = token.trim();

  const user = await getCurrentUser(normalizedToken);
  const owner = user.login;

  await createRepoIfNeeded({
    token: normalizedToken,
    owner,
    repoName,
    isPrivate,
    description
  });

  const files = await generatePortfolioFiles(portfolioData, template);

  for (const [path, content] of Object.entries(files)) {
    await putFile({
      token,
      owner,
      repoName,
      path,
      content,
      message: commitMessage,
      branch
    });
  }

  try {
    await enablePages({ token: normalizedToken, owner, repoName, branch });
  } catch (error) {
    if (/Resource not accessible by personal access token/i.test(error.message)) {
      throw new Error(
        'Token can push files but cannot enable GitHub Pages. Ensure token has Pages (Read/Write) permission for this repository, then retry.'
      );
    }
    throw error;
  }

  return {
    owner,
    repoName,
    repoUrl: `https://github.com/${owner}/${repoName}`,
    pagesUrl: `https://${owner}.github.io/${repoName}/`
  };
};
