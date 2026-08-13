type Course = {
    courseName: string
    description: string
    mainCategory: string
    pricePaise: number
    priceUsdCents: number
    refundable: boolean
}

type CountryCode = "IN" | "US"

type CountryResponse = {
    country_code: CountryCode
}

const BASE_URL = "https://syncsphere-hiv6.onrender.com"

function isCourse(value: unknown): value is Course {
    if (typeof value !== "object" || value === null) {
        return false
    }

    const course = value as Record<string, unknown>

    return (
        typeof course.courseName === "string" &&
        typeof course.description === "string" &&
        typeof course.mainCategory === "string" &&
        typeof course.pricePaise === "number" &&
        Number.isFinite(course.pricePaise) &&
        typeof course.priceUsdCents === "number" &&
        Number.isFinite(course.priceUsdCents) &&
        typeof course.refundable === "boolean"
    )
}

function isCourseArray(value: unknown): value is Course[] {
    return Array.isArray(value) && value.every(isCourse)
}

function isCountryResponse(value: unknown): value is CountryResponse {
    if (typeof value !== "object" || value === null) {
        return false
    }

    const response = value as Record<string, unknown>

    return response.country_code === "IN" || response.country_code === "US"
}

async function fetchCourses(): Promise<Course[]> {
    const response = await fetch(`${BASE_URL}/assignment/course-data`, {
        method: "GET",
    })

    if (!response.ok) {
        throw new Error(`Course request failed with status ${response.status}`)
    }

    const data: unknown = await response.json()

    if (!isCourseArray(data)) {
        throw new Error("Course response has an unexpected format")
    }

    return data
}

async function fetchCountry(): Promise<CountryCode> {
    const response = await fetch(`${BASE_URL}/assignment/country-code`, {
        method: "GET",
    })

    if (!response.ok) {
        throw new Error(`Country request failed with status ${response.status}`)
    }

    const data: unknown = await response.json()

    if (!isCountryResponse(data)) {
        throw new Error("Country response has an unexpected format")
    }

    return data.country_code
}

export default function CoursesSection() {
    return (
        <section style={styles.section}>
            <p style={styles.message}>Courses component</p>
        </section>
    )
}

const styles = {
    section: {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
        fontFamily: "Inter, sans-serif",
    },
    message: {
        margin: 0,
        color: "#1F1633",
        fontSize: "18px",
    },
}
