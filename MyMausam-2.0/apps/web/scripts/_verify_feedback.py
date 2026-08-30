from playwright.sync_api import sync_playwright

BASE = "http://localhost:62938"

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, channel="chrome")
        page = browser.new_page(viewport={"width": 430, "height": 900})
        page.goto(f"{BASE}/settings", wait_until="domcontentloaded", timeout=60000)
        page.get_by_role("button", name="Rate this app").click(timeout=15000)
        dialog = page.get_by_role("dialog")
        assert dialog.is_visible(), "Feedback dialog did not open from Settings"

        submit = dialog.get_by_role("button", name="Submit")
        assert submit.is_disabled(), "Submit should be disabled until a rating is chosen"

        dialog.get_by_role("radio", name="4 stars").click()
        dialog.locator("#feedback-comment").fill("Forecasts are useful, radar could load faster.")
        submit.click()
        page.get_by_text("Thank you for your feedback!").wait_for(timeout=5000)

        page.goto(f"{BASE}/", wait_until="domcontentloaded", timeout=60000)
        page.get_by_role("button", name="Open Navigation Drawer").click()
        page.get_by_role("button", name="Rate & Feedback").first.click()
        dialog = page.get_by_role("dialog")
        dialog.wait_for(state="visible", timeout=5000)
        assert dialog.get_by_role("radio", name="4 stars").is_checked()
        assert "radar could load faster" in dialog.locator("#feedback-comment").input_value()
        dialog.get_by_role("button", name="Cancel").click()

        print("PASS")
        browser.close()

if __name__ == "__main__":
    main()
