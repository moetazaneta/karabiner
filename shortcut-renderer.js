const { order, shortcuts } = window.SHORTCUT_INDEX;
const filters = document.querySelector("#filters");
const search = document.querySelector("#search");
const results = document.querySelector("#results");
const count = document.querySelector("#count");
let active = "All";

const escapeHtml = value => value.replace(/[&<>"']/g, character => ({
	"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;",
})[character]);

function render() {
	const query = search.value.trim().toLocaleLowerCase();
	const visible = shortcuts.filter(shortcut =>
		(active === "All" || shortcut.group === active) &&
		`${shortcut.group} ${shortcut.keys.join(" ")} ${shortcut.action}`.toLocaleLowerCase().includes(query)
	);
	filters.innerHTML = ["All", ...order].map(group =>
		`<button type="button" data-group="${escapeHtml(group)}" aria-pressed="${group === active}">${escapeHtml(group)}</button>`
	).join("");
	results.innerHTML = order.map(group => {
		const items = visible.filter(shortcut => shortcut.group === group);
		if (!items.length) return "";
		return `<section><h2>${escapeHtml(group)}<span>${items.length}</span></h2><div class="rows">${
			items.map(shortcut => `<div class="row"><div class="keys" aria-label="${shortcut.keys.map(escapeHtml).join(" plus ")}">${
				shortcut.keys.map((key, index) => `${index ? '<span class="join" aria-hidden="true">+</span>' : ""}<kbd>${escapeHtml(key)}</kbd>`).join("")
			}</div><div class="action">${escapeHtml(shortcut.action)}</div></div>`).join("")
		}</div></section>`;
	}).join("");
	count.textContent = `${visible.length}/${shortcuts.length}`;
}

filters.addEventListener("click", event => {
	const button = event.target.closest("button");
	if (!button) return;
	active = button.dataset.group;
	render();
});
search.addEventListener("input", render);
document.addEventListener("keydown", event => {
	if (event.key === "/" && document.activeElement !== search) {
		event.preventDefault();
		search.focus();
	} else if (event.key === "Escape" && search.value) {
		search.value = "";
		render();
	}
});
render();
