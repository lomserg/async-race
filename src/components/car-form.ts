export function renderCarForm(): string {
  return `
        <form class="car-form" id="car-form">
            <label>
                Name
                <input
                    id="car-name"
                    name="name"
                    type="text"
                    required
                >
            </label>

            <label>
                Color
                <input
                    id="car-color"
                    name="color"
                    type="color"
                    value="#000000"
                >
            </label>

            <button type="submit">
                Create
            </button>
        </form>
    `;
}
