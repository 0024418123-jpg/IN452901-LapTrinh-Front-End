// Câu 2: viết JavaScript tại đây

const API_URL = 'http://localhost:4000';

// Hàm có sẵn: đổi giờ UTC sang giờ Việt Nam, vd "08:00 12/09/2026"
const formatDateTime = (iso) =>
  new Date(iso).toLocaleString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    hour: '2-digit', minute: '2-digit',
    day: '2-digit', month: '2-digit', year: 'numeric',
  });

// Câu 2a: Tính số chỗ còn lại
const formatSeats = (event) => {
    const remaining = Number(event.capacity) - Number(event.registeredCount);

    if (remaining <= 0) {
        return "Hết chỗ";
    }

    return `Còn ${remaining}/${event.capacity} chỗ`;
};

// Câu 2b: Hiển thị danh sách sự kiện bằng DOM
const renderEvents = (events) => {
    const eventList = document.querySelector("#event-list");

    const cards = events.map((event) => {
        const article = document.createElement("article");
        article.className = "event-card";

        const img = document.createElement("img");
        img.src = "img/event.svg";
        img.alt = event.name;

        const title = document.createElement("h2");

        const link = document.createElement("a");
        link.textContent = event.name;
        link.href = `event-detail.html?id=${encodeURIComponent(event.id)}`;

        title.appendChild(link);

        const timeText = document.createElement("p");
        timeText.textContent = "Thời gian: ";

        const time = document.createElement("time");
        time.dateTime = event.startTime;
        time.textContent = formatDateTime(event.startTime);

        timeText.appendChild(time);

        const location = document.createElement("p");
        location.textContent = "Địa điểm: " + event.location;

        const seats = document.createElement("p");
        seats.textContent = formatSeats(event);

        if (seats.textContent === "Hết chỗ") {
            seats.className = "sold-out";
        }

        article.append(img, title, timeText, location, seats);

        return article;
    });

    eventList.replaceChildren(...cards);
};

// Câu 2c: Tải danh sách sự kiện từ API
const loadEvents = async (keyword = "") => {
    const status = document.querySelector("#status");

    status.textContent = "Đang tải...";

    try {
        const params = new URLSearchParams();

        params.set("pageSize", "50");

        if (keyword.trim() !== "") {
            params.set("q", keyword.trim());
        }

        const response = await fetch(
            `${API_URL}/api/events?${params.toString()}`
        );

        if (!response.ok) {
            throw new Error("Không tải được dữ liệu");
        }

        const data = await response.json();

        renderEvents(data.items);

        if (data.totalCount === 0) {
            status.textContent =
                "Không có sự kiện nào khớp từ khóa.";
        } else {
            status.textContent =
                `Tìm thấy ${data.totalCount} sự kiện`;
        }

    } catch (error) {
        status.textContent =
            "Không tải được dữ liệu, vui lòng thử lại.";

        document.querySelector("#event-list").replaceChildren();
    }
};

// Xử lý form tìm kiếm
const searchForm = document.querySelector("#search-form");

searchForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const keyword = document
        .querySelector("#keyword")
        .value
        .trim();

    loadEvents(keyword);
});

// Tự động tải sự kiện khi mở trang
loadEvents();
