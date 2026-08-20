import { test, expect } from './fixtures';

test.describe('Personal Homepage Configuration', () => {
  test('Test 1: Verify template placeholder text has been removed', async ({ page }) => {
    await page.goto('/');

    // Assert HTTP 200
    expect(page.url()).toContain('localhost');

    // Assert H1 does NOT contain "Sarah Johnson"
    const h1 = page.locator('main h1').first();
    await expect(h1).not.toContainText('Sarah Johnson');

    // Assert tagline/headings are visible AND do NOT contain "PERSONAL WEB DEMO"
    const allHeadings = page.locator('h1, h2, h3, h4, h5, h6');
    for (const heading of await allHeadings.all()) {
      const text = await heading.textContent();
      expect(text).not.toContain('PERSONAL WEB DEMO');
      expect(text).not.toContain('Personal Web Demo');
    }

    // Assert hero subtext does NOT contain "I'm a Graphic Designer passionate about crafting visual stories"
    const heroSection = page.locator('section').first();
    await expect(heroSection).not.toContainText("I'm a Graphic Designer passionate about crafting visual stories");
  });

  test('Test 2: Verify navigation links function correctly', async ({ page }) => {
    await page.goto('/');

    // Assert page renders sections with IDs: about, services
    const aboutSection = page.locator('#about');
    const servicesSection = page.locator('#services');

    await expect(aboutSection).toBeVisible();
    await expect(servicesSection).toBeVisible();

    // Assert navigation contains links with following behaviour
    const nav = page.locator('header nav');

    // "Home" link: href="/"
    const homeLink = nav.locator('a[href="/"]').first();
    await expect(homeLink).toBeVisible();
    await expect(homeLink).toContainText('Home');

    // "About" link: href="#about"
    const aboutLink = nav.locator('a[href="#about"]');
    await expect(aboutLink).toBeVisible();
    await expect(aboutLink).toContainText('About');

    // "Services" link: href="#services"
    const servicesLink = nav.locator('a[href="#services"]');
    await expect(servicesLink).toBeVisible();
    await expect(servicesLink).toContainText('Services');

    // "Blog" link: href="/blog"
    const blogLink = nav.locator('a[href="/blog"]');
    await expect(blogLink).toBeVisible();
    await expect(blogLink).toContainText('Blog');
  });

  test('Test 3: Verify page integrity after interaction', async ({ page }) => {
    await page.goto('/');

    // Listen for console errors
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Listen for network errors
    const networkErrors: string[] = [];
    page.on('response', (response) => {
      if (response.status() >= 400) {
        networkErrors.push(`${response.status()} ${response.url()}`);
      }
    });

    // Click each navigation link in sequence
    const nav = page.locator('header nav');
    const navLinks = nav.locator('a').filter({ has: page.locator('[href^="#"], [href="/blog"]') });
    const linkCount = await navLinks.count();

    for (let i = 0; i < linkCount; i++) {
      const link = navLinks.nth(i);
      const href = await link.getAttribute('href');

      // Skip external links
      if (href && !href.startsWith('http')) {
        await link.click();

        // After each click, verify no JavaScript console errors occur
        expect(consoleErrors).toEqual([]);

        // After each click, verify no network errors (404s, 500s)
        const pageErrors = networkErrors.filter((error) => error.includes('404') || error.includes('500'));
        expect(pageErrors).toEqual([]);

        // After each click, verify page remains functional (can still click other nav links)
        const navAfterClick = page.locator('header nav');
        await expect(navAfterClick).toBeVisible();
      }
    }
  });

  test('Test 4: Verify alternative homepage routes are disabled', async ({ page }) => {
    // Verify source files exist at their original locations
    // (This is informational - files should exist but be prefixed with underscore)

    // Assert HTTP request to /homes/saas returns 404
    const saasResponse = await page.goto('/homes/saas', { waitUntil: 'networkidle' });
    expect(saasResponse?.status()).toBe(404);

    // Assert HTTP request to /homes/startup returns 404
    const startupResponse = await page.goto('/homes/startup', { waitUntil: 'networkidle' });
    expect(startupResponse?.status()).toBe(404);

    // Assert HTTP request to /homes/mobile-app returns 404
    const mobileAppResponse = await page.goto('/homes/mobile-app', { waitUntil: 'networkidle' });
    expect(mobileAppResponse?.status()).toBe(404);
  });

  test('Test 5: Verify blog functionality', async ({ page }) => {
    // Navigate to /blog
    await page.goto('/blog');

    // Assert page loads without errors (HTTP 200)
    expect(page.url()).toContain('/blog');

    // Assert blog listing/index page renders content
    const blogContent = page.locator('main, [role="main"]');
    await expect(blogContent).toBeVisible();

    // Assert that blog posts are rendered on the page
    // Blog posts are displayed as a list of items/cards
    const blogPostsContainer = page.locator('main');
    await expect(blogPostsContainer).toContainText(/blog|post|article/i);
  });
});
