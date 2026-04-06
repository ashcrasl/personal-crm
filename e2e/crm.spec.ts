import { test, expect } from "@playwright/test"

// Helper: log in before each test
async function login(page: import("@playwright/test").Page) {
  await page.goto("/login")
  await page.getByLabel("Password").fill(process.env.TEST_PASSWORD ?? "test123")
  await page.getByRole("button", { name: "Sign In" }).click()
  await page.waitForURL("/")
}

test.describe("Authentication", () => {
  test("Given the login page, When entering the correct password, Then I reach the dashboard", async ({
    page,
  }) => {
    await login(page)
    await expect(page).toHaveURL("/")
    await expect(page.getByText("Dashboard").first()).toBeVisible()
  })

  test("Given the login page, When entering a wrong password, Then I see an error", async ({
    page,
  }) => {
    await page.goto("/login")
    await page.getByLabel("Password").fill("wrong-password-123")
    await page.getByRole("button", { name: "Sign In" }).click()
    await expect(page.getByText("Invalid password")).toBeVisible()
  })
})

test.describe("Contact CRUD", () => {
  test.beforeEach(async ({ page }) => {
    await login(page)
  })

  test("Given I am logged in, When I add a contact, Then they appear in the contact list", async ({
    page,
  }) => {
    await page.goto("/contacts/new")
    await page.getByLabel("Name").fill("E2E Test Contact")
    await page.getByLabel("Company").fill("Test Corp")
    await page.getByLabel("Role").fill("QA Engineer")
    await page.getByLabel("Email").fill("e2e@test.com")
    await page.getByRole("button", { name: "Add Contact" }).click()

    // Should redirect to contact detail
    await expect(page.getByText("E2E Test Contact")).toBeVisible()
    await expect(page.getByText("QA Engineer at Test Corp")).toBeVisible()
  })

  test("Given a contact exists, When I edit their name, Then the update is reflected", async ({
    page,
  }) => {
    // Navigate to contacts and find one
    await page.goto("/contacts")
    const contactLink = page.getByRole("link").filter({ hasText: "E2E Test Contact" }).first()

    // Skip if the contact doesn't exist (depends on previous test)
    if ((await contactLink.count()) === 0) {
      test.skip()
      return
    }

    await contactLink.click()
    await page.getByRole("link", { name: "Edit" }).click()
    await page.getByLabel("Name").fill("E2E Updated Contact")
    await page.getByRole("button", { name: "Save Changes" }).click()

    await expect(page.getByText("E2E Updated Contact")).toBeVisible()
  })
})

test.describe("Command Palette", () => {
  test.beforeEach(async ({ page }) => {
    await login(page)
  })

  test("Given I am on any page, When I press Cmd+K, Then the command palette opens", async ({
    page,
  }) => {
    await page.goto("/")
    await page.keyboard.press("Meta+k")
    await expect(page.getByPlaceholder("Search contacts or navigate...")).toBeVisible()
  })

  test("Given the command palette is open, When I type a nav item, Then I can navigate to it", async ({
    page,
  }) => {
    await page.goto("/")
    await page.keyboard.press("Meta+k")
    await page.getByPlaceholder("Search contacts or navigate...").fill("Birthdays")
    await page.keyboard.press("Enter")
    await expect(page).toHaveURL("/birthdays")
  })

  test("Given the command palette is open, When I press Escape, Then it closes", async ({
    page,
  }) => {
    await page.goto("/")
    await page.keyboard.press("Meta+k")
    await expect(page.getByPlaceholder("Search contacts or navigate...")).toBeVisible()
    await page.keyboard.press("Escape")
    await expect(page.getByPlaceholder("Search contacts or navigate...")).not.toBeVisible()
  })
})

test.describe("Birthdays Page", () => {
  test.beforeEach(async ({ page }) => {
    await login(page)
  })

  test("Given I navigate to birthdays, When the page loads, Then I see the calendar grid", async ({
    page,
  }) => {
    await page.goto("/birthdays")
    await expect(page.getByText("Full Year")).toBeVisible()
    // Should show all 12 months
    await expect(page.getByText("January")).toBeVisible()
    await expect(page.getByText("December")).toBeVisible()
  })
})

test.describe("Mobile Responsive", () => {
  test.use({ viewport: { width: 375, height: 812 } })

  test("Given I am on mobile, When I tap the menu, Then the navigation opens", async ({
    page,
  }) => {
    await login(page)
    // The hamburger menu should be visible on mobile
    await page.getByRole("button").filter({ has: page.locator("svg") }).first().click()
    await expect(page.getByText("Dashboard")).toBeVisible()
    await expect(page.getByText("Contacts")).toBeVisible()
    await expect(page.getByText("Birthdays")).toBeVisible()
  })
})
