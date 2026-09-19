const targets = await fetch("http://127.0.0.1:9444/json").then((response) =>
  response.json(),
);
const target = targets.find((entry) => entry.url.includes("localhost:3200/enquiry"));
if (!target) throw new Error("Enquiry target not found.");

const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

let nextId = 0;
const pending = new Map();
const browserErrors = [];
socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (message.method === "Runtime.exceptionThrown") {
    browserErrors.push(message.params.exceptionDetails.text);
  }
  if (message.method === "Log.entryAdded" && message.params.entry.level === "error") {
    browserErrors.push(message.params.entry.text);
  }
  if (!message.id) return;
  const handler = pending.get(message.id);
  if (!handler) return;
  pending.delete(message.id);
  if (message.error) handler.reject(new Error(message.error.message));
  else handler.resolve(message.result);
});

function command(method, params = {}) {
  const id = ++nextId;
  socket.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

async function evaluate(expression) {
  const result = await command("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (result.exceptionDetails) {
    throw new Error(
      `${result.exceptionDetails.text}: ${result.exceptionDetails.exception?.description ?? ""}`,
    );
  }
  return result.result.value;
}

const pause = (milliseconds = 60) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

async function clickOption(name, label) {
  await evaluate(`document.querySelector('[name=${JSON.stringify(name)}]').click()`);
  await pause();
  await evaluate(`Array.from(document.querySelectorAll('[role="option"]'))
    .find((option) => option.textContent.trim().includes(${JSON.stringify(label)})).click()`);
  await pause();
}

async function loadInstitutionForm() {
  await command("Page.reload", { ignoreCache: true });
  await pause(500);
  await evaluate(`Array.from(document.querySelectorAll('[role="tab"]'))
    .find((tab) => tab.textContent.includes('Institution Enquiry')).click()`);
  await pause(150);
}

await command("Runtime.enable");
await command("Page.enable");
await command("Log.enable");
await loadInstitutionForm();

await evaluate(`document.querySelector('[name="timeframe"]').click()`);
await pause();
const options = await evaluate(
  `Array.from(document.querySelectorAll('[role="option"]')).map((option) => option.textContent.trim())`,
);
await evaluate(`document.querySelector('[name="timeframe"]').click()`);

await clickOption("timeframe", "Next month");
const normalSelection = await evaluate(`({
  text: document.querySelector('[name="timeframe"]').textContent,
  hasDateInput: Boolean(document.querySelector('[name="preferredDate"]')),
})`);

await clickOption("timeframe", "Choose an exact date");
const pickerState = await evaluate(`(() => {
  const input = document.querySelector('[name="preferredDate"]');
  return {
    visible: Boolean(input && input.getBoundingClientRect().width),
    min: input?.min,
    focused: document.activeElement === input,
    label: input?.getAttribute('aria-label'),
    describedBy: input?.getAttribute('aria-describedby'),
  };
})()`);
await command("Input.dispatchKeyEvent", { type: "keyDown", key: "Escape", code: "Escape" });
await command("Input.dispatchKeyEvent", { type: "keyUp", key: "Escape", code: "Escape" });
await pause();
const cancelPreserved = await evaluate(
  `document.querySelector('[name="timeframe"]').textContent.includes('Next month')`,
);

await clickOption("timeframe", "Choose an exact date");
const selectedIsoDate = await evaluate(`(() => {
  const input = document.querySelector('[name="preferredDate"]');
  const date = new Date(input.min + 'T12:00:00Z');
  date.setUTCDate(date.getUTCDate() + 5);
  const value = date.toISOString().slice(0, 10);
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, value);
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
  return value;
})()`);
await pause(100);
const formattedSelection = await evaluate(
  `document.querySelector('[name="timeframe"]').textContent.trim()`,
);

await clickOption("timeframe", "Choose an exact date");
const widths = [375, 414, 640, 641, 642, 768, 900, 980, 1023, 1024, 1280, 1440, 1920];
const responsiveResults = [];
for (const theme of ["dark", "light"]) {
  await evaluate(`document.documentElement.dataset.theme = ${JSON.stringify(theme)}`);
  for (const width of widths) {
    await command("Emulation.setDeviceMetricsOverride", {
      width,
      height: 1200,
      deviceScaleFactor: 1,
      mobile: width <= 640,
    });
    await pause(50);
    const measurement = await evaluate(`(() => {
      const input = document.querySelector('[name="preferredDate"]');
      const wrapper = input.parentElement;
      const field = wrapper.parentElement;
      const rect = input.getBoundingClientRect();
      const wrapperRect = wrapper.getBoundingClientRect();
      return {
        viewport: innerWidth,
        documentFits: document.documentElement.scrollWidth <= innerWidth,
        controlFits: rect.width <= wrapperRect.width && input.scrollWidth <= input.clientWidth,
        height: rect.height,
        fieldFits: field.scrollWidth <= field.clientWidth,
        min: input.min,
      };
    })()`);
    responsiveResults.push({ theme, width, ...measurement });
  }
}
const responsiveFailures = responsiveResults.filter(
  (result) =>
    result.viewport !== result.width ||
    !result.documentFits ||
    !result.controlFits ||
    !result.fieldFits ||
    result.height !== 49 ||
    !/^\d{4}-\d{2}-\d{2}$/.test(result.min),
);

await command("Input.dispatchKeyEvent", { type: "keyDown", key: "Escape", code: "Escape" });
await command("Input.dispatchKeyEvent", { type: "keyUp", key: "Escape", code: "Escape" });
await pause();
await evaluate(`document.querySelector('[name="timeframe"]').focus()`);
await command("Input.dispatchKeyEvent", { type: "keyDown", key: "ArrowDown", code: "ArrowDown" });
await command("Input.dispatchKeyEvent", { type: "keyUp", key: "ArrowDown", code: "ArrowDown" });
await command("Input.dispatchKeyEvent", { type: "keyDown", key: "End", code: "End" });
await command("Input.dispatchKeyEvent", { type: "keyUp", key: "End", code: "End" });
const keyboardActiveOption = await evaluate(
  `document.getElementById(document.querySelector('[name="timeframe"]').getAttribute('aria-activedescendant')).textContent.trim()`,
);
await command("Input.dispatchKeyEvent", { type: "keyDown", key: "Enter", code: "Enter" });
await command("Input.dispatchKeyEvent", { type: "keyUp", key: "Enter", code: "Enter" });
await pause();
const keyboardOpenedDate = await evaluate(
  `document.activeElement?.getAttribute('name') === 'preferredDate'`,
);
await command("Input.dispatchKeyEvent", { type: "keyDown", key: "Escape", code: "Escape" });
await command("Input.dispatchKeyEvent", { type: "keyUp", key: "Escape", code: "Escape" });
await pause();
if (await evaluate(`Boolean(document.querySelector('[name="preferredDate"]'))`)) {
  await command("Input.dispatchKeyEvent", { type: "keyDown", key: "Escape", code: "Escape" });
  await command("Input.dispatchKeyEvent", { type: "keyUp", key: "Escape", code: "Escape" });
  await pause();
}

await clickOption("timeframe", "Choose an exact date");
await evaluate(`(() => {
  const input = document.querySelector('[name="preferredDate"]');
  const nextDate = new Date(${JSON.stringify(selectedIsoDate)} + 'T12:00:00Z');
  nextDate.setUTCDate(nextDate.getUTCDate() + 1);
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, nextDate.toISOString().slice(0, 10));
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
})()`);
await pause();
await clickOption("timeframe", "Next month");

await evaluate(`(() => {
  window.__institutionPayload = null;
  window.fetch = async (_url, init) => {
    window.__institutionPayload = JSON.parse(init.body);
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  };
  const setValue = (name, value) => {
    const input = document.querySelector('[name="' + name + '"]');
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  };
  setValue('institutionName', 'Test College');
  setValue('contactName', 'Test User');
  setValue('designation', 'Coordinator');
  setValue('phone', '9876543210');
  setValue('email', 'test@example.com');
  setValue('city', 'Ahmedabad');
})()`);
await clickOption("institutionType", "College");
await clickOption("studentGroup", "College Students");
await clickOption("studentCount", "Up to 30");
await evaluate(`document.querySelector('[name="interests"][value="Practical Workshop"]').click()`);
await pause();
await evaluate(`document.querySelector('form').requestSubmit()`);
await pause(250);
const submittedNormalPayload = await evaluate(`window.__institutionPayload`);
const successReached = await evaluate(
  `Array.from(document.querySelectorAll('h4')).some((heading) => heading.textContent.includes('Enquiry received'))`,
);
await evaluate(`Array.from(document.querySelectorAll('button'))
  .find((button) => button.textContent.includes('Send another enquiry')).click()`);
await pause();
const resetState = await evaluate(`({
  placeholder: document.querySelector('[name="timeframe"]').textContent.includes('Select a preferred timeframe'),
  noDateInput: !document.querySelector('[name="preferredDate"]'),
})`);

console.log(JSON.stringify({
  options,
  normalSelection,
  pickerState,
  cancelPreserved,
  selectedIsoDate,
  formattedSelection,
  responsiveChecks: responsiveResults.length,
  responsiveFailures,
  keyboardActiveOption,
  keyboardOpenedDate,
  submittedNormalPayload,
  successReached,
  resetState,
  browserErrors,
}, null, 2));

const expectedOptions = [
  "As soon as possible",
  "Within 2–4 weeks",
  "Next month",
  "Choose an exact date",
];
if (
  JSON.stringify(options) !== JSON.stringify(expectedOptions) ||
  normalSelection.hasDateInput ||
  !normalSelection.text.includes("Next month") ||
  !pickerState.visible ||
  !pickerState.focused ||
  pickerState.label !== "Choose an exact preferred date" ||
  !pickerState.describedBy.includes("institution-timeframe-help") ||
  !cancelPreserved ||
  !formattedSelection.startsWith("Exact date — ") ||
  responsiveFailures.length ||
  keyboardActiveOption !== "Choose an exact date" ||
  !keyboardOpenedDate ||
  submittedNormalPayload?.timeframe !== "Next month" ||
  submittedNormalPayload?.preferredDate !== "" ||
  !successReached ||
  !resetState.placeholder ||
  !resetState.noDateInput ||
  browserErrors.length
) process.exitCode = 1;

socket.send(JSON.stringify({ id: ++nextId, method: "Browser.close" }));
await pause(250);
